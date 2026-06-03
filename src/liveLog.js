// Shared live-session logging store, used by BOTH the page (App.jsx) and the
// service worker (sw.js). Every send/attempt tapped during a session — whether
// from the in-app big buttons or a lock-screen notification action (handled in
// the SW) — is written here immediately, so the two stay consistent and nothing
// is lost if the app is backgrounded or the screen sleeps.
//
// IndexedDB (not localStorage) is required because a service worker cannot touch
// localStorage. A BroadcastChannel lets a lock-screen tap in the SW push the new
// counts to the open page in real time.

const DB_NAME = "ascent-live";
const STORE = "active";
const DB_VERSION = 1;
const CHANNEL = "ascent-log";

const activeKey = (week, sessionId) => `${week}-${sessionId}`;

let _bc = null;
function channel() {
  if (typeof BroadcastChannel === "undefined") return null;
  if (!_bc) _bc = new BroadcastChannel(CHANNEL);
  return _bc;
}

let _dbPromise = null;
function openDb() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _dbPromise;
}

function store(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function emptyRecord(week, sessionId) {
  return {
    key: activeKey(week, sessionId),
    week,
    sessionId,
    gradeButtons: [],
    logKind: "send",
    volumeByGrade: {},
    attemptsByGrade: {},
    lastAction: null,
    updatedAt: Date.now(),
  };
}

export async function getActive(week, sessionId) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = store(db, "readonly").get(activeKey(week, sessionId));
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function putRecord(rec) {
  const db = await openDb();
  rec.updatedAt = Date.now();
  await new Promise((resolve, reject) => {
    const req = store(db, "readwrite").put(rec);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  const ch = channel();
  if (ch) ch.postMessage(rec);
  return rec;
}

// Serialize writes so rapid taps can't race on read-modify-write (two taps
// reading the same count and both writing count+1, losing one). Reads bypass it.
let _queue = Promise.resolve();
function enqueue(fn) {
  const run = _queue.then(fn, fn);
  _queue = run.catch(() => {});
  return run;
}

export function ensureActive(week, sessionId, init) {
  return enqueue(async () => {
    const existing = await getActive(week, sessionId);
    if (existing) return existing;
    return putRecord({ ...emptyRecord(week, sessionId), ...(init || {}) });
  });
}

export function setConfig(week, sessionId, config) {
  return enqueue(async () => {
    const rec = (await getActive(week, sessionId)) || emptyRecord(week, sessionId);
    Object.assign(rec, config); // { gradeButtons, logKind }
    return putRecord(rec);
  });
}

export function applyDelta(week, sessionId, kind, grade, delta) {
  return enqueue(async () => {
    const rec = (await getActive(week, sessionId)) || emptyRecord(week, sessionId);
    const mapKey = kind === "attempt" ? "attemptsByGrade" : "volumeByGrade";
    const next = Math.max(0, (+rec[mapKey][grade] || 0) + delta);
    rec[mapKey] = { ...rec[mapKey], [grade]: next };
    rec.lastAction = { kind, grade, delta };
    return putRecord(rec);
  });
}

export function clearActive(week, sessionId) {
  return enqueue(async () => {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const req = store(db, "readwrite").delete(activeKey(week, sessionId));
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    const ch = channel();
    if (ch) ch.postMessage({ key: activeKey(week, sessionId), cleared: true });
  });
}

export function subscribeLive(cb) {
  const ch = channel();
  if (!ch) return () => {};
  const handler = (e) => cb(e.data);
  ch.addEventListener("message", handler);
  return () => ch.removeEventListener("message", handler);
}

// Builds the persistent notification's title + options. Shared so the page and
// the SW render an identical notification (same tag → it updates in place).
export function notificationOptions(rec) {
  const isAttempt = rec.logKind === "attempt";
  const map = isAttempt ? rec.attemptsByGrade : rec.volumeByGrade;
  // Browsers cap visible notification actions (Chrome/Android = 2). Render only
  // as many grade buttons as will actually show.
  const maxActions = (typeof Notification !== "undefined" && Notification.maxActions) || 3;
  const grades = (rec.gradeButtons || []).slice(0, maxActions);
  const body = grades.length
    ? grades.map((g) => `V${g} · ${+map[g] || 0}`).join("    ")
    : "Open Ascent to pick grades";
  return {
    title: `Ascent — logging ${isAttempt ? "attempts" : "sends"}`,
    options: {
      body,
      tag: "ascent-climblog",
      icon: "/icon.svg",
      renotify: false,
      requireInteraction: true,
      silent: true,
      actions: grades.map((g) => ({ action: `g${g}`, title: `V${g}` })),
      data: { week: rec.week, sessionId: rec.sessionId, logKind: rec.logKind, gradeButtons: grades },
    },
  };
}
