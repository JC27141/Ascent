// Custom service worker (vite-plugin-pwa injectManifest source).
//
// Two jobs:
//  1. Keep the existing offline precaching (Workbox).
//  2. Handle taps on the persistent climb-logging notification's grade actions
//     so a send/attempt can be logged straight from a locked Android screen.
//
// The worker claims clients and navigates open windows on activation so installed
// PWAs do not stay pinned to an old cached app shell after a production deploy.
//
// The critical detail for lock-screen logging: a grade tap NEVER calls
// clients.openWindow(). Opening the app would force the phone to unlock. Instead
// we just update IndexedDB (via the shared liveLog store) and re-post the
// notification with the new counts — the phone stays locked the whole time.

import { precacheAndRoute } from "workbox-precaching";
import { applyDelta, getActive, notificationOptions } from "./liveLog.js";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.all(windows.map(client => (
      "navigate" in client ? client.navigate(client.url).catch(() => {}) : Promise.resolve()
    )));
  })());
});

precacheAndRoute(self.__WB_MANIFEST || []);

async function repost(week, sessionId) {
  const rec = await getActive(week, sessionId);
  if (!rec) return;
  const { title, options } = notificationOptions(rec);
  await self.registration.showNotification(title, options);
}

self.addEventListener("notificationclick", (event) => {
  const action = event.action; // e.g. "g3" for a tap on the V3 button
  const data = (event.notification && event.notification.data) || {};
  const { week, sessionId, logKind } = data;

  // Body tap (no action button): keep the persistent logger alive, don't open
  // the app (which would require an unlock).
  if (!action || !/^g\d+$/.test(action)) {
    if (week != null && sessionId != null) event.waitUntil(repost(week, sessionId));
    return;
  }

  const grade = +action.slice(1);
  event.waitUntil(
    (async () => {
      await applyDelta(week, sessionId, logKind || "send", grade, 1);
      await repost(week, sessionId);
    })()
  );
});
