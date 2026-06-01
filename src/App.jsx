import React, { useState, useEffect, useRef } from "react";
import {
  Check, X, Lock, Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  Plus, AlertTriangle, Settings, Upload, Download, Pencil, Mountain,
  Activity, Flame, Footprints, Dumbbell, Hand, Wind, RefreshCw, Info,
  CalendarDays, Trash2, MoveRight, LogOut, Wifi, WifiOff, Award, History
} from "lucide-react";
import { isCloudConfigured, supabase } from "./supabaseClient.js";

/* ============================ THEME ============================ */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Spline+Sans:wght@400;500;600&family=Spline+Sans+Mono:wght@500;600&display=swap');
:root{
  --granite:#19150f; --granite2:#221c14; --surface:#2a2218; --surface2:#332a1f;
  --line:#46392b; --chalk:#f3ece0; --chalk-dim:#b6a890; --faint:#7d6f5b;
  --rope:#d4673a; --rope-soft:#a44e2c; --deload:#d99a2b; --test:#6699b3; --moss:#9bab63;
}
html,body,#root{margin:0;width:100%;min-height:100%;background:var(--granite);}
html,body{height:100%;overflow-x:hidden;}
#root{min-height:100vh;}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
.ct-root{font-family:'Spline Sans',system-ui,sans-serif;color:var(--chalk);background:
  radial-gradient(900px 600px at 80% -10%, rgba(212,103,58,.10), transparent 60%),
  radial-gradient(700px 500px at -10% 110%, rgba(102,153,179,.08), transparent 55%),
  var(--granite);min-height:100vh;width:100%;}
.ct-root::before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.5;z-index:0;
  background-image:repeating-radial-gradient(circle at 50% 30%, transparent 0 38px, rgba(125,111,91,.05) 38px 39px);}
.disp{font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-.02em;}
.mono{font-family:'Spline Sans Mono',monospace;}
.card{background:linear-gradient(180deg,var(--surface),var(--granite2));border:1px solid var(--line);border-radius:16px;}
.btn{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;border-radius:12px;transition:.15s;cursor:pointer;border:1px solid transparent;}
.btn:active{transform:translateY(1px);}
.btn-rope{background:var(--rope);color:#1a120c;}
.btn-rope:hover{background:#e0744a;}
.btn-ghost{background:transparent;border:1px solid var(--line);color:var(--chalk);}
.btn-ghost:hover{border-color:var(--rope);color:var(--rope);}
.pill{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;border-radius:999px;padding:3px 9px;}
.tabbar{backdrop-filter:blur(10px);background:rgba(25,21,15,.85);border-top:1px solid var(--line);}
.fadein{animation:fi .4s ease both;}
@keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.stagger>*{animation:fi .45s ease both;}
.stagger>*:nth-child(2){animation-delay:.05s;}.stagger>*:nth-child(3){animation-delay:.1s;}
.stagger>*:nth-child(4){animation-delay:.15s;}.stagger>*:nth-child(5){animation-delay:.2s;}
.stagger>*:nth-child(6){animation-delay:.25s;}.stagger>*:nth-child(7){animation-delay:.3s;}
input,textarea,select{font-family:'Spline Sans',sans-serif;}
input[type=range]{accent-color:var(--rope);}
.tinput{background:var(--granite);border:1px solid var(--line);border-radius:10px;color:var(--chalk);padding:8px 10px;width:100%;}
.tinput:focus{outline:none;border-color:var(--rope);}
.demo-panel{position:relative;overflow:hidden;background:linear-gradient(180deg,var(--granite2),var(--granite));border:1px solid var(--line);border-radius:14px;}
.demo-svg{display:block;width:100%;height:100%;}
.demo-label{position:absolute;left:10px;right:10px;bottom:8px;text-align:center;font-size:10px;color:var(--faint);letter-spacing:.06em;text-transform:uppercase;}
.demo-pulse{animation:demoPulse 1.8s ease-in-out infinite;transform-origin:center;}
.demo-step{animation:demoStep 2.8s ease-in-out infinite;transform-origin:center;}
.demo-slow{animation:demoSlow 3.2s ease-in-out infinite;transform-origin:center;}
.demo-swing{animation:demoSwing 2.8s ease-in-out infinite;transform-origin:center;}
.demo-lower{animation:demoLower 3.2s ease-in-out infinite;transform-origin:center;}
.demo-raise{animation:demoRaise 2.6s ease-in-out infinite;transform-origin:center;}
.demo-reach{animation:demoReach 2.7s ease-in-out infinite;transform-origin:center;}
.demo-knee{animation:demoKnee 2.8s ease-in-out infinite;transform-origin:center;}
.demo-breathe{animation:demoBreathe 2.4s ease-in-out infinite;transform-origin:center;}
.demo-dash{animation:demoDash 3s linear infinite;}
@keyframes demoPulse{0%,100%{opacity:.35;transform:scale(.86);}50%{opacity:1;transform:scale(1.12);}}
@keyframes demoStep{0%,100%{transform:translate(0,0);}45%,65%{transform:translate(14px,-9px);}}
@keyframes demoSlow{0%,100%{transform:translate(0,0);}50%{transform:translate(0,15px);}}
@keyframes demoSwing{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(11deg);}}
@keyframes demoLower{0%,100%{transform:translateY(-15px);}55%{transform:translateY(15px);}}
@keyframes demoRaise{0%,100%{transform:rotate(-18deg);}50%{transform:rotate(18deg);}}
@keyframes demoReach{0%,100%{transform:translate(0,0);}50%{transform:translate(19px,-24px);}}
@keyframes demoKnee{0%,100%{transform:rotate(0deg);}50%{transform:rotate(24deg);}}
@keyframes demoBreathe{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}
@keyframes demoDash{to{stroke-dashoffset:-42;}}
@media (prefers-reduced-motion: reduce){.demo-pulse,.demo-step,.demo-slow,.demo-swing,.demo-lower,.demo-raise,.demo-reach,.demo-knee,.demo-breathe,.demo-dash{animation:none;}}
`;

/* ============================ SEED PLAN ============================ */
const EX = [
  // Technique & footwork
  { n:"Silent / precision feet", c:"Technique", d:"Every session", h:"Place each foot deliberately and exactly — no scraping, no readjusting once weighted. Takes load off fingers and arms." },
  { n:"Glue feet", c:"Technique", d:"Weeks 2+", g:2, h:"Toe glued the instant it lands — no pivoting or shuffling. Builds trust and balance over the foot." },
  { n:"Blind-foot placement", c:"Technique", d:"Weeks 3+", g:3, h:"Place a foot on a small hold without looking, using body awareness. Sharpens proprioception." },
  { n:"Straight-arm / resting on skeleton", c:"Technique", d:"Weeks 1+", h:"Arms straight where possible; hang off your skeleton rather than gripping with bent arms. Huge energy saver." },
  { n:"Hip turn + flagging", c:"Technique", d:"Weeks 1+", h:"Turn a hip into the wall to extend reach; flag a leg for balance instead of grabbing another hold." },
  { n:"Backstep / drop-knee", c:"Technique", d:"Weeks 5+", g:5, h:"Outside edge of the foot + rotate the knee down to bring hips to the wall and lengthen reach on steeper ground." },
  { n:"Deadpoint / precise catch", c:"Technique", d:"Weeks 5+", g:5, h:"Move dynamically and catch the hold at the weightless top of the move — not a lunge-and-regrab." },
  { n:"Downclimbing", c:"Technique", d:"Weeks 3+", g:3, h:"Climb easy problems back down. Forces controlled, leg-led movement and builds endurance + body awareness." },
  { n:"Route-reading routine", c:"Technique", d:"Weeks 5+", g:5, h:"L1: spot every hold incl. feet. L2: work out + visualize the hand sequence. L3: plan rests, rehearse twice." },
  { n:"Falling practice", c:"Technique", d:"Weeks 1–4", h:"Controlled falls on the pads, low then gradually higher. Desensitizes the fear that makes you over-grip." },
  // Pull-up progression
  { n:"Eccentric (negative) pull-ups", c:"Pull-ups", d:"Wks 1–4 · 4–5×1, 4–5s lower", h:"Start at the top, lower as slowly as you can. You're stronger lowering than lifting — builds strength safely." },
  { n:"Band / machine-assisted pull-ups", c:"Pull-ups", d:"Wks 1–4 · 3–4×5–6", h:"Clean reps with good form; reduce assistance as you get stronger." },
  { n:"Clean reps just shy of failure", c:"Pull-ups", d:"Wks 5–12", g:5, h:"One below your max across sets, ~1 rep in reserve. Don't grind to failure repeatedly." },
  { n:"Active / scapular hangs", c:"Pull-ups", d:"Ongoing", h:"Hang with shoulders actively pulled down and back. Builds shoulder stability and the position you want under load." },
  // Shoulder
  { n:"Dynamic warm-up (circles, reach-and-roll, Egyptians)", c:"Shoulder", d:"Every session ~2 min", h:"Primes the rotator cuff + scapular stabilizers before you load them." },
  { n:"External rotations", c:"Shoulder", d:"2–3x/wk · 15–20 light", h:"Elbow at 90° pinned to your side, rotate the forearm out. Targets the cuff climbing neglects." },
  { n:"Reverse fly", c:"Shoulder", d:"2–3x/wk · 15–20", h:"Bent-over, lift light weights out to the sides, squeezing the shoulder blades." },
  { n:"Scaption raise", c:"Shoulder", d:"2–3x/wk · 15–20", h:"Raise light DBs out and slightly forward (thumbs up) to shoulder height. Cuff + scapular control." },
  { n:"Y / T / L band raises", c:"Shoulder", d:"2–3x/wk · 3×8 each", h:"In a 45° lean, trace Y, then T, then L against a light band. Lower/mid trap + cuff." },
  // Antagonist
  { n:"Push-ups (or light overhead press)", c:"Antagonist", d:"2–3x/wk · 2–3×8–12", h:"Balances the heavy pulling of climbing; protects shoulder + elbow health." },
  { n:"Wrist extensor work", c:"Antagonist", d:"2–3x/wk · 2×15", h:"Light reverse wrist curls / band extensions. Cheap insurance against elbow tendinopathy." },
  // Core
  { n:"Hanging leg / knee raises", c:"Core", d:"2x/wk · 3×5–8", h:"Hang and raise legs (straight is harder). Also gently trains grip endurance." },
  { n:"Front & side planks", c:"Core", d:"2x/wk · 30–60s", h:"Anti-extension + lateral stability. Progress to side plank with a top-leg raise." },
  { n:"Bird-dog / Pallof press", c:"Core", d:"2x/wk · 3×10", h:"Anti-rotation work that integrates core with limb movement — keeps you steady on the wall." },
  // Foot/ankle
  { n:"Single-leg step-ups", c:"Foot/Ankle", d:"2x/wk · 3×8–10/side", h:"Step onto a box with one leg, mimicking a high step. Builds single-leg drive." },
  { n:"Edging calf raises", c:"Foot/Ankle", d:"2x/wk · 3×12–15", h:"Calf raises on the front of the foot as if edging on a small hold. Trains ankle stiffness." },
  { n:"Eccentric heel drops", c:"Foot/Ankle", d:"2x/wk · 3×10/side slow", h:"Rise on both feet, slowly lower one heel below a step. Conditions the Achilles for edging." },
  { n:"Intrinsic foot work", c:"Foot/Ankle", d:"2x/wk · a few min", h:"Toe curls + resisted foot eversion with a band. Strengthens the small foot muscles for precision." },
  // Fingers (gated)
  { n:"Foot-supported (assisted) hangs", c:"Fingers", d:"Wks 9–12 · optional · 2x/wk", g:9, h:"Big edge (18–22mm), feet take real weight, ~8–10s easy & pain-free, a few sets. Tendon PREP only — never weighted, never near-maximal, never to failure. Skip if anything complains." },
];

const W = (week, phase, type, c1, c2, c3, sup, supR) => ({
  week, phase, type,
  sessions: [
    { id:"climb1", day:"Climb Day 1", ...c1 },
    { id:"climb2", day:"Climb Day 2", ...c2 },
    { id:"climb3", day:"Climb Day 3", ...c3 },
    { id:"support", day:"Supporting work", focus:sup, drills:[], routines:supR },
  ],
});

const DEFAULT_PLAN = {
  name: "Dad's 12-Week Climbing Plan",
  idea: "You're movement-limited, not strength-limited. Most energy goes to technique and climbing volume; strength work is support that keeps you healthy. Consistency across all 12 weeks beats any single clever session.",
  weeks: [
    W(1,"M1 · Foundation","normal",
      {focus:"Technique volume: many V0–V2.",drills:["Silent / precision feet"],routines:["Shoulder"],note:"Shoulder routine after."},
      {focus:"Volume + study a V3 (learn from each fall).",drills:["Straight-arm / resting on skeleton"],routines:["Core"],note:"Core after."},
      {focus:"Mixed volume.",drills:["Hip turn + flagging"],routines:["Pull-ups","Shoulder"],note:"Pull-up session + shoulder routine."},
      "Pull-ups 2x · Core 2x · Shoulder 2–3x · Falling practice on pads · easy cycling off-days",
      ["Shoulder","Pull-ups","Core"]),
    W(2,"M1 · Foundation","normal",
      {focus:"Technique volume.",drills:["Silent / precision feet","Glue feet"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Volume + 3–4 study attempts on V3.",drills:["Straight-arm / resting on skeleton"],routines:["Core"],note:"Core."},
      {focus:"Mixed volume.",drills:["Hip turn + flagging","Backstep / drop-knee"],routines:["Pull-ups","Shoulder"],note:"Pull-ups + shoulder routine."},
      "Pull-ups 2x · Core 2x · Shoulder 2–3x · Falling practice · Foot/ankle work 2x",
      ["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(3,"M1 · Foundation","normal",
      {focus:"Technique volume.",drills:["Blind-foot placement"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Volume + study V3.",drills:["Straight-arm / resting on skeleton"],routines:["Core"],note:"Core."},
      {focus:"Mixed volume + downclimbing practice.",drills:["Downclimbing"],routines:["Pull-ups","Shoulder"],note:"Pull-ups + shoulder routine."},
      "Pull-ups 2x · Core 2x · Shoulder 2–3x · Foot/ankle work 2x",
      ["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(4,"M1 · Foundation","deload",
      {focus:"Easy climbing only — ~40% less volume, no limit attempts.",drills:[],routines:[]},
      {focus:"Easy volume, light drills, quiet feet.",drills:["Silent / precision feet"],routines:[]},
      {focus:"Light mixed climbing. Keep shoulder routine only.",drills:[],routines:["Shoulder"]},
      "Shoulder routine light · 1 easy pull-up set · walk/easy spin · sleep focus",
      ["Shoulder","Pull-ups"]),
    W(5,"M2 · Skill Under Load","normal",
      {focus:"PROJECTING: work a V3/V4 with full rests; apply footwork.",drills:["Route-reading routine"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Technique volume V1–V3.",drills:["Deadpoint / precise catch"],routines:["Core"],note:"Core."},
      {focus:"Mixed + projecting.",drills:[],routines:["Pull-ups","Shoulder"],note:"Pull-up progression (less assist). Shoulder routine."},
      "Pull-ups 2x · Core 2x · Shoulder 2–3x · Foot/ankle 2x · Route-reading L1–L2",
      ["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(6,"M2 · Skill Under Load","normal",
      {focus:"Projecting V3/V4.",drills:["Backstep / drop-knee"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Volume V1–V3 + dynamic movement.",drills:["Deadpoint / precise catch"],routines:["Core"],note:"Core."},
      {focus:"Mixed + projecting.",drills:[],routines:["Pull-ups","Shoulder"],note:"Pull-up progression. Shoulder routine."},
      "Pull-ups 2x · Core 2x · Shoulder 2–3x · Foot/ankle 2x · Route-reading L2",
      ["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(7,"M2 · Skill Under Load","normal",
      {focus:"Projecting V4. Apply everything; full recovery between tries.",drills:["Route-reading routine"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Volume + flash practice at V2.",drills:[],routines:["Core"],note:"Core."},
      {focus:"Mixed + projecting.",drills:[],routines:["Pull-ups","Shoulder"],note:"Pull-up progression. Shoulder routine."},
      "Pull-ups 2x · Core 2x · Shoulder 2–3x · Foot/ankle 2x · Route-reading L2",
      ["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(8,"M2 · Skill Under Load","deload",
      {focus:"Easy climbing, ~40% less volume. No projecting.",drills:[],routines:[]},
      {focus:"Easy volume, quiet feet, light drills.",drills:["Silent / precision feet"],routines:[]},
      {focus:"Light mixed climbing. Shoulder routine only.",drills:[],routines:["Shoulder"]},
      "Shoulder routine light · 1 easy pull-up set · easy spin · sleep focus",
      ["Shoulder","Pull-ups"]),
    W(9,"M3 · Performance","normal",
      {focus:"PERFORMANCE: structured V4 project, full rests.",drills:[],routines:["Fingers"],note:"Optional foot-supported hangs (gentle)."},
      {focus:"Flash/read practice: flash V2–V3 on sight, visualize first.",drills:["Route-reading routine"],routines:["Core"],note:"Core."},
      {focus:"Mixed + pull-up session (clean reps near, not to, failure).",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 2x · Core 2x · Shoulder 2–3x · Foot/ankle 2x · Route-reading L2–L3",
      ["Shoulder","Pull-ups","Core","Foot/Ankle","Fingers"]),
    W(10,"M3 · Performance","normal",
      {focus:"V4 projecting.",drills:[],routines:["Fingers"],note:"Optional foot-supported hangs (gentle, never to failure)."},
      {focus:"Flash practice V2–V3.",drills:["Route-reading routine"],routines:["Core"],note:"Core."},
      {focus:"Mixed + pull-ups.",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 2x · Core 2x · Shoulder 2–3x · Foot/ankle 2x · Route-reading L3",
      ["Shoulder","Pull-ups","Core","Foot/Ankle","Fingers"]),
    W(11,"M3 · Performance","normal",
      {focus:"V4 projecting, trim easy volume so you arrive fresh.",drills:[],routines:["Fingers"],note:"Optional gentle hangs."},
      {focus:"Flash practice + visualization.",drills:["Route-reading routine"],routines:["Core"],note:"Core."},
      {focus:"Mixed + pull-ups.",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 2x · Core 2x · Shoulder 2–3x · Foot/ankle 2x",
      ["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(12,"M3 · Performance","test",
      {focus:"TEST: retest max clean pull-ups; project a V4 seriously.",drills:[],routines:[]},
      {focus:"TEST: attempt to flash a V3. Otherwise light.",drills:[],routines:[]},
      {focus:"Light mixed climbing. Log all results in Metrics.",drills:[],routines:[]},
      "Mostly rest so you're fresh to test · light shoulder routine · reassess hangboard readiness",
      ["Shoulder"]),
  ],
};

const INTERMEDIATE_PLAN = {
  name: "Intermediate 12-Week Progression",
  idea: "You can flash V3 and are working V4–V5. This block builds volume at your limit, introduces max-strength work in month two, and peaks in a redpoint phase targeting V5. Pull-up intensity and finger prep increase progressively alongside climbing.",
  weeks: [
    W(1,"M1 · Volume","normal",
      {focus:"Volume V3–V4: many attempts, apply route-reading.",drills:["Route-reading routine"],routines:["Shoulder"],note:"Shoulder routine after."},
      {focus:"Flash practice: on-sight V2–V3 without previewing.",drills:["Silent / precision feet"],routines:["Core"],note:"Core."},
      {focus:"Projecting: 3–5 serious attempts on a V4.",drills:["Backstep / drop-knee"],routines:["Pull-ups","Shoulder"],note:"Pull-ups 3×(max-1). Shoulder routine."},
      "Pull-ups 3×(max-1) · Core 2× · Shoulder 2–3× · Antagonist 2×",["Shoulder","Pull-ups","Core","Antagonist"]),
    W(2,"M1 · Volume","normal",
      {focus:"Volume V3–V4, add dynamic moves.",drills:["Deadpoint / precise catch"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Flash practice V2–V3 + easy downclimbing.",drills:["Downclimbing"],routines:["Core"],note:"Core."},
      {focus:"Projecting V4: full rests between attempts.",drills:["Route-reading routine"],routines:["Pull-ups","Shoulder"],note:"Pull-ups 3×(max-1). Shoulder routine."},
      "Pull-ups 3×(max-1) · Core 2× · Shoulder 2–3× · Antagonist 2× · Foot/ankle 2×",["Shoulder","Pull-ups","Core","Antagonist","Foot/Ankle"]),
    W(3,"M1 · Volume","normal",
      {focus:"Volume V3–V4: aim for 5+ problems at grade.",drills:["Hip turn + flagging"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Flash practice V3 + route-reading.",drills:["Route-reading routine"],routines:["Core"],note:"Core."},
      {focus:"Projecting V4–V5: first V5 attempts if ready.",drills:["Backstep / drop-knee"],routines:["Pull-ups","Shoulder"],note:"Pull-ups 3×(max-1). Shoulder routine."},
      "Pull-ups 3×(max-1) · Core 2× · Shoulder 2–3× · Antagonist 2× · Foot/ankle 2×",["Shoulder","Pull-ups","Core","Antagonist","Foot/Ankle"]),
    W(4,"M1 · Volume","deload",
      {focus:"Easy climbing ~40% volume. No limit attempts.",drills:[],routines:[]},
      {focus:"Easy volume, light footwork drills.",drills:["Silent / precision feet"],routines:[]},
      {focus:"Light mixed climbing. Shoulder routine only.",drills:[],routines:["Shoulder"]},
      "Shoulder routine light · 1 easy pull-up set · sleep focus",["Shoulder","Pull-ups"]),
    W(5,"M2 · Max Strength","normal",
      {focus:"Projecting V4–V5: structured max-effort sessions.",drills:[],routines:["Fingers"],note:"Foot-supported hangs — big edge, feet on, easy."},
      {focus:"Flash practice V3. Route-reading L2.",drills:["Route-reading routine"],routines:["Core"],note:"Core."},
      {focus:"Volume V3–V4 + pull-ups (3 sets, max-1 clean reps).",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 3×(max-1) · Core 2× · Shoulder 2–3× · Antagonist 2× · Foot/ankle 2×",["Shoulder","Pull-ups","Core","Antagonist","Foot/Ankle","Fingers"]),
    W(6,"M2 · Max Strength","normal",
      {focus:"Projecting V5: 4–6 quality attempts, full rests.",drills:[],routines:["Fingers"],note:"Foot-supported hangs."},
      {focus:"Flash V3. Visualize before each attempt.",drills:["Route-reading routine"],routines:["Core"],note:"Core."},
      {focus:"Volume V3–V4 + max pull-ups.",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 3×(max-1) · Core 2× · Shoulder 2–3× · Antagonist 2× · Foot/ankle 2×",["Shoulder","Pull-ups","Core","Antagonist","Foot/Ankle","Fingers"]),
    W(7,"M2 · Max Strength","normal",
      {focus:"Projecting V5. Trim warm-up; arrive strong.",drills:[],routines:["Fingers"],note:"Foot-supported hangs."},
      {focus:"On-sight session: flash V3, attempt V4.",drills:["Route-reading routine"],routines:["Core"],note:"Core."},
      {focus:"Volume V4 + pull-up peak (max-1, reduce rest to 90s).",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 3×(max-1) · Core 2× · Shoulder 2–3× · Antagonist 2× · Foot/ankle 2×",["Shoulder","Pull-ups","Core","Antagonist","Foot/Ankle","Fingers"]),
    W(8,"M2 · Max Strength","deload",
      {focus:"Easy climbing ~40% volume. No projecting.",drills:[],routines:[]},
      {focus:"Easy volume, quiet feet.",drills:["Silent / precision feet"],routines:[]},
      {focus:"Light mixed climbing. Shoulder routine only.",drills:[],routines:["Shoulder"]},
      "Shoulder routine light · 1 easy pull-up set · sleep focus",["Shoulder","Pull-ups"]),
    W(9,"M3 · Redpoint","normal",
      {focus:"Structured V5 redpoint: 4–6 max-quality attempts. Arrive fresh.",drills:[],routines:["Fingers"],note:"Foot-supported hangs."},
      {focus:"On-sight: flash V3–V4. No previewing.",drills:["Route-reading routine"],routines:["Core"],note:"Core."},
      {focus:"Volume V4 + pull-ups.",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 3×(max-1) · Core 2× · Shoulder 2–3× · Foot/ankle 2× · Route-reading L3",["Shoulder","Pull-ups","Core","Foot/Ankle","Fingers"]),
    W(10,"M3 · Redpoint","normal",
      {focus:"V5 redpoint. Repeat previous sessions' best sequence.",drills:[],routines:["Fingers"],note:"Foot-supported hangs."},
      {focus:"On-sight V3–V4 + visualization.",drills:["Route-reading routine"],routines:["Core"],note:"Core."},
      {focus:"Volume V4 + pull-ups.",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 3×(max-1) · Core 2× · Shoulder 2–3× · Foot/ankle 2×",["Shoulder","Pull-ups","Core","Foot/Ankle","Fingers"]),
    W(11,"M3 · Redpoint","normal",
      {focus:"V5 redpoint: trim easy volume, arrive at your best.",drills:[],routines:["Fingers"],note:"Gentle hangs."},
      {focus:"On-sight + visualization. Target your tested flash grade.",drills:["Route-reading routine"],routines:["Core"],note:"Core."},
      {focus:"Volume V4 + pull-ups.",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 2× · Core 2× · Shoulder 2–3× · Foot/ankle 2×",["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(12,"M3 · Redpoint","test",
      {focus:"TEST: retest max pull-ups; serious V5 attempt.",drills:[],routines:[]},
      {focus:"TEST: attempt to flash a V4 on sight.",drills:[],routines:[]},
      {focus:"Light mixed climbing. Log all results in Metrics.",drills:[],routines:[]},
      "Mostly rest to arrive fresh · light shoulder routine · reassess next cycle",["Shoulder"]),
  ],
};

const MAINTENANCE_PLAN = {
  name: "Maintenance 8-Week Base",
  idea: "Life got busy. Two shorter climbing sessions a week keeps nearly all your fitness for 8 weeks while your schedule settles. No projecting beyond your current onsight — the goal is holding what you have so the next full block starts strong.",
  weeks: [
    W(1,"M1 · Maintenance","normal",
      {focus:"Easy climbing V0–V3 only. Quiet feet, enjoy movement.",drills:["Silent / precision feet"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Active recovery: easy yoga or light cycling. No hard climbing.",drills:[],routines:[]},
      {focus:"Light V1–V3 volume + pull-ups (comfortable, not max).",drills:["Hip turn + flagging"],routines:["Pull-ups","Shoulder"],note:"Pull-ups light. Shoulder routine."},
      "Pull-ups 2× light · Shoulder 2× · Core 1× · easy active recovery",["Shoulder","Pull-ups","Core"]),
    W(2,"M1 · Maintenance","normal",
      {focus:"Easy climbing V0–V3. Add some downclimbing.",drills:["Downclimbing"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Active recovery: gentle movement, no hard climbing.",drills:[],routines:[]},
      {focus:"Light V2–V3 volume + pull-ups.",drills:["Straight-arm / resting on skeleton"],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 2× light · Shoulder 2× · Core 1× · active recovery",["Shoulder","Pull-ups","Core"]),
    W(3,"M1 · Maintenance","normal",
      {focus:"Easy climbing V0–V3. Focus on footwork precision.",drills:["Blind-foot placement"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Active recovery.",drills:[],routines:[]},
      {focus:"Light V2–V3 volume + pull-ups.",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 2× light · Shoulder 2× · Core 1× · Foot/ankle 1×",["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(4,"M1 · Maintenance","deload",
      {focus:"Very easy climbing, very low volume. Rest focus.",drills:[],routines:[]},
      {focus:"Complete rest or gentle walk.",drills:[],routines:[]},
      {focus:"Light technique climbing V0–V2 only.",drills:["Silent / precision feet"],routines:["Shoulder"]},
      "Shoulder routine light · rest · sleep focus",["Shoulder"]),
    W(5,"M2 · Prep-Ramp","normal",
      {focus:"V2–V4 volume: add a couple of project attempts at your onsight grade.",drills:["Route-reading routine"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Active recovery or rest.",drills:[],routines:[]},
      {focus:"V2–V4 volume + pull-ups.",drills:[],routines:["Pull-ups","Shoulder"],note:"Pull-ups building back. Shoulder routine."},
      "Pull-ups 2× building · Shoulder 2× · Core 1× · Foot/ankle 1×",["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(6,"M2 · Prep-Ramp","normal",
      {focus:"V3–V4 volume + one project attempt.",drills:["Backstep / drop-knee"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Active recovery.",drills:[],routines:[]},
      {focus:"V3–V4 volume + pull-ups.",drills:[],routines:["Pull-ups","Shoulder"],note:"Pull-ups building. Shoulder routine."},
      "Pull-ups 2× building · Shoulder 2× · Core 2× · Foot/ankle 1×",["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(7,"M2 · Prep-Ramp","normal",
      {focus:"V3–V4 volume, flash practice V2–V3.",drills:["Route-reading routine"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Rest.",drills:[],routines:[]},
      {focus:"V3–V4 volume + pull-ups.",drills:[],routines:["Pull-ups","Shoulder"],note:"Shoulder routine."},
      "Pull-ups 2–3× · Shoulder 2× · Core 2× · Foot/ankle 1×",["Shoulder","Pull-ups","Core","Foot/Ankle"]),
    W(8,"M2 · Prep-Ramp","test",
      {focus:"MINI-TEST: retest max pull-ups; attempt to flash your current grade.",drills:[],routines:[]},
      {focus:"Light climbing + note how movement feels vs. 8 weeks ago.",drills:["Silent / precision feet"],routines:[]},
      {focus:"Log all results in Metrics. Plan next full block.",drills:[],routines:[]},
      "Rest to arrive fresh for test · light shoulder routine",["Shoulder"]),
  ],
};

const INJURY_RETURN_PLAN = {
  name: "Injury Return 8-Week",
  idea: "You've had a finger, shoulder, or elbow niggle and it's settling down. Pain-free movement first, load second — grade doesn't matter for the first 4 weeks. If pain is ever above 2/10 during a session, stop and log it. Hangboard remains locked for the full 8 weeks regardless of how things feel.",
  weeks: [
    W(1,"M1 · Pain-Free Movement","normal",
      {focus:"V0–V1 ONLY. Open-hand grip only. Stop at any twinge.",drills:["Silent / precision feet"],routines:["Shoulder"],note:"Shoulder routine + antagonist work."},
      {focus:"Active recovery: easy walking or yoga. No climbing.",drills:[],routines:["Antagonist"],note:"Antagonist (push-ups, wrist extensors)."},
      {focus:"V0–V1. Downclimbing practice — slow, controlled.",drills:["Downclimbing"],routines:["Shoulder"],note:"Shoulder routine."},
      "NO pull-ups · Shoulder 2–3× · Antagonist daily · wrist extensors",["Shoulder","Antagonist"]),
    W(2,"M1 · Pain-Free Movement","normal",
      {focus:"V0–V2. Same open-hand rule. Stop at 2/10 pain.",drills:["Straight-arm / resting on skeleton"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Active recovery. Antagonist work.",drills:[],routines:["Antagonist"]},
      {focus:"V0–V2. Footwork focus — load legs, not fingers.",drills:["Hip turn + flagging"],routines:["Shoulder"],note:"Shoulder routine."},
      "NO pull-ups · Shoulder 2–3× · Antagonist daily · wrist extensors",["Shoulder","Antagonist"]),
    W(3,"M1 · Pain-Free Movement","normal",
      {focus:"V0–V2. One V3 attempt on a slopey/juggy problem if pain-free.",drills:["Silent / precision feet"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Active recovery. Antagonist work.",drills:[],routines:["Antagonist"]},
      {focus:"V0–V2 volume. Footwork emphasis.",drills:["Blind-foot placement"],routines:["Shoulder"],note:"Shoulder routine."},
      "Light scapular hangs ONLY if pain-free · Shoulder 2–3× · Antagonist daily",["Shoulder","Antagonist"]),
    W(4,"M1 · Pain-Free Movement","deload",
      {focus:"Very easy V0–V1 only. Extra rest.",drills:[],routines:[]},
      {focus:"Complete rest or gentle walking.",drills:[],routines:[]},
      {focus:"Easy V0–V2. Shoulder routine only.",drills:["Silent / precision feet"],routines:["Shoulder"]},
      "Rest priority · Shoulder routine light · antagonist",["Shoulder","Antagonist"]),
    W(5,"M2 · Gradual Load","normal",
      {focus:"V2–V3 volume. One projecting attempt at V3 max.",drills:["Route-reading routine"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Active recovery + antagonist.",drills:[],routines:["Antagonist"]},
      {focus:"V2–V3 + foot-assisted active hangs (no pulling).",drills:[],routines:["Pull-ups","Shoulder"],note:"Active hangs only. Shoulder routine."},
      "Foot-assisted active hangs 3×5 · Shoulder 2–3× · Antagonist 2× · Core 1×",["Shoulder","Pull-ups","Antagonist","Core"]),
    W(6,"M2 · Gradual Load","normal",
      {focus:"V2–V3 volume + 1–2 V4 attempts if pain-free.",drills:["Backstep / drop-knee"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Active recovery.",drills:[],routines:["Antagonist"]},
      {focus:"V2–V3 + foot-assisted pull-up eccentrics (2–3 sets of 2).",drills:[],routines:["Pull-ups","Shoulder"],note:"Eccentrics only. Shoulder routine."},
      "Foot-assisted eccentrics · Shoulder 2–3× · Antagonist 2× · Core 1×",["Shoulder","Pull-ups","Antagonist","Core"]),
    W(7,"M2 · Gradual Load","normal",
      {focus:"V3 volume + 1–2 V4 project attempts.",drills:["Route-reading routine"],routines:["Shoulder"],note:"Shoulder routine."},
      {focus:"Active recovery + antagonist.",drills:[],routines:["Antagonist"]},
      {focus:"V2–V3 + 1–2 unassisted pull-ups if pain-free.",drills:[],routines:["Pull-ups","Shoulder"],note:"1–2 pull-ups max. Shoulder routine."},
      "Light pull-ups (2–3 max) · Shoulder 2–3× · Antagonist 2× · Core 1×",["Shoulder","Pull-ups","Antagonist","Core"]),
    W(8,"M2 · Gradual Load","test",
      {focus:"ASSESSMENT: highest pain-free grade; 2–3 pull-up attempts.",drills:[],routines:[]},
      {focus:"Easy V0–V2. How does everything feel?",drills:["Silent / precision feet"],routines:[]},
      {focus:"Log everything in Metrics. Decide: Foundation plan or extend maintenance.",drills:[],routines:[]},
      "Log results · rest · choose next plan",["Shoulder"]),
  ],
};

const PLAN_TEMPLATES = {
  "foundation-12wk": {
    id:"foundation-12wk", name:"Foundation 12-Week",
    subtitle:"V0–V3 skill base, injury prep, pull-up ramp",
    level:"beginner", targetGrades:"V0–V3",
    phases:["M1 · Foundation (wk 1–4)","M2 · Skill Under Load (wk 5–8)","M3 · Performance (wk 9–12)"],
    plan:DEFAULT_PLAN,
  },
  "intermediate-12wk": {
    id:"intermediate-12wk", name:"Intermediate Progression",
    subtitle:"V3–V5 volume, max strength phase, redpoint block",
    level:"intermediate", targetGrades:"V3–V5",
    phases:["M1 · Volume (wk 1–4)","M2 · Max Strength (wk 5–8)","M3 · Redpoint (wk 9–12)"],
    plan:INTERMEDIATE_PLAN,
  },
  "maintenance-8wk": {
    id:"maintenance-8wk", name:"Maintenance 8-Week",
    subtitle:"Hold fitness during a busy period, ramp back in week 5",
    level:"beginner", targetGrades:"Any",
    phases:["M1 · Maintenance (wk 1–4)","M2 · Prep-Ramp (wk 5–8)"],
    plan:MAINTENANCE_PLAN,
  },
  "injury-return-8wk": {
    id:"injury-return-8wk", name:"Injury Return 8-Week",
    subtitle:"Gentle return after a finger, shoulder, or elbow niggle",
    level:"beginner", targetGrades:"V0–V2",
    phases:["M1 · Pain-Free Movement (wk 1–4)","M2 · Gradual Load (wk 5–8)"],
    plan:INJURY_RETURN_PLAN,
  },
};

const ROUTINES = {
  "Shoulder":{label:"Shoulder routine",cat:"Shoulder"},
  "Pull-ups":{label:"Pull-ups",cat:"Pull-ups"},
  "Core":{label:"Core",cat:"Core"},
  "Foot/Ankle":{label:"Foot & ankle",cat:"Foot/Ankle"},
  "Fingers":{label:"Foot-supported hangs",cat:"Fingers"},
  "Antagonist":{label:"Antagonist",cat:"Antagonist"},
};

/* ============================ DRILL DETAIL + SENDS ============================ */
const DEFAULT_SENDS = { 0:8, 1:12, 2:9, 3:3, 4:0 };
const SCHEMA_VERSION = 3;
const APP_DATA_KEY = "ascent_app_data_v1";
const SESSION_IDS = ["climb1", "climb2", "climb3", "support"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DEFAULT_SCHEDULE = {
  startDate: "",
  preferredSessionDays: { climb1:1, climb2:3, climb3:5, support:6 },
  travelBlocks: [],
  sessionOverrides: {},
  lastRescheduleUndo: null,
};
const DEFAULT_SETTINGS = { };

const DETAIL = {
  "Silent / precision feet":{fig:"feet",look:"Your toe lands once, dead on the hold, and makes no sound — no scrape, no second adjustment.",fix:"Most common error: dragging or re-placing the foot once it's on. Reset and place it cleanly."},
  "Glue feet":{fig:"feet",look:"The instant the toe touches it stops moving, as if glued. Your body rotates around a still foot.",fix:"If the foot pivots or skates, you lose tension — commit to the first placement."},
  "Blind-foot placement":{fig:"feet",look:"You find the foothold by feel, eyes already up at your next hand move.",fix:"Resist the urge to look down — trust the rehearsal."},
  "Straight-arm / resting on skeleton":{fig:"straightarm",look:"Arms long and straight, hanging off bone not muscle — shoulders engaged, not shrugged up.",fix:"Bent, pumped arms mean you're holding on with muscle. Drop onto straight arms to rest."},
  "Hip turn + flagging":{fig:"flag",look:"One hip turns to the wall; the free leg sweeps out as a counterweight instead of finding a hold.",fix:"Don't reach for a foothold you don't need — let the flag do the balancing."},
  "Backstep / drop-knee":{fig:"dropknee",look:"You stand on the outside edge of your toe and rotate that knee down and in, pulling your hip flush to the wall.",fix:"Keep the hip pulling in; a lazy drop-knee leaves you swinging off the wall (barn-dooring)."},
  "Deadpoint / precise catch":{fig:"deadpoint",look:"You float to the hold and catch it at the weightless top of the move, instead of yanking and slapping.",fix:"Catching early or late means you're lunging — time it to the apex."},
  "Downclimbing":{look:"Slow and controlled, led by the legs — like climbing the problem in reverse, never jumping off."},
  "Route-reading routine":{look:"Standing at the base, eyes tracing the whole line and miming the moves before you touch the wall."},
  "Falling practice":{look:"Controlled drops onto the pad — relaxed, feet first, building trust from low heights upward."},
  "Eccentric (negative) pull-ups":{look:"Chin starts over the bar; you lower yourself as slowly as the count, fighting the whole way down."},
  "Active / scapular hangs":{look:"Hanging with shoulders pulled down away from your ears — not a passive dead hang."},
  "Foot-supported (assisted) hangs":{look:"Hands on a big edge, but your feet carry real weight on the floor — easy, pain-free, never a full hang."},
};

function Figure({ id }){
  const s={fill:"none",stroke:"var(--rope)",strokeWidth:5,strokeLinecap:"round",strokeLinejoin:"round"};
  const c={fill:"none",stroke:"var(--chalk-dim)",strokeWidth:3,strokeLinecap:"round",strokeLinejoin:"round"};
  const wall=<line x1="22" y1="12" x2="22" y2="128" stroke="var(--line)" strokeWidth="3"/>;
  const figs={
    feet:(<svg viewBox="0 0 140 140" style={{width:"100%",height:"100%"}}>{wall}
      <path d="M22 98 l28 -7 l0 15 l-28 0 z" fill="var(--surface2)" stroke="var(--line)" strokeWidth="2"/>
      <circle cx="46" cy="93" r="8" {...s}/><circle cx="46" cy="93" r="2.5" fill="var(--rope)" stroke="none"/>
      <path d="M92 50 l9 10 l18 -22" stroke="var(--moss)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>),
    straightarm:(<svg viewBox="0 0 140 140" style={{width:"100%",height:"100%"}}>
      <circle cx="42" cy="30" r="6" {...c}/><path d="M42 36 l0 24 l-16 16" {...c}/>
      <path d="M30 92 l8 -8 m-8 8 l8 8" stroke="var(--chalk-dim)" strokeWidth="3"/>
      <circle cx="100" cy="30" r="6" {...s}/><path d="M100 36 l0 56" {...s}/>
      <path d="M90 104 l10 -8 l10 8" stroke="var(--moss)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>),
    flag:(<svg viewBox="0 0 140 140" style={{width:"100%",height:"100%"}}>{wall}
      <circle cx="58" cy="34" r="9" {...s}/><line x1="58" y1="43" x2="58" y2="86" {...s}/>
      <line x1="58" y1="56" x2="34" y2="46" {...s}/><line x1="58" y1="86" x2="44" y2="118" {...s}/>
      <path d="M58 86 q36 4 54 30" {...s}/>
    </svg>),
    dropknee:(<svg viewBox="0 0 140 140" style={{width:"100%",height:"100%"}}>{wall}
      <circle cx="62" cy="32" r="9" {...s}/><line x1="62" y1="41" x2="62" y2="80" {...s}/>
      <line x1="62" y1="52" x2="38" y2="42" {...s}/><path d="M62 80 l26 8 l-16 26" {...s}/>
      <line x1="62" y1="80" x2="42" y2="106" {...s}/>
    </svg>),
    deadpoint:(<svg viewBox="0 0 140 140" style={{width:"100%",height:"100%"}}>{wall}
      <circle cx="48" cy="104" r="9" {...c}/><circle cx="100" cy="40" r="9" {...s}/>
      <path d="M48 104 q18 -66 52 -64" {...s} strokeDasharray="2 9"/>
      <circle cx="80" cy="48" r="4.5" fill="var(--moss)" stroke="none"/>
    </svg>),
  };
  return figs[id]||null;
}

function DrillSheet({ name, onClose }){
  const e=exByName(name); const d=DETAIL[name]||{};
  if(!e) return null;
  return (
    <div onClick={onClose} className="ct-root" style={{position:"fixed",inset:0,zIndex:70,background:"rgba(8,6,4,.62)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={ev=>ev.stopPropagation()} className="card fadein" style={{width:"100%",maxWidth:520,borderRadius:"20px 20px 0 0",padding:"8px 18px 28px",maxHeight:"88vh",overflowY:"auto",background:"linear-gradient(180deg,var(--surface),var(--granite))"}}>
        <div style={{width:42,height:4,background:"var(--line)",borderRadius:4,margin:"8px auto 18px"}}/>
        <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
          {d.fig && <div style={{width:104,height:104,flexShrink:0,background:"var(--granite)",borderRadius:14,border:"1px solid var(--line)",padding:6}}><Figure id={d.fig}/></div>}
          <div style={{flex:1}}>
            <h2 className="disp" style={{fontSize:20,margin:"2px 0 9px",lineHeight:1.15}}>{e.n}</h2>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <span className="pill" style={{background:"var(--surface2)",color:"var(--rope)"}}>{e.c}</span>
              <span className="pill mono" style={{background:"var(--surface2)",color:"var(--chalk-dim)"}}>{e.d}</span>
            </div>
          </div>
        </div>
        {d.look && (<div style={{marginTop:18}}>
          <div className="disp" style={{fontSize:11,letterSpacing:".09em",textTransform:"uppercase",color:"var(--moss)",marginBottom:5}}>What it looks like</div>
          <p style={{margin:0,fontSize:15,lineHeight:1.55}}>{d.look}</p>
        </div>)}
        <div style={{marginTop:16}}>
          <div className="disp" style={{fontSize:11,letterSpacing:".09em",textTransform:"uppercase",color:"var(--rope)",marginBottom:5}}>Why you're doing it</div>
          <p style={{margin:0,fontSize:14,lineHeight:1.55,color:"var(--chalk-dim)"}}>{e.h}</p>
        </div>
        {d.fix && (<div style={{marginTop:16,padding:"12px 14px",background:"var(--granite)",border:"1px solid var(--line)",borderRadius:12}}>
          <div className="disp" style={{fontSize:11,letterSpacing:".09em",textTransform:"uppercase",color:"var(--deload)",marginBottom:5}}>Watch for</div>
          <p style={{margin:0,fontSize:14,lineHeight:1.5,color:"var(--chalk-dim)"}}>{d.fix}</p>
        </div>)}
        <button className="btn btn-ghost" style={{width:"100%",padding:12,marginTop:20}} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const GUIDE = {
  "Silent / precision feet":{demoId:"precisionFeet",equipment:"Climbing wall",summary:"Place the toe once, quietly, exactly where you meant to.",setup:"Pick easy terrain and choose each foothold before you move.",execution:"Move the toe to the selected spot, weight it gently, then keep it still while the body moves past it.",commonMistake:"Scraping, tapping around, or re-placing the foot after it is weighted.",coachCue:"Land the toe like you are pressing a camera shutter.",repCounting:"Count clean placements, not problems sent.",progression:"Use smaller footholds or steeper terrain.",regression:"Use jugs and big footholds until every placement is quiet."},
  "Glue feet":{demoId:"glueFeet",equipment:"Climbing wall",summary:"The foot stops moving the instant it touches the hold.",setup:"Choose an easy route and commit to each first placement.",execution:"Place the toe, freeze it, then rotate the hips around that fixed point.",commonMistake:"Letting the shoe pivot, skate, or search after contact.",coachCue:"Toe lands, toe stays.",repCounting:"Count every hold where the foot stays fixed through the next move.",progression:"Add hip turns without allowing the toe to smear.",regression:"Use bigger footholds and slow the pace down."},
  "Blind-foot placement":{demoId:"blindFoot",equipment:"Climbing wall",summary:"Find a foothold by feel while your eyes stay on the next hand move.",setup:"Rehearse the foothold location before leaving the ground or while resting.",execution:"Look up, move the foot by memory, touch the hold lightly, then weight it only after it feels centered.",commonMistake:"Looking down at the last second or stabbing blindly with tension.",coachCue:"Eyes lead, foot confirms.",repCounting:"Count controlled placements where you never glance down.",progression:"Use smaller feet or longer reaches.",regression:"Practice from the floor on obvious footholds first."},
  "Straight-arm / resting on skeleton":{demoId:"straightArm",equipment:"Climbing wall",summary:"Save energy by hanging from long arms with active shoulders.",setup:"Find a stable stance where your feet can carry some weight.",execution:"Let the elbow straighten, keep the shoulder gently packed, and breathe before the next move.",commonMistake:"Resting with bent elbows or shrugged shoulders.",coachCue:"Long arm, heavy feet, quiet breath.",repCounting:"Count useful rests where your forearm pump drops.",progression:"Find straight-arm rests on steeper problems.",regression:"Practice on vertical jugs with both feet solid."},
  "Hip turn + flagging":{demoId:"flag",equipment:"Climbing wall",summary:"Use hip rotation and a free leg as counterbalance instead of over-gripping.",setup:"Stand on one main foot with the opposite leg free.",execution:"Turn one hip toward the wall, let the free leg sweep out, and reach while the body stays quiet.",commonMistake:"Square hips, bent arms, or grabbing extra holds to stop a swing.",coachCue:"Flag before you fight.",repCounting:"Count moves where the flag stops a barn-door swing.",progression:"Use flags on longer reaches.",regression:"Practice on traverses with large handholds."},
  "Backstep / drop-knee":{demoId:"dropKnee",equipment:"Climbing wall",summary:"Rotate onto the outside edge and drop the knee to bring hips closer.",setup:"Find a foothold near the midline with room to turn the knee inward.",execution:"Set the outside edge, rotate the knee down, pull the hip toward the wall, then reach from the new body position.",commonMistake:"Dropping the knee without pulling the hip in, which still leaves you swinging.",coachCue:"Outside edge first, knee second, hip last.",repCounting:"Count clean drop-knees that create a longer reach.",progression:"Apply it on slightly steeper terrain.",regression:"Use big footholds and stop before knee discomfort."},
  "Deadpoint / precise catch":{demoId:"deadpoint",equipment:"Climbing wall",summary:"Catch the hold at the top of the movement when the body is briefly weightless.",setup:"Choose a move that is too far to static but does not require a full jump.",execution:"Drive from the legs, float upward, and close the hand exactly as momentum stalls.",commonMistake:"Yanking early, slapping late, or cutting feet because the catch is mistimed.",coachCue:"Catch the quiet moment.",repCounting:"Count attempts with a controlled catch, even if you do not send.",progression:"Use smaller target holds.",regression:"Shorten the distance or use better hands."},
  "Downclimbing":{demoId:"downclimb",equipment:"Climbing wall",summary:"Reverse easy climbs with the same control you used going up.",setup:"Choose a climb well below your limit with clean downclimb options.",execution:"Look for feet first, lower through the legs, and keep your hands relaxed enough to choose the next hold.",commonMistake:"Rushing, jumping, or downclimbing only with the arms.",coachCue:"Feet find the way down.",repCounting:"Count completed downclimbs, not just starts.",progression:"Downclimb slightly longer routes.",regression:"Downclimb only the top half or traverse low."},
  "Route-reading routine":{demoId:"routeRead",equipment:"Climbing wall",summary:"Preview holds, body positions, rests, and cruxes before you pull on.",setup:"Stand where you can see the full problem.",execution:"Trace hands and feet, mime the crux, choose likely rests, then rehearse the first three moves twice.",commonMistake:"Only reading handholds and discovering feet mid-climb.",coachCue:"Hands tell the story, feet write the details.",repCounting:"One rep is one complete read before an attempt.",progression:"Call the sequence out loud before trying.",regression:"Read only the first half, then compare after an attempt."},
  "Falling practice":{demoId:"falling",equipment:"Pads and clear landing",summary:"Build calm, repeatable landing mechanics from low heights.",setup:"Clear the landing, start low, and keep arms relaxed.",execution:"Drop feet-first, bend knees, roll through the landing if needed, and reset before going higher.",commonMistake:"Reaching back with straight arms or practicing from too high too soon.",coachCue:"Soft knees, quiet hands.",repCounting:"Count calm landings only.",progression:"Increase height gradually after several easy landings.",regression:"Step off from a low hold or practice on the floor."},
  "Eccentric (negative) pull-ups":{demoId:"pullupLower",equipment:"Pull-up bar or assisted machine",summary:"Build pulling strength by controlling the lowering phase.",setup:"Start with chin over the bar using a box, jump, or assistance.",execution:"Brace, pull shoulders down, then lower for the full count until arms are long.",commonMistake:"Dropping quickly through the hard middle range.",coachCue:"Own every inch down.",repCounting:"One rep is one controlled 4-5 second lower.",progression:"Add time before adding reps.",regression:"Use more assistance or shorten the range."},
  "Band / machine-assisted pull-ups":{demoId:"assistedPullup",equipment:"Band or assisted pull-up machine",summary:"Practice full clean pull-up reps with enough assistance to avoid grinding.",setup:"Set assistance so every rep can finish with good shoulder position.",execution:"Start from active shoulders, pull chest toward the bar, pause briefly, and lower under control.",commonMistake:"Kicking, craning the neck, or using too little assistance.",coachCue:"Smooth beats heroic.",repCounting:"Count only full-range clean reps.",progression:"Reduce assistance slightly.",regression:"Increase assistance or use slow negatives."},
  "Clean reps just shy of failure":{demoId:"cleanPullup",equipment:"Pull-up bar",summary:"Accumulate quality pull-ups while leaving one good rep in reserve.",setup:"Choose a set size that never turns into a grind.",execution:"Use the same start, pull, pause, and controlled lower on every rep.",commonMistake:"Chasing failure until the final reps change shape.",coachCue:"Stop while the next rep would still be clean.",repCounting:"Count clean reps only; ugly reps are feedback.",progression:"Add a rep across total sets.",regression:"Use assistance or return to eccentrics."},
  "Active / scapular hangs":{demoId:"scapHang",equipment:"Pull-up bar",summary:"Teach shoulders to stay engaged under hanging load.",setup:"Hang with arms straight and feet lightly supported if needed.",execution:"Without bending elbows, pull shoulder blades down, pause, then return slowly.",commonMistake:"Bending the elbows or relaxing into the ears.",coachCue:"Shoulders away from ears.",repCounting:"One rep is down, hold, slow release.",progression:"Longer pauses or full bodyweight.",regression:"Keep feet on the floor for support."},
  "Dynamic warm-up (circles, reach-and-roll, Egyptians)":{demoId:"warmup",equipment:"Open floor space or light band",summary:"Prime shoulders and upper back before loading fingers or pulling hard.",setup:"Stand tall and move through pain-free ranges.",execution:"Circle shoulders, reach and roll the upper back, then add slow Egyptian rotations.",commonMistake:"Rushing through tiny ranges while still cold.",coachCue:"Wake the joints before asking for power.",repCounting:"Use time: about two smooth minutes.",progression:"Add a light band for control.",regression:"Use smaller circles and slower breaths."},
  "External rotations":{demoId:"externalRotation",equipment:"Light band or cable",summary:"Train the rotator cuff position climbing often neglects.",setup:"Pin elbow at your side at 90 degrees with a towel if useful.",execution:"Rotate the forearm outward without letting the elbow drift, then return slowly.",commonMistake:"Twisting the torso or using a band that is too heavy.",coachCue:"Elbow pinned, forearm opens.",repCounting:"Count smooth outward rotations.",progression:"Slightly more band tension.",regression:"Move closer to the anchor or use no band."},
  "Reverse fly":{demoId:"reverseFly",equipment:"Light dumbbells or bands",summary:"Strengthen the rear shoulder and shoulder blade control.",setup:"Hinge at the hips with a long spine and soft knees.",execution:"Lift arms out to the sides, squeeze shoulder blades lightly, and lower with control.",commonMistake:"Shrugging or swinging the weights.",coachCue:"Wide arms, low shoulders.",repCounting:"Count controlled raises with no momentum.",progression:"Add a small load.",regression:"Use no weight and shorter range."},
  "Scaption raise":{demoId:"scaption",equipment:"Light dumbbells",summary:"Build cuff-friendly overhead control in the scapular plane.",setup:"Stand tall with thumbs up and arms slightly forward of your sides.",execution:"Raise to shoulder height, pause, and lower slowly.",commonMistake:"Going too heavy and shrugging.",coachCue:"Thumbs up, shoulders down.",repCounting:"Count smooth raises to shoulder height.",progression:"Add load only if shoulders stay quiet.",regression:"Use no weight or raise lower."},
  "Y / T / L band raises":{demoId:"ytl",equipment:"Light band",summary:"Train lower trap, mid trap, and cuff positions in one small circuit.",setup:"Lean slightly and keep the band light enough to trace clean shapes.",execution:"Trace a Y, then T, then L with slow control and no shrug.",commonMistake:"Turning it into a heavy arm exercise.",coachCue:"Draw letters with shoulder blades, not ego.",repCounting:"Count one Y, one T, and one L as a mini round.",progression:"Add a second round.",regression:"Do the letters without a band."},
  "Push-ups (or light overhead press)":{demoId:"pushup",equipment:"Floor or light dumbbells",summary:"Balance climbing's pulling volume with controlled pushing.",setup:"Choose push-ups, incline push-ups, or a light press that stays pain-free.",execution:"Brace the trunk, lower smoothly, press without flaring wildly, and stop before form fades.",commonMistake:"Letting hips sag or chasing fatigue for its own sake.",coachCue:"One clean line from ribs to hips.",repCounting:"Count controlled reps with a stable trunk.",progression:"Lower the incline or add light press load.",regression:"Use wall or bench push-ups."},
  "Wrist extensor work":{demoId:"wristExtensor",equipment:"Light dumbbell or band",summary:"Condition the forearm extensors to support elbow health.",setup:"Support the forearm with palm facing down.",execution:"Lift the back of the hand slowly, pause, then lower with control.",commonMistake:"Using heavy weight and turning it into a jerky wrist curl.",coachCue:"Small muscle, small load.",repCounting:"Count smooth lifts, especially the lowering phase.",progression:"Add a few reps before adding load.",regression:"Use a lighter object or band."},
  "Hanging leg / knee raises":{demoId:"kneeRaise",equipment:"Pull-up bar",summary:"Train trunk tension while hanging with controlled shoulders.",setup:"Start in an active hang with ribs down.",execution:"Raise knees or legs without swinging, pause, and lower slowly.",commonMistake:"Using momentum or letting shoulders collapse.",coachCue:"Zip knees up, melt them down.",repCounting:"Count no-swing raises.",progression:"Straighter legs or slower lowers.",regression:"Bent knees or captain's chair support."},
  "Front & side planks":{demoId:"plank",equipment:"Floor",summary:"Build anti-extension and side-body stiffness for stable climbing positions.",setup:"Set elbows under shoulders and make a straight line from ribs to hips.",execution:"Brace gently, breathe, and hold without sagging or piking.",commonMistake:"Holding longer after the shape has already failed.",coachCue:"Shorter perfect holds beat long messy ones.",repCounting:"Use seconds with clean position.",progression:"Add side plank leg raise.",regression:"Drop knees or shorten the hold."},
  "Bird-dog / Pallof press":{demoId:"birdDog",equipment:"Floor or cable/band",summary:"Resist rotation while limbs move, like staying quiet on the wall.",setup:"For bird-dog, start on all fours. For Pallof, stand side-on to a band.",execution:"Extend opposite limbs or press the band straight out while the torso stays still.",commonMistake:"Opening the hip, twisting the ribs, or rushing.",coachCue:"Move limbs; keep trunk boring.",repCounting:"Count stable reps per side.",progression:"Longer pauses or more band tension.",regression:"Shorten the limb reach or reduce tension."},
  "Single-leg step-ups":{demoId:"stepUp",equipment:"Box or bench",summary:"Build leg drive for high steps and stable stands.",setup:"Put the whole foot on a box at a height you can control.",execution:"Drive through the working foot, stand tall, then lower slowly without dropping.",commonMistake:"Pushing off the floor leg or letting the knee cave inward.",coachCue:"Stand up through the foothold.",repCounting:"Count controlled reps per side.",progression:"Higher box or light load.",regression:"Lower box or hand support."},
  "Edging calf raises":{demoId:"calfRaise",equipment:"Step or small edge",summary:"Train ankle stiffness for standing on small footholds.",setup:"Stand with the front of the foot on an edge and hold support if needed.",execution:"Rise through the big toe side, pause, then lower with control.",commonMistake:"Rolling ankles outward or bouncing through reps.",coachCue:"Press the edge, do not bounce it.",repCounting:"Count smooth raises.",progression:"Single-leg reps.",regression:"Use both feet and hand support."},
  "Eccentric heel drops":{demoId:"heelDrop",equipment:"Step",summary:"Condition the Achilles and calf by controlling the lowering phase.",setup:"Rise with both feet, then shift weight to one side.",execution:"Lower one heel below the step slowly, reset with both feet, and repeat.",commonMistake:"Dropping fast or forcing painful depth.",coachCue:"Slow lower, easy reset.",repCounting:"Count slow lowers per side.",progression:"Longer lowers or light load.",regression:"Reduce depth or use both feet."},
  "Intrinsic foot work":{demoId:"intrinsicFoot",equipment:"Towel or light band",summary:"Strengthen small foot muscles that help precision and shoe control.",setup:"Sit or stand with the foot flat and relaxed.",execution:"Shorten the arch, curl toes lightly, or press outward into a band without gripping hard.",commonMistake:"Cramping from over-squeezing the toes.",coachCue:"Quiet foot, small effort.",repCounting:"Use short time blocks or smooth curls.",progression:"Stand while keeping balance.",regression:"Seated work with less effort."},
  "Foot-supported (assisted) hangs":{demoId:"assistedHang",equipment:"Large edge and floor support",summary:"Prepare finger tissues without full bodyweight hanging.",setup:"Use a comfortable edge with feet taking real weight.",execution:"Set shoulders, lightly load the fingers for 8-10 seconds, then step down before strain appears.",commonMistake:"Turning a prep drill into a max hang.",coachCue:"Feet make it easy; fingers just learn.",repCounting:"Count pain-free easy hangs only.",progression:"Slightly less foot support after weeks of comfort.",regression:"More foot support or skip entirely if anything complains."},
};

const guideFor = (exercise) => GUIDE[exercise.n] || {
  demoId:"cueCard",
  equipment:"Bodyweight",
  summary:exercise.h,
  setup:"Start with a load and range you can control.",
  execution:"Move slowly enough that the target position stays clear.",
  commonMistake:"Rushing the rep or chasing fatigue after form changes.",
  coachCue:"Quality first.",
  repCounting:"Count only clean reps.",
};

function MovementDemo({ id="cueCard", compact=false, label="" }){
  const s={fill:"none",stroke:"var(--rope)",strokeWidth:5,strokeLinecap:"round",strokeLinejoin:"round"};
  const soft={fill:"none",stroke:"var(--chalk-dim)",strokeWidth:3,strokeLinecap:"round",strokeLinejoin:"round"};
  const moss={fill:"none",stroke:"var(--moss)",strokeWidth:5,strokeLinecap:"round",strokeLinejoin:"round"};
  const wall=<line x1="22" y1="14" x2="22" y2="136" stroke="var(--line)" strokeWidth="4"/>;
  const hold=(x,y,w=20)=><path d={`M${x} ${y} l${w} -5 l0 13 l-${w} 0 z`} fill="var(--surface2)" stroke="var(--line)" strokeWidth="2"/>;
  const head=(cx,cy,props=s)=><circle cx={cx} cy={cy} r="8" {...props}/>;
  const scene=(()=>{
    switch(id){
      case "precisionFeet": case "glueFeet": case "blindFoot":
        return <>{wall}{hold(22,102,30)}<circle className="demo-pulse" cx="52" cy="98" r="12" {...moss}/><g className="demo-step"><path d="M78 58 l-20 40" {...s}/><path d="M58 98 l-16 0" {...s}/></g><path d="M82 58 l18 -14" {...soft}/><circle cx="103" cy="42" r="4" fill="var(--moss)"/></>;
      case "straightArm": case "scapHang": case "assistedHang":
        return <><line x1="38" y1="24" x2="118" y2="24" stroke="var(--line)" strokeWidth="7" strokeLinecap="round"/><g className={id==="scapHang"?"demo-slow":"demo-breathe"}>{head(78,51)}<line x1="78" y1="59" x2="78" y2="98" {...s}/><line x1="78" y1="65" x2="54" y2="29" {...s}/><line x1="78" y1="65" x2="102" y2="29" {...s}/><line x1="78" y1="98" x2="60" y2="126" {...s}/><line x1="78" y1="98" x2="96" y2="126" {...s}/></g>{id==="assistedHang"&&<line x1="34" y1="130" x2="122" y2="130" stroke="var(--moss)" strokeWidth="5" strokeLinecap="round"/>}</>;
      case "flag":
        return <>{wall}{hold(22,94,26)}<g className="demo-swing" style={{transformOrigin:"58px 82px"}}>{head(62,36)}<line x1="62" y1="44" x2="58" y2="82" {...s}/><line x1="61" y1="55" x2="36" y2="46" {...s}/><line x1="58" y1="82" x2="43" y2="116" {...s}/><path d="M58 82 q36 6 56 34" {...s}/></g></>;
      case "dropKnee":
        return <>{wall}{hold(22,102,24)}<g>{head(64,35)}<line x1="64" y1="43" x2="64" y2="82" {...s}/><line x1="64" y1="54" x2="38" y2="46" {...s}/><line x1="64" y1="82" x2="42" y2="110" {...s}/><path className="demo-knee" style={{transformOrigin:"86px 91px"}} d="M64 82 l28 7 l-17 27" {...s}/></g><path className="demo-pulse" d="M80 86 q-18 10 -44 8" {...moss}/></>;
      case "deadpoint":
        return <>{wall}{hold(22,112,22)}<circle cx="104" cy="36" r="9" {...moss}/><path className="demo-dash" d="M48 104 q20 -62 56 -68" stroke="var(--chalk-dim)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="4 8"/><g className="demo-reach">{head(48,92)}<line x1="48" y1="100" x2="48" y2="122" {...s}/><line x1="48" y1="106" x2="32" y2="96" {...s}/><line x1="48" y1="106" x2="66" y2="78" {...s}/></g></>;
      case "downclimb":
        return <>{wall}{hold(22,50,24)}{hold(22,92,28)}{hold(22,124,24)}<g className="demo-slow">{head(62,54)}<line x1="62" y1="62" x2="58" y2="96" {...s}/><line x1="58" y1="96" x2="40" y2="124" {...s}/><line x1="58" y1="96" x2="78" y2="120" {...s}/><line x1="62" y1="72" x2="34" y2="52" {...s}/></g></>;
      case "routeRead":
        return <>{wall}{[34,58,84,112].map((y,i)=><circle key={y} cx={42+i*20} cy={y} r="6" fill={i%2?"var(--rope)":"var(--moss)"}/>) }<path className="demo-dash" d="M42 112 C54 86 72 84 62 58 S88 42 102 34" stroke="var(--chalk-dim)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="5 9"/><path d="M84 116 q18 8 32 0" {...moss}/></>;
      case "falling":
        return <><rect x="28" y="120" width="96" height="12" rx="6" fill="var(--surface2)" stroke="var(--line)" strokeWidth="2"/><g className="demo-slow">{head(74,44)}<line x1="74" y1="52" x2="74" y2="82" {...s}/><line x1="74" y1="63" x2="54" y2="78" {...s}/><line x1="74" y1="63" x2="94" y2="78" {...s}/><line x1="74" y1="82" x2="58" y2="110" {...s}/><line x1="74" y1="82" x2="92" y2="110" {...s}/></g><path d="M54 112 q20 16 44 0" {...moss}/></>;
      case "pullupLower": case "assistedPullup": case "cleanPullup":
        return <><line x1="34" y1="28" x2="120" y2="28" stroke="var(--line)" strokeWidth="7" strokeLinecap="round"/><g className={id==="pullupLower"?"demo-lower":"demo-slow"}>{head(77,50)}<line x1="77" y1="58" x2="77" y2="95" {...s}/><line x1="77" y1="64" x2="55" y2="30" {...s}/><line x1="77" y1="64" x2="99" y2="30" {...s}/><line x1="77" y1="95" x2="60" y2="124" {...s}/><line x1="77" y1="95" x2="94" y2="124" {...s}/></g>{id==="assistedPullup"&&<path d="M77 96 q-18 18 0 34 q18 -16 0 -34" fill="none" stroke="var(--moss)" strokeWidth="4"/>}</>;
      case "warmup": case "externalRotation": case "reverseFly": case "scaption": case "ytl":
        return <><line x1="76" y1="52" x2="76" y2="98" {...s}/>{head(76,40)}<line x1="76" y1="98" x2="58" y2="126" {...s}/><line x1="76" y1="98" x2="94" y2="126" {...s}/><line x1="38" y1="74" x2="116" y2="74" stroke="var(--line)" strokeWidth="3" strokeDasharray="4 7"/><path className="demo-raise" style={{transformOrigin:"76px 62px"}} d="M76 62 l-30 2" {...s}/><path className="demo-raise" style={{transformOrigin:"76px 62px",animationDelay:".25s"}} d="M76 62 l30 2" {...s}/><circle className="demo-pulse" cx="46" cy="64" r="5" fill="var(--moss)" stroke="none"/></>;
      case "pushup": case "plank":
        return <><line x1="28" y1="122" x2="124" y2="122" stroke="var(--line)" strokeWidth="5" strokeLinecap="round"/><g className={id==="pushup"?"demo-slow":"demo-breathe"}><circle cx="48" cy="82" r="8" {...s}/><line x1="56" y1="86" x2="98" y2="102" {...s}/><line x1="66" y1="90" x2="54" y2="120" {...s}/><line x1="98" y1="102" x2="118" y2="120" {...s}/></g></>;
      case "wristExtensor":
        return <><line x1="38" y1="88" x2="94" y2="88" {...s}/><path className="demo-raise" style={{transformOrigin:"94px 88px"}} d="M94 88 l30 -8" {...s}/><rect x="116" y="72" width="12" height="18" rx="3" fill="var(--surface2)" stroke="var(--line)" strokeWidth="2"/><line x1="34" y1="104" x2="120" y2="104" stroke="var(--line)" strokeWidth="4" strokeLinecap="round"/></>;
      case "kneeRaise":
        return <><line x1="38" y1="24" x2="116" y2="24" stroke="var(--line)" strokeWidth="7" strokeLinecap="round"/><g>{head(76,50)}<line x1="76" y1="58" x2="76" y2="90" {...s}/><line x1="76" y1="64" x2="54" y2="28" {...s}/><line x1="76" y1="64" x2="98" y2="28" {...s}/><path className="demo-raise" style={{transformOrigin:"76px 90px"}} d="M76 90 l-18 30 M76 90 l20 30" {...s}/></g></>;
      case "birdDog":
        return <><line x1="28" y1="118" x2="126" y2="118" stroke="var(--line)" strokeWidth="5" strokeLinecap="round"/><circle cx="54" cy="72" r="7" {...s}/><line x1="61" y1="76" x2="92" y2="90" {...s}/><path className="demo-reach" d="M62 78 l-26 -12" {...s}/><path className="demo-reach" style={{animationDelay:".25s"}} d="M92 90 l30 18" {...s}/><line x1="72" y1="82" x2="58" y2="116" {...s}/><line x1="88" y1="88" x2="82" y2="116" {...s}/></>;
      case "stepUp":
        return <><rect x="66" y="92" width="54" height="32" rx="4" fill="var(--surface2)" stroke="var(--line)" strokeWidth="2"/><g className="demo-step">{head(50,45)}<line x1="50" y1="53" x2="52" y2="88" {...s}/><line x1="52" y1="88" x2="76" y2="104" {...s}/><line x1="52" y1="88" x2="40" y2="120" {...s}/><line x1="50" y1="62" x2="70" y2="72" {...s}/></g></>;
      case "calfRaise": case "heelDrop": case "intrinsicFoot":
        return <><rect x="38" y="110" width="86" height="10" rx="4" fill="var(--surface2)" stroke="var(--line)" strokeWidth="2"/><g className={id==="heelDrop"?"demo-slow":"demo-raise"} style={{transformOrigin:"78px 110px"}}><line x1="76" y1="40" x2="76" y2="92" {...s}/><line x1="76" y1="92" x2="58" y2="110" {...s}/><line x1="76" y1="92" x2="96" y2="110" {...s}/><path d="M58 110 q16 -9 34 0" {...moss}/></g><circle className="demo-pulse" cx="64" cy="110" r="5" fill="var(--moss)" stroke="none"/></>;
      default:
        return <><circle className="demo-pulse" cx="76" cy="46" r="18" {...moss}/><path d="M42 94 h68" {...s}/><path d="M50 114 h52" {...soft}/><path d="M62 74 h28" {...soft}/></>;
    }
  })();
  return (
    <div className="demo-panel" style={{height:compact?96:190}}>
      <svg className="demo-svg" viewBox="0 0 152 144" role="img" aria-label={label||"Movement demo"}>{scene}</svg>
      <div className="demo-label">{compact?"Preview":"Looping guide"}</div>
    </div>
  );
}

function GuideBlock({ title, color="var(--rope)", children }){
  if(!children) return null;
  return (
    <div style={{marginTop:14,padding:"12px 13px",background:"var(--granite)",border:"1px solid var(--line)",borderRadius:12}}>
      <div className="disp" style={{fontSize:11,letterSpacing:".09em",textTransform:"uppercase",color,marginBottom:5}}>{title}</div>
      <div style={{fontSize:14,lineHeight:1.5,color:"var(--chalk-dim)"}}>{children}</div>
    </div>
  );
}

function DrillSheetV2({ name, onClose }){
  const e=exByName(name);
  if(!e) return null;
  const d=guideFor(e);
  return (
    <div onClick={onClose} className="ct-root" style={{position:"fixed",inset:0,zIndex:70,background:"rgba(8,6,4,.62)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={ev=>ev.stopPropagation()} className="card fadein" style={{width:"100%",maxWidth:560,borderRadius:"20px 20px 0 0",padding:"8px 18px 28px",maxHeight:"88vh",overflowY:"auto",background:"linear-gradient(180deg,var(--surface),var(--granite))"}}>
        <div style={{width:42,height:4,background:"var(--line)",borderRadius:4,margin:"8px auto 18px"}}/>
        <MovementDemo id={d.demoId} label={e.n}/>
        <div style={{marginTop:14}}>
          <h2 className="disp" style={{fontSize:22,margin:"0 0 8px",lineHeight:1.12}}>{e.n}</h2>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            <span className="pill" style={{background:"var(--surface2)",color:"var(--rope)"}}>{e.c}</span>
            <span className="pill mono" style={{background:"var(--surface2)",color:"var(--chalk-dim)"}}>{e.d}</span>
            <span className="pill" style={{background:"var(--surface2)",color:"var(--moss)"}}>{d.equipment}</span>
          </div>
          <p style={{margin:0,fontSize:15,lineHeight:1.5,color:"var(--chalk)"}}>{d.summary}</p>
        </div>
        <GuideBlock title="How" color="var(--moss)">
          <p style={{margin:"0 0 8px"}}><strong style={{color:"var(--chalk)"}}>Set up: </strong>{d.setup}</p>
          <p style={{margin:0}}><strong style={{color:"var(--chalk)"}}>Do it: </strong>{d.execution}</p>
        </GuideBlock>
        <GuideBlock title="Cues">
          <p style={{margin:"0 0 8px"}}>{d.coachCue}</p>
          <p style={{margin:0}}><strong style={{color:"var(--chalk)"}}>Count: </strong>{d.repCounting}</p>
        </GuideBlock>
        <GuideBlock title="Watch for" color="var(--deload)">{d.commonMistake}</GuideBlock>
        {(d.progression || d.regression) && (
          <GuideBlock title="Scale" color="var(--test)">
            {d.regression && <p style={{margin:"0 0 8px"}}><strong style={{color:"var(--chalk)"}}>Easier: </strong>{d.regression}</p>}
            {d.progression && <p style={{margin:0}}><strong style={{color:"var(--chalk)"}}>Harder: </strong>{d.progression}</p>}
          </GuideBlock>
        )}
        <div style={{marginTop:14}}><Timer initial={60}/></div>
        <button className="btn btn-ghost" style={{width:"100%",padding:12,marginTop:18}} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function RoutineSheet({ rkey, week, onClose, onDrill }){
  const r=ROUTINES[rkey]; if(!r) return null;
  const list=EX.filter(e=>e.c===r.cat && (!e.g || !week || e.g<=week));
  return (
    <div onClick={onClose} className="ct-root" style={{position:"fixed",inset:0,zIndex:68,background:"rgba(8,6,4,.62)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={ev=>ev.stopPropagation()} className="card fadein" style={{width:"100%",maxWidth:520,borderRadius:"20px 20px 0 0",padding:"8px 18px 28px",maxHeight:"88vh",overflowY:"auto",background:"linear-gradient(180deg,var(--surface),var(--granite))"}}>
        <div style={{width:42,height:4,background:"var(--line)",borderRadius:4,margin:"8px auto 18px"}}/>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:4}}>
          {React.createElement(CAT_ICON[r.cat]||Activity,{size:22,style:{color:"var(--rope)"}})}
          <h2 className="disp" style={{fontSize:21,margin:0}}>{r.label}</h2>
        </div>
        <p style={{margin:"0 0 14px",fontSize:13,color:"var(--faint)"}}>{list.length} exercise{list.length!==1?"s":""} · tap any for the full how-to</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {list.map(e=>{ const g=guideFor(e); return (
            <button key={e.n} onClick={()=>onDrill&&onDrill(e.n)} className="card" style={{padding:13,textAlign:"left",cursor:"pointer",background:"var(--granite)",color:"var(--chalk)"}}>
              <div style={{marginBottom:9}}><MovementDemo id={g.demoId} compact label={e.n}/></div>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                <strong style={{fontSize:14}}>{e.n}</strong>
                <span className="mono" style={{fontSize:10,color:"var(--faint)",whiteSpace:"nowrap"}}>{e.d}</span>
              </div>
              <p style={{margin:"6px 0 0",fontSize:13,color:"var(--chalk-dim)",lineHeight:1.45}}>{g.summary}</p>
            </button>
          );})}
        </div>
        <button className="btn btn-ghost" style={{width:"100%",padding:12,marginTop:18}} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function Pyramid({ sends, setSends, flash }){
  const grades=Object.keys(sends).map(Number);
  const maxG=Math.max(4, flash||0, ...grades);
  const rows=[]; for(let g=maxG; g>=0; g--) rows.push(g);
  const maxCount=Math.max(1, ...rows.map(g=>sends[g]||0));
  const total=rows.reduce((a,g)=>a+(sends[g]||0),0);
  const bump=(g,delta)=>setSends(s=>{ const n={...s}; n[g]=Math.max(0,(n[g]||0)+delta); return n; });
  return (
    <div className="card" style={{padding:15,marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
        <div className="disp" style={{fontSize:14,color:"var(--rope)"}}>Climbing pyramid <span style={{color:"var(--faint)",fontWeight:500}}>· {total} sends</span></div>
        <div style={{fontSize:11,color:"var(--faint)"}}>tap +/− to log</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {rows.map(g=>{
          const n=sends[g]||0, w=`${(n/maxCount)*100}%`, isFlash=g===flash;
          return (
            <div key={g} style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>bump(g,-1)} style={{width:24,height:24,borderRadius:6,border:"1px solid var(--line)",background:"transparent",color:"var(--faint)",cursor:"pointer",flexShrink:0,fontSize:16,lineHeight:1}}>–</button>
              <div className="disp mono" style={{width:28,textAlign:"center",fontSize:13,color:isFlash?"var(--moss)":"var(--chalk-dim)"}}>V{g}</div>
              <div style={{flex:1,height:24,display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div style={{width:w,minWidth:n?28:3,height:"100%",borderRadius:6,transition:"width .25s",display:"flex",alignItems:"center",justifyContent:"center",
                  background:n?(isFlash?"linear-gradient(90deg,var(--moss),var(--rope))":"linear-gradient(90deg,var(--rope-soft),var(--rope))"):"var(--granite)"}}>
                  {n>0 && <span className="mono" style={{fontSize:12,color:"#1a120c",fontWeight:600}}>{n}</span>}
                </div>
              </div>
              <button onClick={()=>bump(g,1)} style={{width:24,height:24,borderRadius:6,border:"1px solid var(--rope)",background:"transparent",color:"var(--rope)",cursor:"pointer",flexShrink:0,fontSize:16,lineHeight:1}}>+</button>
            </div>
          );
        })}
      </div>
      {flash!=null && <div style={{fontSize:11,color:"var(--faint)",marginTop:10,textAlign:"center"}}>V{flash} highlighted = your current flash grade</div>}
    </div>
  );
}

/* ============================ STORAGE ============================ */
const canUseStorage = () => typeof window !== "undefined" && window.localStorage;
const readJson = (k, def=null) => {
  if (!canUseStorage()) return def;
  try { const raw=window.localStorage.getItem(k); return raw ? JSON.parse(raw) : def; }
  catch { return def; }
};
const writeJson = (k, v) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(k, JSON.stringify(v));
};
const nowIso = () => new Date().toISOString();
const makeDefaultAppData = () => ({
  schemaVersion: SCHEMA_VERSION,
  updatedAt: nowIso(),
  activeCycle: {
    cycleId: `cycle_${Date.now()}`,
    cycleNumber: 1,
    planTemplateId: "foundation-12wk",
    plan: DEFAULT_PLAN,
    logs: {},
    metrics: [],
    schedule: { ...DEFAULT_SCHEDULE, startDate: today() },
    startedAt: nowIso(),
    completedAt: null,
  },
  completedCycles: [],
  sends: DEFAULT_SENDS,
  settings: DEFAULT_SETTINGS,
});
function migrateV2toV3(raw){
  return {
    schemaVersion: 3,
    updatedAt: raw.updatedAt || nowIso(),
    activeCycle: {
      cycleId: "cycle_migrated",
      cycleNumber: 1,
      planTemplateId: "foundation-12wk",
      plan: raw.plan || DEFAULT_PLAN,
      logs: raw.logs || {},
      metrics: Array.isArray(raw.metrics) ? raw.metrics : [],
      schedule: raw.schedule || { ...DEFAULT_SCHEDULE, startDate: today() },
      startedAt: raw.schedule?.startDate
        ? new Date(`${raw.schedule.startDate}T12:00:00`).toISOString()
        : raw.updatedAt || nowIso(),
      completedAt: null,
    },
    completedCycles: [],
    sends: raw.sends || DEFAULT_SENDS,
    settings: raw.settings || {},
  };
}
function normalizeLog(log){
  if(!log || typeof log!=="object") return log;
  return {
    ...log,
    skipAction: log.status==="skip" ? (log.skipAction || "reschedule") : undefined,
    volumeByGrade: log.volumeByGrade && typeof log.volumeByGrade==="object" ? log.volumeByGrade : {},
    attemptsByGrade: log.attemptsByGrade && typeof log.attemptsByGrade==="object" ? log.attemptsByGrade : {},
  };
}
function normalizeLogs(logs){
  if(!logs || typeof logs!=="object") return {};
  return Object.fromEntries(Object.entries(logs).map(([k,v])=>[k,normalizeLog(v)]));
}
function normalizeAppData(raw){
  if(!raw) return makeDefaultAppData();
  // Migrate v2 → v3 (flat plan/logs/metrics at root)
  if((raw.schemaVersion||1) < 3 && !raw.activeCycle){
    raw = migrateV2toV3(raw);
  }
  const base = makeDefaultAppData();
  const ac = raw.activeCycle || base.activeCycle;
  return {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: raw.updatedAt || raw.exportedAt || base.updatedAt,
    activeCycle: {
      cycleId: ac.cycleId || base.activeCycle.cycleId,
      cycleNumber: ac.cycleNumber || 1,
      planTemplateId: ac.planTemplateId || "foundation-12wk",
      plan: ac.plan?.weeks ? ac.plan : base.activeCycle.plan,
      logs: normalizeLogs(ac.logs),
      metrics: Array.isArray(ac.metrics) ? ac.metrics : [],
      schedule: {
        ...base.activeCycle.schedule,
        ...(ac.schedule||{}),
        preferredSessionDays: {
          ...base.activeCycle.schedule.preferredSessionDays,
          ...(ac.schedule?.preferredSessionDays||{}),
        },
        travelBlocks: Array.isArray(ac.schedule?.travelBlocks) ? ac.schedule.travelBlocks : [],
        sessionOverrides: (ac.schedule?.sessionOverrides && typeof ac.schedule.sessionOverrides==="object") ? ac.schedule.sessionOverrides : {},
        lastRescheduleUndo: ac.schedule?.lastRescheduleUndo || null,
      },
      startedAt: ac.startedAt || base.activeCycle.startedAt,
      completedAt: ac.completedAt || null,
    },
    completedCycles: Array.isArray(raw.completedCycles) ? raw.completedCycles : [],
    sends: raw.sends && typeof raw.sends==="object" ? raw.sends : base.sends,
    settings: { ...base.settings, ...(raw.settings||{}) },
  };
}
function loadAppData(){
  const saved=readJson(APP_DATA_KEY);
  if(saved) return normalizeAppData(saved);
  const legacy={
    plan: readJson("ct_plan", DEFAULT_PLAN),
    logs: readJson("ct_logs", {}),
    metrics: readJson("ct_metrics", []),
    sends: readJson("ct_sends", DEFAULT_SENDS),
  };
  const migrated=normalizeAppData(legacy);
  writeJson(APP_DATA_KEY, migrated);
  return migrated;
}
function saveAppData(next, opts={}){
  const normalized=normalizeAppData(next);
  const stamped=opts.touch===false ? normalized : { ...normalized, updatedAt:nowIso() };
  writeJson(APP_DATA_KEY, stamped);
  return stamped;
}
function exportBackup(data){ return JSON.stringify({ ...normalizeAppData(data), exportedAt:new Date().toISOString() }, null, 2); }
function importBackup(json, current){
  const parsed=JSON.parse(json);
  // Legacy plan-only import (array of weeks at root)
  if(parsed?.weeks && Array.isArray(parsed.weeks)){
    return { ok:true, data:normalizeAppData({ ...current, activeCycle:{ ...current.activeCycle, plan:parsed } }) };
  }
  // Full v2 backup (plan.weeks at root, no activeCycle)
  if(parsed?.plan?.weeks && !parsed?.activeCycle){
    const migrated=migrateV2toV3(parsed);
    return { ok:true, data:normalizeAppData({ ...migrated, completedCycles: current.completedCycles||[] }) };
  }
  // v3 backup
  if(!parsed?.activeCycle?.plan?.weeks) throw new Error("Backup needs either a plan weeks array or a full app backup.");
  return { ok:true, data:normalizeAppData({ ...current, ...parsed }) };
}
function newestAppData(local, remote){
  if(!remote) return normalizeAppData(local);
  const l=normalizeAppData(local);
  const r=normalizeAppData(remote);
  return new Date(r.updatedAt) > new Date(l.updatedAt) ? r : l;
}

/* ============================ HELPERS ============================ */
const exByName = (n) => EX.find((e) => e.n === n);
const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const today = () => new Date().toISOString().slice(0,10);
const parseLocalDate = (date) => new Date(`${date}T12:00:00`);
const ordinal = (day) => {
  const mod100=day%100;
  if(mod100>=11 && mod100<=13) return `${day}th`;
  return `${day}${day%10===1?"st":day%10===2?"nd":day%10===3?"rd":"th"}`;
};
const fmtFullDate = (date) => {
  const d=parseLocalDate(date);
  return `${d.toLocaleDateString(undefined,{weekday:"long"})}, ${d.toLocaleDateString(undefined,{month:"long"})} ${ordinal(d.getDate())}`;
};
const PHASE_COLOR = { deload:"var(--deload)", test:"var(--test)", normal:"var(--rope)" };
const CAT_ICON = { Shoulder:Wind, "Pull-ups":Dumbbell, Core:Activity, "Foot/Ankle":Footprints, Fingers:Hand, Technique:Mountain, Antagonist:Dumbbell };
const logKey = (week, sid) => `${week}-${sid}`;
const addDays = (date, days) => {
  const d=parseLocalDate(date);
  d.setDate(d.getDate()+days);
  return d.toISOString().slice(0,10);
};
const monthKey = (date) => date.slice(0,7);
const monthStart = (date) => `${monthKey(date)}-01`;
const daysBetween = (start, end) => Math.round((new Date(`${end}T12:00:00`)-new Date(`${start}T12:00:00`))/86400000);
const plannedDate = (schedule, weekNum, sid) => addDays(schedule.startDate || today(), (weekNum-1)*7 + +(schedule.preferredSessionDays?.[sid] ?? 0));
const scheduledDate = (schedule, weekNum, sid) => schedule.sessionOverrides?.[logKey(weekNum,sid)] || plannedDate(schedule, weekNum, sid);
const sessionTitle = (s) => s?.day || "Session";
function activeTravelBlock(schedule, date){
  return (schedule.travelBlocks||[]).find(b=>b.startDate && b.endDate && date>=b.startDate && date<=b.endDate);
}
function travelBlocksOnDate(schedule, date){
  return (schedule.travelBlocks||[]).filter(b=>b.startDate && b.endDate && date>=b.startDate && date<=b.endDate);
}
function scheduleItems(plan, schedule, logs){
  return plan.weeks.flatMap(w=>w.sessions.map(s=>{
    const key=logKey(w.week,s.id);
    const date=scheduledDate(schedule,w.week,s.id);
    const planDate=plannedDate(schedule,w.week,s.id);
    return { key, week:w.week, phase:w.phase, type:w.type, session:s, date, planDate, shifted:date!==planDate, log:logs[key], travel:activeTravelBlock(schedule,date) };
  })).sort((a,b)=>a.date.localeCompare(b.date));
}
const isOpenLog = (log) => !log || (log.status==="skip" && log.skipAction!=="drop");
function currentScheduleState(plan, schedule, logs){
  const items=scheduleItems(plan,schedule,logs);
  const t=today();
  const open=items.filter(i=>isOpenLog(i.log));
  const overdue=open.filter(i=>i.date<t);
  const due=open.filter(i=>i.date===t);
  const upcoming=open.find(i=>i.date>=t) || null;
  const last=items.filter(i=>i.date<=t).at(-1);
  const currentWeek=last?.week || 1;
  return { items, overdue, due, upcoming, currentWeek };
}
function addSendMaps(...maps){
  const out={};
  maps.forEach(m=>Object.entries(m||{}).forEach(([g,n])=>{ out[g]=(out[g]||0)+(+n||0); }));
  return out;
}
function sendsFromLogs(logs){
  const out={};
  Object.values(logs).forEach(l=>Object.entries(l.volumeByGrade||{}).forEach(([g,n])=>{ out[g]=(out[g]||0)+(+n||0); }));
  return out;
}
function volumeScore(volumeByGrade){
  return Object.entries(volumeByGrade||{}).reduce((sum,[g,n])=>sum+(+n||0)*(+g+1),0);
}
function logEffort(log, session){
  if(!log || log.status==="skip") return null;
  if(session?.id==="support") return (+log.rpe||0)*2;
  return volumeScore(log.volumeByGrade)*(+(log.rpe||6)/6);
}
function plannedEffort(item){
  const routineLoad=(item.session.routines?.length||0)*2;
  const climbBase=item.session.id==="support" ? 8 : item.week>=9 ? 22 : item.week>=5 ? 18 : 14;
  const typeMod=item.type==="deload" ? .55 : item.type==="test" ? 1.15 : 1;
  return Math.round((climbBase+routineLoad)*typeMod);
}
function itemEffort(item){
  const logged=logEffort(item.log,item.session);
  return { value: logged ?? plannedEffort(item), logged: logged!=null };
}
function workoutSurfaceStyle(item){
  const effort=Math.max(0,itemEffort(item).value||0);
  const pct=Math.min(1, effort/32);
  const isSupport=item.session?.id==="support";
  const rgb=isSupport ? "102,153,179" : "212,103,58";
  const alpha=(.045 + pct*.14).toFixed(3);
  const edgeAlpha=(.08 + pct*.14).toFixed(3);
  return {
    background:`linear-gradient(135deg, rgba(${rgb},${alpha}), rgba(51,42,31,.76) 48%, rgba(25,21,15,.97))`,
    boxShadow:`inset 0 1px 0 rgba(${rgb},${edgeAlpha})`,
  };
}
function attemptStats(log){
  const entries=Object.entries(log?.attemptsByGrade||{}).map(([g,n])=>[+g,+n||0]).filter(([,n])=>n>0);
  if(!entries.length) return { count:0, hardest:null };
  return { count:entries.reduce((sum,[,n])=>sum+n,0), hardest:Math.max(...entries.map(([g])=>g)) };
}
function weeklyLogStats(logs, planLen){
  const weeks=Array.from({length:planLen},(_,i)=>({
    week:i+1, completed:0, sends:0, attempts:0, pain:0, rpeTotal:0, rpeCount:0,
    volume:0, effort:0, hardestSend:null, hardestAttempt:null, sendsByGrade:{}, attemptsByGrade:{}
  }));
  Object.entries(logs||{}).forEach(([key,log])=>{
    const week=+(key.split("-")[0]);
    const row=weeks[week-1];
    if(!row || !log || log.status==="skip") return;
    if(log.status==="Y" || log.status==="partial") row.completed+=1;
    if(log.pain) row.pain+=1;
    const rpe=+log.rpe;
    if(rpe){ row.rpeTotal+=rpe; row.rpeCount+=1; }
    Object.entries(log.volumeByGrade||{}).forEach(([grade,count])=>{
      const g=+grade, n=+count||0;
      if(!n) return;
      row.sends+=n;
      row.sendsByGrade[g]=(row.sendsByGrade[g]||0)+n;
      row.hardestSend=row.hardestSend==null ? g : Math.max(row.hardestSend,g);
    });
    Object.entries(log.attemptsByGrade||{}).forEach(([grade,count])=>{
      const g=+grade, n=+count||0;
      if(!n) return;
      row.attempts+=n;
      row.attemptsByGrade[g]=(row.attemptsByGrade[g]||0)+n;
      row.hardestAttempt=row.hardestAttempt==null ? g : Math.max(row.hardestAttempt,g);
    });
    row.volume+=volumeScore(log.volumeByGrade);
    row.effort+=logEffort(log,{ id:key.includes("support") ? "support" : "climb" }) || 0;
  });
  return weeks.map(w=>({
    ...w,
    avgRpe:w.rpeCount ? w.rpeTotal/w.rpeCount : null,
    effort:Math.round(w.effort),
  }));
}
function latestMetricValue(metrics, key){
  return [...(metrics||[])].reverse().find(m=>m?.[key]!=null && m[key]!=="")?.[key] ?? null;
}
function metricDelta(metrics, key){
  const pts=(metrics||[]).filter(m=>m?.[key]!=null && m[key]!=="");
  if(pts.length<2) return null;
  return { from:pts[0], to:pts.at(-1), value:+pts.at(-1)[key]-(+pts[0][key]) };
}
function buildMetricInsights(metrics, weeklyStats){
  const insights=[];
  const active=weeklyStats.filter(w=>w.completed || w.volume || w.effort || w.pain);
  const last=active.at(-1), prev=active.at(-2);
  if(last && prev && prev.effort>0 && last.effort>prev.effort*1.35){
    insights.push({ tone:"warn", text:`Week ${last.week} load jumped ${Math.round((last.effort/prev.effort-1)*100)}%. Keep the next session crisp or go easier if fingers feel flat.` });
  }
  if(last?.pain && (last.avgRpe>=7 || (prev && last.effort>prev.effort))){
    insights.push({ tone:"warn", text:`Pain showed up in week ${last.week} alongside meaningful stress. Treat that as a recovery signal, not a toughness test.` });
  }
  const flashDelta=metricDelta(metrics,"flash");
  const projectDelta=metricDelta(metrics,"project");
  const recentPain=active.slice(-2).some(w=>w.pain>0) || (metrics||[]).slice(-2).some(m=>m.pain);
  if((flashDelta?.value>0 || projectDelta?.value>0) && !recentPain){
    insights.push({ tone:"good", text:"Grade markers are moving without recent pain flags. That is the cleanest kind of progress." });
  }
  const pullDelta=metricDelta(metrics,"pullups");
  if(pullDelta && pullDelta.value<=0 && (flashDelta?.value>0 || projectDelta?.value>0)){
    insights.push({ tone:"good", text:"Climbing grades improved even though pull-ups did not. Movement efficiency is doing real work here." });
  }
  if(!insights.length){
    insights.push({ tone:"note", text:"Keep logging simple weekly checkpoints. The useful pattern is usually consistency plus pain-free volume, not one heroic number." });
  }
  return insights.slice(0,3);
}
function nextUnblockedDates(schedule, fromDate, count=3){
  const out=[];
  let cursor=fromDate;
  for(let i=0; i<60 && out.length<count; i++){
    cursor=addDays(cursor,1);
    if(!activeTravelBlock(schedule,cursor)) out.push(cursor);
  }
  return out;
}
const isOpenScheduleItem = (item) => isOpenLog(item.log);
const isClimbSession = (item) => item.session?.id?.startsWith("climb");
function planOrderItems(plan, schedule, logs){
  return plan.weeks.flatMap(w=>w.sessions.map(s=>{
    const key=logKey(w.week,s.id);
    const date=scheduledDate(schedule,w.week,s.id);
    const planDate=plannedDate(schedule,w.week,s.id);
    return { key, week:w.week, phase:w.phase, type:w.type, session:s, date, planDate, shifted:date!==planDate, log:logs[key], travel:activeTravelBlock(schedule,date) };
  }));
}
function wouldMakeThreeClimbs(date, climbDates){
  if(climbDates.has(date)) return false;
  let start=date, end=date;
  while(climbDates.has(addDays(start,-1))) start=addDays(start,-1);
  while(climbDates.has(addDays(end,1))) end=addDays(end,1);
  return daysBetween(start,end)+1>2;
}
function nextValidScheduleDate(schedule, fromDate, item, occupiedDates, climbDates, forceMove=false){
  let cursor=forceMove ? addDays(fromDate,1) : fromDate;
  for(let i=0; i<180; i++){
    const blocked=activeTravelBlock(schedule,cursor);
    const occupied=occupiedDates.has(cursor);
    const tooManyClimbs=isClimbSession(item) && wouldMakeThreeClimbs(cursor,climbDates);
    if(!blocked && !occupied && !tooManyClimbs) return cursor;
    cursor=addDays(cursor,1);
  }
  return cursor;
}
function buildRescheduleCascade(plan, schedule, logs, startKey, reason="Reschedule"){
  const items=planOrderItems(plan,schedule,logs);
  const startIndex=items.findIndex(i=>i.key===startKey);
  if(startIndex<0) return null;
  const startItem=items[startIndex];
  const occupiedDates=new Set();
  const climbDates=new Set();
  items.forEach((item,index)=>{
    if(index<startIndex || !isOpenScheduleItem(item)){
      occupiedDates.add(item.date);
      if(isClimbSession(item)) climbDates.add(item.date);
    }
  });
  const moved=[];
  for(let index=startIndex; index<items.length; index++){
    const item=items[index];
    if(!isOpenScheduleItem(item)) continue;
    const date=nextValidScheduleDate(schedule,item.date,item,occupiedDates,climbDates,index===startIndex);
    occupiedDates.add(date);
    if(isClimbSession(item)) climbDates.add(date);
    if(date!==item.date){
      moved.push({ key:item.key, week:item.week, session:item.session, fromDate:item.date, toDate:date, planDate:item.planDate });
    }
  }
  if(!moved.length) return null;
  const currentOverrides=schedule.sessionOverrides||{};
  const changes=moved.map(m=>({ key:m.key, previousDate:currentOverrides[m.key] || null, nextDate:m.toDate, planDate:m.planDate }));
  return { reason, startKey, startItem, moved, changes };
}
function applyCascadeToSchedule(schedule, cascade){
  if(!cascade?.changes?.length) return schedule;
  const overrides={...(schedule.sessionOverrides||{})};
  cascade.changes.forEach(change=>{
    if(change.nextDate && change.nextDate!==change.planDate) overrides[change.key]=change.nextDate;
    else delete overrides[change.key];
  });
  return {
    ...schedule,
    sessionOverrides:overrides,
    lastRescheduleUndo:{
      createdAt:nowIso(),
      reason:cascade.reason || "Reschedule",
      changes:cascade.changes.map(({key,previousDate})=>({key,previousDate:previousDate || null})),
    },
  };
}
function undoLastReschedule(schedule){
  const undo=schedule.lastRescheduleUndo;
  if(!undo?.changes?.length) return schedule;
  const overrides={...(schedule.sessionOverrides||{})};
  undo.changes.forEach(change=>{
    if(change.previousDate) overrides[change.key]=change.previousDate;
    else delete overrides[change.key];
  });
  return { ...schedule, sessionOverrides:overrides, lastRescheduleUndo:null };
}

function lastClimbDate(logs){
  let latest=null;
  Object.entries(logs).forEach(([k,v])=>{
    if(k.includes("climb") && v.date && (v.status==="Y"||v.status==="partial")){
      if(!latest||v.date>latest) latest=v.date;
    }
  });
  return latest;
}
function daysSince(d){ if(!d) return Infinity; return (Date.now()-new Date(d).getTime())/86400000; }

// How many times each routine is scheduled across a week's sessions = the week's target.
function weekRoutineTargets(wk){
  const t={};
  wk.sessions.forEach(s=>(s.routines||[]).forEach(r=>{ t[r]=(t[r]||0)+1; }));
  return t;
}
// How many of those scheduled routines were actually marked done, from the logs.
function weekRoutineDone(wk, weekNum, logs){
  const d={};
  wk.sessions.forEach(s=>{
    const l=logs[`${weekNum}-${s.id}`];
    if(l&&l.routinesDone) (s.routines||[]).forEach(r=>{ if(l.routinesDone.includes(r)) d[r]=(d[r]||0)+1; });
  });
  return d;
}

function loggedSessionItems(plan, logs){
  return plan.weeks.flatMap(w=>w.sessions.map(s=>{
    const key=logKey(w.week,s.id);
    const log=logs[key];
    return log ? { key, week:w.week, session:s, log } : null;
  }).filter(Boolean)).sort((a,b)=>(b.log.date||"").localeCompare(a.log.date||"") || b.week-a.week);
}

/* ============================ TIMER ============================ */
function Timer({ initial=60 }){
  const [sec,setSec]=useState(initial);
  const [run,setRun]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    if(run){ ref.current=setInterval(()=>setSec(s=>{
      if(s<=1){ clearInterval(ref.current); setRun(false); if(navigator.vibrate) navigator.vibrate(300); return 0; }
      return s-1;
    }),1000); }
    return ()=>clearInterval(ref.current);
  },[run]);
  const presets=[30,60,90,120,180];
  return (
    <div className="card" style={{padding:14}}>
      <div className="mono disp" style={{fontSize:46,textAlign:"center",color: sec===0?"var(--moss)":"var(--chalk)",lineHeight:1}}>{fmt(sec)}</div>
      <div style={{display:"flex",gap:8,justifyContent:"center",margin:"12px 0"}}>
        <button className="btn btn-rope" style={{padding:"8px 18px",display:"flex",alignItems:"center",gap:6}} onClick={()=>setRun(r=>!r)}>
          {run?<Pause size={16}/>:<Play size={16}/>}{run?"Pause":"Start"}
        </button>
        <button className="btn btn-ghost" style={{padding:"8px 14px"}} onClick={()=>{setRun(false);setSec(initial);}}><RotateCcw size={16}/></button>
      </div>
      <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
        {presets.map(p=>(
          <button key={p} className="btn btn-ghost mono" style={{padding:"4px 10px",fontSize:12}}
            onClick={()=>{setRun(false);setSec(p);}}>{p<60?`${p}s`:`${p/60}m`}</button>
        ))}
      </div>
    </div>
  );
}

/* ============================ RUNNER ============================ */
function Runner({ week, session, onClose, onSave, onDelete, spacingWarn, existingLog }){
  const sessionRoutines=session.routines||[];
  const steps=[];
  steps.push({kind:"warmup"});
  if(session.id!=="support") steps.push({kind:"climb"});
  sessionRoutines.forEach(r=>steps.push({kind:"routine",rkey:r}));
  steps.push({kind:"log"});
  const editing=!!existingLog;
  const [i,setI]=useState(existingLog ? steps.length-1 : 0);
  const [status,setStatus]=useState(existingLog?.status || "Y");
  const [rpe,setRpe]=useState(existingLog?.rpe || 6);
  const [pain,setPain]=useState(!!existingLog?.pain);
  const [notes,setNotes]=useState(existingLog?.notes || "");
  const [rd,setRd]=useState(existingLog?.routinesDone || sessionRoutines); // routines done
  const [volume,setVolume]=useState(existingLog?.volumeByGrade || {});
  const [attempts,setAttempts]=useState(existingLog?.attemptsByGrade || {});
  const [d,setD]=useState(null);
  const [confirmClear,setConfirmClear]=useState(false);
  const step=steps[i];
  const last=i===steps.length-1;
  const toggleR=(r)=>setRd(p=>p.includes(r)?p.filter(x=>x!==r):[...p,r]);

  const save=()=>{ onSave({status,rpe,pain,notes,routinesDone:rd,date:existingLog?.date || today(),amendedAt:existingLog?nowIso():existingLog?.amendedAt,volumeByGrade:volume,attemptsByGrade:attempts}); };
  const bumpVolume=(g,delta)=>setVolume(v=>({ ...v, [g]:Math.max(0,(+v[g]||0)+delta) }));
  const bumpAttempts=(g,delta)=>setAttempts(v=>({ ...v, [g]:Math.max(0,(+v[g]||0)+delta) }));

  return (
    <div className="ct-root" style={{position:"fixed",inset:0,zIndex:50,overflowY:"auto"}}>
      {d && <DrillSheetV2 name={d} onClose={()=>setD(null)}/>}
      <div style={{position:"relative",zIndex:1,maxWidth:520,margin:"0 auto",padding:"18px 16px 40px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <div className="pill" style={{background:"var(--surface2)",color:"var(--chalk-dim)",display:"inline-block"}}>Week {week} · {session.day}</div>
          </div>
          <button className="btn btn-ghost" style={{padding:8}} onClick={onClose}><X size={18}/></button>
        </div>
        {/* progress dots */}
        <div style={{display:"flex",gap:6,marginBottom:20}}>
          {steps.map((s,n)=>(<div key={n} style={{flex:1,height:4,borderRadius:4,background:n<=i?"var(--rope)":"var(--line)"}}/>))}
        </div>

        <div className="fadein" key={i}>
          {step.kind==="warmup" && (
            <div>
              <h2 className="disp" style={{fontSize:26,margin:"0 0 6px"}}>Warm-up gate</h2>
              <p style={{color:"var(--chalk-dim)",marginTop:0,lineHeight:1.55}}>
                15–20 minutes before anything loads: shoulder circles, reach-and-roll, Egyptians, then easy traversing.
                This isn't optional padding — it's the gate that keeps your shoulders and fingers healthy at 40.
              </p>
              {spacingWarn && (
                <div className="card fadein" style={{padding:12,borderColor:"var(--deload)",marginBottom:14,display:"flex",gap:10}}>
                  <AlertTriangle size={18} style={{color:"var(--deload)",flexShrink:0,marginTop:2}}/>
                  <div style={{fontSize:14,color:"var(--chalk-dim)"}}>Less than 48h since your last hard climbing day. Fingers and pulleys adapt slowly — keep it light today, or rest.</div>
                </div>
              )}
              <Timer initial={900}/>
            </div>
          )}
          {step.kind==="climb" && (
            <div>
              <h2 className="disp" style={{fontSize:24,margin:"0 0 8px"}}>{session.focus}</h2>
              {session.note && <p style={{color:"var(--chalk-dim)",marginTop:0}}>{session.note}</p>}
              {session.drills && session.drills.length>0 && (
                <div className="stagger" style={{display:"flex",flexDirection:"column",gap:10,marginTop:16}}>
                  <div className="pill" style={{color:"var(--rope)",background:"transparent",padding:0,letterSpacing:".1em"}}>Drills to apply while climbing · tap for detail</div>
                  {session.drills.map(dn=>{ const e=exByName(dn); if(!e) return null; const det=guideFor(e);
                    return (
                      <button key={dn} onClick={()=>setD(dn)} className="card" style={{padding:14,textAlign:"left",cursor:"pointer",background:"var(--surface)",color:"var(--chalk)"}}>
                        <div style={{marginBottom:10}}><MovementDemo id={det.demoId} compact label={e.n}/></div>
                        <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                          <strong className="disp" style={{fontSize:16}}>{e.n}</strong>
                          <span className="mono" style={{fontSize:11,color:"var(--faint)",whiteSpace:"nowrap"}}>{e.d}</span>
                        </div>
                        <p style={{margin:"6px 0 0",fontSize:14,color:"var(--chalk-dim)",lineHeight:1.5}}>{det.summary}</p>
                        <span style={{fontSize:12,color:"var(--rope)",marginTop:6,display:"inline-block"}}>How &amp; cues</span>
                      </button>
                    );})}
                </div>
              )}
            </div>
          )}
          {step.kind==="routine" && (()=>{ const r=ROUTINES[step.rkey]; const cat=r.cat; const done=rd.includes(step.rkey);
            return (
            <div>
              <h2 className="disp" style={{fontSize:24,margin:"0 0 4px",display:"flex",alignItems:"center",gap:8}}>
                {React.createElement(CAT_ICON[cat]||Activity,{size:22,style:{color:"var(--rope)"}})}{r.label}
              </h2>
              <p style={{margin:"0 0 12px",fontSize:13,color:"var(--faint)"}}>Part of today's session — tap a card for the full how-to.</p>
              <div className="stagger" style={{display:"flex",flexDirection:"column",gap:10}}>
                {EX.filter(e=>e.c===cat && (!e.g || e.g<=week)).map(e=>{ const det=guideFor(e);
                  return (
                  <button key={e.n} onClick={()=>setD(e.n)} className="card" style={{padding:14,textAlign:"left",cursor:"pointer",background:"var(--surface)",color:"var(--chalk)"}}>
                    <div style={{marginBottom:10}}><MovementDemo id={det.demoId} compact label={e.n}/></div>
                    <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                      <strong className="disp" style={{fontSize:16}}>{e.n}</strong>
                      <span className="mono" style={{fontSize:11,color:"var(--faint)",whiteSpace:"nowrap"}}>{e.d}</span>
                    </div>
                    <p style={{margin:"6px 0 0",fontSize:14,color:"var(--chalk-dim)",lineHeight:1.5}}>{det.summary}</p>
                  </button>
                );})}
              </div>
              <div style={{marginTop:14}}><Timer initial={60}/></div>
              <button className="btn" style={{width:"100%",padding:12,marginTop:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                background:done?"var(--moss)":"var(--surface)",color:done?"#1a120c":"var(--chalk)",border:`1px solid ${done?"var(--moss)":"var(--line)"}`}}
                onClick={()=>toggleR(step.rkey)}>
                <Check size={16}/>{done?`${r.label} done`:`Mark ${r.label} done`}
              </button>
            </div>
          );})()}
          {step.kind==="log" && (
            <div>
              <h2 className="disp" style={{fontSize:26,margin:"0 0 14px"}}>{editing?"Amend log":"Log it"}</h2>
              {editing && (
                <div className="card" style={{padding:12,marginBottom:16,background:"var(--granite)",fontSize:13,color:"var(--chalk-dim)",lineHeight:1.45}}>
                  Updating this keeps the original session date{existingLog?.date?` (${fmtFullDate(existingLog.date)})`:""} and refreshes the saved details.
                </div>
              )}
              <div style={{marginBottom:16}}>
                <div className="pill" style={{color:"var(--chalk-dim)",background:"transparent",padding:0,marginBottom:8}}>Done?</div>
                <div style={{display:"flex",gap:8}}>
                  {[["Y","Done"],["partial","Partial"],["skip","Skipped"]].map(([v,l])=>(
                    <button key={v} className="btn" style={{flex:1,padding:"10px",background:status===v?"var(--rope)":"var(--surface)",color:status===v?"#1a120c":"var(--chalk)",border:"1px solid var(--line)"}} onClick={()=>setStatus(v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span className="pill" style={{color:"var(--chalk-dim)",background:"transparent",padding:0}}>Effort (RPE)</span>
                  <span className="mono disp" style={{fontSize:18,color:"var(--rope)"}}>{rpe}</span>
                </div>
                <input type="range" min="1" max="10" value={rpe} onChange={e=>setRpe(+e.target.value)} style={{width:"100%"}}/>
              </div>
              {sessionRoutines.length>0 && (
                <div style={{marginBottom:16}}>
                  <div className="pill" style={{color:"var(--chalk-dim)",background:"transparent",padding:0,marginBottom:8}}>Routines done today</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {sessionRoutines.map(r=>{ const on=rd.includes(r);
                      return (
                        <button key={r} onClick={()=>toggleR(r)} className="pill" style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",border:`1px solid ${on?"var(--moss)":"var(--line)"}`,background:on?"var(--moss)":"transparent",color:on?"#1a120c":"var(--chalk-dim)"}}>
                          {on?<Check size={13}/>:<X size={13}/>}{ROUTINES[r].label}
                        </button>
                      );})}
                  </div>
                </div>
              )}
              {session.id!=="support" && (
                <div className="card" style={{padding:12,marginBottom:16,background:"var(--granite)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
                    <div className="pill" style={{color:"var(--chalk-dim)",background:"transparent",padding:0}}>Problems sent by grade</div>
                    <div style={{fontSize:11,color:"var(--faint)"}}>feeds pyramid</div>
                  </div>
                  {[0,1,2,3,4,5].map(g=>(
                    <div key={g} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <button onClick={()=>bumpVolume(g,-1)} style={{width:28,height:28,borderRadius:7,border:"1px solid var(--line)",background:"transparent",color:"var(--faint)",cursor:"pointer",fontSize:17,lineHeight:1}}>–</button>
                      <div className="disp mono" style={{width:36,textAlign:"center",fontSize:13,color:"var(--chalk-dim)"}}>V{g}</div>
                      <div style={{flex:1,height:8,background:"var(--surface2)",borderRadius:8,overflow:"hidden"}}>
                        <div style={{width:`${Math.min(100,(+volume[g]||0)*12)}%`,height:"100%",background:"var(--rope)",borderRadius:8}}/>
                      </div>
                      <div className="mono" style={{width:24,textAlign:"right",fontSize:13,color:"var(--chalk)"}}>{+volume[g]||0}</div>
                      <button onClick={()=>bumpVolume(g,1)} style={{width:28,height:28,borderRadius:7,border:"1px solid var(--rope)",background:"transparent",color:"var(--rope)",cursor:"pointer",fontSize:17,lineHeight:1}}>+</button>
                    </div>
                  ))}
                </div>
              )}
              {session.id!=="support" && (
                <div className="card" style={{padding:12,marginBottom:16,background:"var(--granite)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
                    <div className="pill" style={{color:"var(--chalk-dim)",background:"transparent",padding:0}}>Attempts / projects</div>
                    <div style={{fontSize:11,color:"var(--faint)"}}>separate calendar marker</div>
                  </div>
                  {[0,1,2,3,4,5].map(g=>(
                    <div key={g} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <button onClick={()=>bumpAttempts(g,-1)} style={{width:28,height:28,borderRadius:7,border:"1px solid var(--line)",background:"transparent",color:"var(--faint)",cursor:"pointer",fontSize:17,lineHeight:1}}>–</button>
                      <div className="disp mono" style={{width:36,textAlign:"center",fontSize:13,color:"var(--chalk-dim)"}}>V{g}</div>
                      <div style={{flex:1,height:8,background:"var(--surface2)",borderRadius:8,overflow:"hidden"}}>
                        <div style={{width:`${Math.min(100,(+attempts[g]||0)*12)}%`,height:"100%",background:"var(--test)",borderRadius:8}}/>
                      </div>
                      <div className="mono" style={{width:24,textAlign:"right",fontSize:13,color:"var(--chalk)"}}>{+attempts[g]||0}</div>
                      <button onClick={()=>bumpAttempts(g,1)} style={{width:28,height:28,borderRadius:7,border:"1px solid var(--test)",background:"transparent",color:"var(--test)",cursor:"pointer",fontSize:17,lineHeight:1}}>+</button>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn" style={{width:"100%",padding:"12px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                background:pain?"var(--rope-soft)":"var(--surface)",color:"var(--chalk)",border:`1px solid ${pain?"var(--rope)":"var(--line)"}`}}
                onClick={()=>setPain(p=>!p)}>
                <AlertTriangle size={16}/>{pain?"Pain flagged — log it below":"Flag pain / niggle"}
              </button>
              {pain && (
                <div className="card fadein" style={{padding:12,borderColor:"var(--deload)",marginBottom:16,fontSize:14,color:"var(--chalk-dim)",lineHeight:1.5}}>
                  Pain is information, not something to push through. Back off that movement and let it settle before loading it again.
                </div>
              )}
              <textarea className="tinput" rows={3} placeholder="Notes — a tweak, a breakthrough, how feet felt…" value={notes} onChange={e=>setNotes(e.target.value)} style={{marginBottom:16}}/>
              <button className="btn btn-rope" style={{width:"100%",padding:14,fontSize:16}} onClick={save}>{editing?"Update session log":"Save session"}</button>
              {editing && onDelete && (
                <div style={{marginTop:18,paddingTop:16,borderTop:"1px solid var(--line)"}}>
                  {!confirmClear ? (
                    <button className="btn btn-ghost" style={{width:"100%",padding:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:"var(--deload)",borderColor:"var(--line)"}}
                      onClick={()=>setConfirmClear(true)}>
                      <Trash2 size={15}/>Clear this session's progress
                    </button>
                  ) : (
                    <div className="card fadein" style={{padding:14,borderColor:"var(--deload)"}}>
                      <div style={{fontSize:14,color:"var(--chalk-dim)",lineHeight:1.5,marginBottom:12}}>
                        This permanently deletes the log for {session.day}{existingLog?.date?` (${fmtFullDate(existingLog.date)})`:""} — status, effort, sends and notes. This can't be undone.
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn btn-ghost" style={{flex:1,padding:11}} onClick={()=>setConfirmClear(false)}>Keep it</button>
                        <button className="btn" style={{flex:1,padding:11,background:"var(--deload)",color:"#1a120c",border:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={onDelete}>
                          <Trash2 size={15}/>Delete log
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {!last && (
          <div style={{display:"flex",gap:10,marginTop:24}}>
            {i>0 && <button className="btn btn-ghost" style={{padding:"12px 16px"}} onClick={()=>setI(i-1)}><ChevronLeft size={18}/></button>}
            <button className="btn btn-rope" style={{flex:1,padding:14,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>setI(i+1)}>
              {step.kind==="warmup"?"Warmed up — continue":"Next"} <ChevronRight size={18}/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================ CALENDAR ============================ */
function CalendarView({ plan, schedule, setSchedule, logs, onOpenSession }){
  const items=scheduleItems(plan,schedule,logs);
  // Start the calendar on the month that has the most relevant content:
  // upcoming open session → current week's first session → today
  const _initialDate=(() => {
    const t=today();
    const upcoming=items.find(i=>i.date>=t && isOpenLog(i.log));
    if(upcoming) return upcoming.date;
    const last=items.filter(i=>i.date<=t).at(-1);
    return last?.date || t;
  })();
  const [selected,setSelected]=useState(_initialDate);
  const [viewMonth,setViewMonth]=useState(monthStart(_initialDate));
  const [showBlockForm,setShowBlockForm]=useState(false);
  const [editingBlock,setEditingBlock]=useState(null);
  const [blockForm,setBlockForm]=useState({label:"",startDate:today(),endDate:today(),notes:""});
  const [shiftDraft,setShiftDraft]=useState({});
  const monthItems=items.filter(i=>monthKey(i.date)===monthKey(viewMonth));
  const monthEffortByDate=monthItems.reduce((acc,i)=>{
    const effort=itemEffort(i).value;
    const cell=acc[i.date]||(acc[i.date]={total:0,support:0,climb:0});
    cell.total+=effort;
    if(i.session?.id==="support") cell.support+=effort; else cell.climb+=effort;
    return acc;
  },{});
  const maxEffort=28; // fixed plan-wide ceiling: planned max is 22, logged peak ~28
  const selectedItems=items.filter(i=>i.date===selected);
  const selectedBlocks=travelBlocksOnDate(schedule,selected);
  const upcomingOpen=items.filter(i=>i.date>=selected && isOpenLog(i.log)).slice(0,3);
  const first=new Date(`${viewMonth}T12:00:00`);
  const gridStart=addDays(viewMonth,-first.getDay());
  const days=Array.from({length:42},(_,i)=>addDays(gridStart,i));

  const shiftSession=(key,date)=>{
    setSchedule(s=>({...s,sessionOverrides:{...(s.sessionOverrides||{}),[key]:date},lastRescheduleUndo:null}));
  };
  const resetSession=(key)=>{
    setSchedule(s=>{
      const next={...(s.sessionOverrides||{})};
      delete next[key];
      return {...s,sessionOverrides:next,lastRescheduleUndo:null};
    });
  };
  const applyCascade=(cascade)=>{
    setSchedule(s=>applyCascadeToSchedule(s,cascade));
  };
  const undoCascade=()=>{
    setSchedule(s=>undoLastReschedule(s));
  };
  const editBlock=(block,index)=>{
    setEditingBlock(index);
    setShowBlockForm(true);
    setBlockForm({ label:block.label||"", startDate:block.startDate||selected, endDate:block.endDate||block.startDate||selected, notes:block.notes||"" });
  };
  const newBlock=()=>{
    setShowBlockForm(true);
    setEditingBlock(null);
    setBlockForm({label:"",startDate:selected,endDate:selected,notes:""});
  };
  const closeBlockForm=()=>{
    setShowBlockForm(false);
    setEditingBlock(null);
    setBlockForm({label:"",startDate:selected,endDate:selected,notes:""});
  };
  const saveBlock=()=>{
    const start=blockForm.startDate || selected;
    const end=blockForm.endDate || start;
    const block={label:blockForm.label||"Blocker",startDate:start,endDate:end<start?start:end,notes:blockForm.notes||""};
    setSchedule(s=>{
      const blocks=[...(s.travelBlocks||[])];
      if(editingBlock==null) blocks.push(block);
      else blocks[editingBlock]=block;
      return {...s,travelBlocks:blocks,lastRescheduleUndo:null};
    });
    closeBlockForm();
  };
  const deleteBlock=(index)=>{
    setSchedule(s=>({...s,travelBlocks:(s.travelBlocks||[]).filter((_,i)=>i!==index),lastRescheduleUndo:null}));
    closeBlockForm();
  };
  const monthLabel=new Date(`${viewMonth}T12:00:00`).toLocaleDateString(undefined,{month:"long",year:"numeric"});
  const fmtDay=(date)=>parseLocalDate(date).toLocaleDateString(undefined,{month:"short",day:"numeric"});

  return (
    <div className="stagger">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:12}}>
        <div>
          <h2 className="disp" style={{fontSize:22,margin:"0 0 3px"}}>Calendar</h2>
          <div style={{fontSize:12,color:"var(--faint)"}}>Workouts, blockers, effort, and projecting at a glance.</div>
        </div>
        <button className="btn btn-rope" style={{padding:"8px 11px",display:"flex",alignItems:"center",gap:6}} onClick={newBlock}><Plus size={15}/>Blocker</button>
      </div>

      <div className="card" style={{padding:14,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:12}}>
          <button className="btn btn-ghost" style={{padding:8}} onClick={()=>setViewMonth(monthStart(addDays(viewMonth,-1)))}><ChevronLeft size={17}/></button>
          <button className="btn btn-ghost" style={{padding:"8px 12px"}} onClick={()=>{setSelected(today());setViewMonth(monthStart(today()));}}>{monthLabel}</button>
          <button className="btn btn-ghost" style={{padding:8}} onClick={()=>setViewMonth(monthStart(addDays(viewMonth,32)))}><ChevronRight size={17}/></button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5,marginBottom:6}}>
          {WEEKDAYS.map(d=><div key={d} className="disp" style={{fontSize:10,color:"var(--faint)",textAlign:"center"}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>
          {days.map(date=>{
            const dayItems=items.filter(i=>i.date===date);
            const blocks=travelBlocksOnDate(schedule,date);
            const conflicts=dayItems.some(i=>i.travel && isOpenLog(i.log));
            const attempts=dayItems.reduce((sum,i)=>sum+attemptStats(i.log).count,0);
            const cell=monthEffortByDate[date]||{total:0,support:0,climb:0};
            const effort=cell.total;
            const effortPct=Math.min(1,effort/maxEffort);
            const isSupportDay=effort>0 && cell.support>cell.climb;
            const hueRgb=isSupportDay?"102,153,179":"212,103,58";
            const topAlpha=effort>0?0.07+Math.pow(effortPct,1.8)*0.88:0;
            const inMonth=monthKey(date)===monthKey(viewMonth);
            const selectedDay=date===selected;
            return (
              <button key={date} onClick={()=>setSelected(date)} style={{minHeight:82,padding:6,textAlign:"left",borderRadius:8,cursor:"pointer",
                border:`1px solid ${selectedDay?"var(--rope)":conflicts?"var(--deload)":effort>0?`rgba(${hueRgb},${0.3+effortPct*0.45})`:"var(--line)"}`,
                background:`linear-gradient(155deg, rgba(${hueRgb},${topAlpha}) 0%, rgba(${hueRgb},${topAlpha*0.4}) 55%, rgba(42,34,24,.96) 100%)`,
                opacity:inMonth?1:.42,color:"var(--chalk)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span className="mono" style={{fontSize:11,color:date===today()?"var(--rope)":"var(--chalk-dim)"}}>{date.slice(-2)}</span>
                  {attempts>0 && <span className="mono" style={{fontSize:9,color:"var(--test)"}}>P{attempts}</span>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  {blocks.length>0 && <span style={{height:5,borderRadius:5,background:"var(--deload)"}}/>}
                  {dayItems.slice(0,3).map(i=>{
                    const isSup=i.session.id==="support";
                    const done=i.log&&i.log.status!=="skip";
                    return (
                      <span key={i.key} style={{height:4,borderRadius:4,background:isSup?"var(--test)":done?"var(--moss)":"var(--chalk-dim)",opacity:done?1:0.45}}/>
                    );
                  })}
                  {dayItems.length>3 && <span className="mono" style={{fontSize:9,color:"var(--faint)"}}>+{dayItems.length-3}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card" style={{padding:14,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8,marginBottom:10}}>
          <div className="disp" style={{fontSize:16,color:"var(--rope)"}}>{fmtFullDate(selected)}</div>
          <div className="mono" style={{fontSize:11,color:"var(--faint)"}}>Agenda</div>
        </div>
        {schedule.lastRescheduleUndo?.changes?.length>0 && (
          <div style={{border:"1px solid var(--rope-soft)",borderRadius:10,padding:10,background:"var(--granite)",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <div>
              <div className="disp" style={{fontSize:13,color:"var(--rope)"}}>{schedule.lastRescheduleUndo.reason || "Reschedule"} applied</div>
              <div style={{fontSize:12,color:"var(--chalk-dim)",marginTop:2}}>{schedule.lastRescheduleUndo.changes.length} workout{schedule.lastRescheduleUndo.changes.length===1?"":"s"} moved.</div>
            </div>
            <button className="btn btn-ghost" style={{padding:"7px 10px",fontSize:12,whiteSpace:"nowrap"}} onClick={undoCascade}>Undo reschedule</button>
          </div>
        )}

        {selectedBlocks.length>0 && (
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
            {selectedBlocks.map(block=>{
              const index=(schedule.travelBlocks||[]).indexOf(block);
              return (
                <div key={`${block.startDate}-${block.endDate}-${index}`} style={{border:"1px solid var(--deload)",borderRadius:10,padding:10,background:"var(--granite)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                    <strong className="disp" style={{fontSize:14,color:"var(--deload)"}}>{block.label||"Blocker"}</strong>
                    <div style={{display:"flex",gap:5}}>
                      <button className="btn btn-ghost" style={{padding:"4px 7px"}} onClick={()=>editBlock(block,index)}><Pencil size={13}/></button>
                      <button className="btn btn-ghost" style={{padding:"4px 7px"}} onClick={()=>deleteBlock(index)}><Trash2 size={13}/></button>
                    </div>
                  </div>
                  <div className="mono" style={{fontSize:11,color:"var(--faint)",marginTop:3}}>{fmtFullDate(block.startDate)} to {fmtFullDate(block.endDate)}</div>
                  {block.notes && <div style={{fontSize:12,color:"var(--chalk-dim)",marginTop:6}}>{block.notes}</div>}
                </div>
              );
            })}
          </div>
        )}

        {showBlockForm && (
          <div style={{border:"1px solid var(--line)",borderRadius:10,padding:10,marginBottom:12,background:"var(--granite)"}}>
            <div className="disp" style={{fontSize:13,color:"var(--rope)",marginBottom:8}}>{editingBlock==null?"Add blocker":"Edit blocker"}</div>
            <Field label="Label"><input className="tinput" value={blockForm.label} onChange={e=>setBlockForm(f=>({...f,label:e.target.value}))} placeholder="Vacation, work trip, recovery week"/></Field>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>
              <Field label="Start"><input className="tinput" type="date" value={blockForm.startDate} onChange={e=>setBlockForm(f=>({...f,startDate:e.target.value}))}/></Field>
              <Field label="End"><input className="tinput" type="date" value={blockForm.endDate} onChange={e=>setBlockForm(f=>({...f,endDate:e.target.value}))}/></Field>
            </div>
            <Field label="Notes"><input className="tinput" value={blockForm.notes} onChange={e=>setBlockForm(f=>({...f,notes:e.target.value}))} placeholder="Optional"/></Field>
            <div style={{display:"flex",gap:8,marginTop:9}}>
              <button className="btn btn-rope" style={{flex:1,padding:10}} onClick={saveBlock}>Save blocker</button>
              <button className="btn btn-ghost" style={{padding:"10px 12px"}} onClick={closeBlockForm}>Cancel</button>
            </div>
          </div>
        )}

        {selectedItems.length===0 && selectedBlocks.length===0 && (
          <div style={{fontSize:13,color:"var(--chalk-dim)",lineHeight:1.5,marginBottom:10}}>No workouts or blockers here.</div>
        )}
        {selectedItems.map(i=>{
          const effort=itemEffort(i);
          const stats=attemptStats(i.log);
          const candidates=nextUnblockedDates(schedule,i.date,3);
          const open=isOpenLog(i.log);
          const cascade=i.travel && open ? buildRescheduleCascade(plan,schedule,logs,i.key,`${i.travel.label||"Blocker"} reschedule`) : null;
          const surface=workoutSurfaceStyle(i);
          return (
            <div key={i.key} style={{...surface,border:`1px solid ${i.travel&&open?"var(--deload)":"var(--line)"}`,borderRadius:10,padding:12,marginTop:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div style={{flex:1}}>
                  <div className="disp" style={{fontSize:14}}>{`W${i.week} ${sessionTitle(i.session)}`}</div>
                  <div style={{fontSize:12,color:"var(--chalk-dim)",lineHeight:1.45,marginTop:3}}>{i.session.focus}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                    <span className="pill" style={{background:"var(--surface2)",color:effort.logged?"var(--moss)":"var(--chalk-dim)"}}>{effort.logged?"Logged":"Est"} effort {Math.round(effort.value)}</span>
                    {stats.count>0 && <span className="pill" style={{background:"var(--surface2)",color:"var(--test)"}}>Projecting {stats.count} · max V{stats.hardest}</span>}
                    {i.shifted && <span className="pill" style={{background:"var(--surface2)",color:"var(--rope)"}}>Shifted from {fmtFullDate(i.planDate)}</span>}
                  </div>
                </div>
                <button className="btn btn-rope" style={{padding:"8px 11px",display:"flex",alignItems:"center",gap:5}} onClick={()=>onOpenSession(i)}>{i.log?"Edit":"Start"}</button>
              </div>
              {i.travel && open && (
                <div style={{marginTop:10,border:"1px solid var(--deload)",borderRadius:10,padding:10,background:"var(--granite)"}}>
                  <div style={{fontSize:12,color:"var(--deload)",marginBottom:8}}>{i.travel.label||"Blocker"} overlaps this workout. Cascade it forward or fine-tune manually.</div>
                  {cascade && (
                    <div style={{border:"1px solid var(--line)",borderRadius:9,padding:9,marginBottom:8,background:"var(--surface)"}}>
                      <div style={{fontSize:12,color:"var(--chalk-dim)",lineHeight:1.4,marginBottom:7}}>
                        Move {cascade.moved.length} workout{cascade.moved.length===1?"":"s"}: {cascade.moved.slice(0,3).map(m=>`W${m.week} ${sessionTitle(m.session)} to ${fmtDay(m.toDate)}`).join(", ")}{cascade.moved.length>3?"...":""}
                      </div>
                      <button className="btn btn-rope" style={{padding:"7px 10px",fontSize:12}} onClick={()=>applyCascade(cascade)}>Apply cascade</button>
                    </div>
                  )}
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {candidates.map(d=>(
                      <button key={d} className="btn btn-ghost" style={{padding:"6px 9px",display:"flex",alignItems:"center",gap:5,fontSize:12}} onClick={()=>shiftSession(i.key,d)}><MoveRight size={13}/>{fmtDay(d)}</button>
                    ))}
                    <input className="tinput" type="date" value={shiftDraft[i.key]||""} onChange={e=>setShiftDraft(p=>({...p,[i.key]:e.target.value}))} style={{width:138,padding:"5px 7px",fontSize:12}}/>
                    <button className="btn btn-ghost" style={{padding:"6px 9px",fontSize:12}} onClick={()=>shiftDraft[i.key]&&shiftSession(i.key,shiftDraft[i.key])}>Custom</button>
                  </div>
                </div>
              )}
              {i.shifted && (
                <button className="btn btn-ghost" style={{marginTop:8,padding:"6px 9px",fontSize:12}} onClick={()=>resetSession(i.key)}>Reset to plan date</button>
              )}
            </div>
          );
        })}

        {upcomingOpen.length>0 && (
          <div style={{borderTop:"1px solid var(--line)",paddingTop:12,marginTop:4}}>
            <div className="disp" style={{fontSize:13,color:"var(--rope)",marginBottom:7}}>Upcoming open workouts</div>
            {upcomingOpen.map(i=>(
              <button key={i.key} onClick={()=>setSelected(i.date)} style={{width:"100%",background:"none",border:"none",padding:"5px 0",display:"flex",justifyContent:"space-between",cursor:"pointer",color:"var(--chalk-dim)",fontSize:12}}>
                <span>{`W${i.week} ${sessionTitle(i.session)}`}</span><span className="mono">{fmtFullDate(i.date)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================ AUTH ============================ */
function AuthScreen({ email, setEmail, password, setPassword, message, onSubmit }){
  return (
    <div className="ct-root" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
      <style>{STYLE}</style>
      <div className="card fadein" style={{position:"relative",zIndex:1,width:"100%",maxWidth:420,padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <div style={{width:38,height:38,borderRadius:10,background:"var(--rope)",display:"flex",alignItems:"center",justifyContent:"center"}}><Mountain size={22} color="#1a120c"/></div>
          <div>
            <div className="disp" style={{fontSize:24,fontWeight:800,lineHeight:1}}>Ascent</div>
            <div style={{fontSize:12,color:"var(--faint)"}}>Private synced trainer</div>
          </div>
        </div>

        {!isCloudConfigured && (
          <div className="card" style={{padding:12,borderColor:"var(--deload)",marginBottom:14,color:"var(--chalk-dim)",fontSize:13,lineHeight:1.45}}>
            Supabase is not configured yet. Add <span className="mono">VITE_SUPABASE_URL</span> and <span className="mono">VITE_SUPABASE_ANON_KEY</span> to enable phone sync.
          </div>
        )}

        <form onSubmit={onSubmit}>
          <Field label="Email">
            <input className="tinput" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          </Field>
          <Field label="Password">
            <input className="tinput" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/>
          </Field>
          <button className="btn btn-rope" type="submit" disabled={!isCloudConfigured} style={{width:"100%",padding:13,marginTop:12,fontSize:16,opacity:isCloudConfigured?1:.55}}>
            Sign in
          </button>
        </form>

        <div style={{fontSize:12,color:"var(--faint)",lineHeight:1.45,marginTop:12}}>
          Create or invite the account in Supabase first, then sign in here.
        </div>
        {message && <div style={{marginTop:12,fontSize:13,color:message.type==="error"?"var(--rope)":"var(--moss)",lineHeight:1.4}}>{message.text}</div>}
      </div>
    </div>
  );
}

/* ============================ CYCLE LOGIC ============================ */
function isPlanComplete(planWeeks, logs){
  if(!planWeeks||!planWeeks.length) return false;
  const last=planWeeks[planWeeks.length-1];
  return last.sessions.every(s=>{
    const l=logs[logKey(last.week,s.id)];
    return l&&(l.status==="Y"||l.status==="partial");
  });
}
function computeCycleSummary(planWeeks, logs, metrics){
  const scheduled=planWeeks.reduce((n,w)=>n+w.sessions.length,0);
  const done=Object.values(logs).filter(l=>l.status==="Y"||l.status==="partial").length;
  const pu=metrics.filter(m=>m.pullups!=null);
  const fl=metrics.filter(m=>m.flash!=null);
  return {
    totalSessionsDone:done, totalSessionsScheduled:scheduled,
    adherencePct:scheduled>0?Math.round((done/scheduled)*100):0,
    pullupStart:pu[0]?.pullups??null, pullupEnd:pu[pu.length-1]?.pullups??null,
    flashStart:fl[0]?.flash??null, flashEnd:fl[fl.length-1]?.flash??null,
    projectEnd:[...metrics].reverse().find(m=>m.project!=null)?.project??null,
    painSessions:Object.values(logs).filter(l=>l.pain).length,
  };
}
function archiveActiveCycle(appData, chosenTemplateId, newStartDate){
  const ac=appData.activeCycle;
  const summary=computeCycleSummary(ac.plan.weeks,ac.logs,ac.metrics);
  const archived={ ...ac, completedAt:nowIso(), summary };
  const tpl=PLAN_TEMPLATES[chosenTemplateId];
  const newCycle={
    cycleId:`cycle_${Date.now()}`,
    cycleNumber:(appData.completedCycles.length||0)+2,
    planTemplateId:chosenTemplateId,
    plan:tpl.plan,
    logs:{}, metrics:[],
    schedule:{ ...ac.schedule, startDate:newStartDate, travelBlocks:[], sessionOverrides:{} },
    startedAt:new Date(`${newStartDate}T12:00:00`).toISOString(),
    completedAt:null,
  };
  return { ...appData, activeCycle:newCycle, completedCycles:[...appData.completedCycles,archived] };
}

/* ============================ STAT BOX ============================ */
function StatBox({ label, value, sub }){
  return (
    <div style={{background:"var(--granite)",borderRadius:12,padding:"12px 14px"}}>
      <div className="disp" style={{fontSize:22,fontWeight:800,lineHeight:1,marginBottom:4}}>{value}</div>
      <div style={{fontSize:11,color:"var(--rope)",letterSpacing:".04em",textTransform:"uppercase",marginBottom:3}}>{label}</div>
      {sub&&<div style={{fontSize:11,color:"var(--faint)"}}>{sub}</div>}
    </div>
  );
}

/* ============================ CHECKPOINT PROMPT ============================ */
function CheckpointPrompt({ week, onSave, onDismiss }){
  const [pullups,setPullups]=useState("");
  const [flash,setFlash]=useState("");
  const accent=week.type==="test"?"var(--test)":"var(--deload)";
  return (
    <div className="card fadein" style={{padding:15,marginBottom:14,borderColor:accent}}>
      <div className="disp" style={{fontSize:14,color:accent,marginBottom:6}}>
        End of Block — Week {week.week} {week.type==="test"?"test":"deload"} complete
      </div>
      <p style={{fontSize:13,color:"var(--chalk-dim)",margin:"0 0 12px",lineHeight:1.5}}>
        Log your checkpoint metrics now to track progress across the plan.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <Field label="Max pull-ups">
          <input className="tinput" type="number" min={0} max={60} placeholder="—" value={pullups}
            onChange={e=>setPullups(e.target.value)}/>
        </Field>
        <Field label="Flash grade">
          <select className="tinput" value={flash} onChange={e=>setFlash(e.target.value)}>
            <option value="">—</option>
            {[0,1,2,3,4,5].map(v=><option key={v} value={v}>V{v}</option>)}
          </select>
        </Field>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn btn-rope" style={{flex:1,padding:10}} onClick={()=>{
          onSave({ week:week.week, date:today(), pullups:pullups?+pullups:null, flash:flash!==""?+flash:null, project:null, sleep:null, pain:"" });
          onDismiss();
        }}>Save checkpoint</button>
        <button className="btn btn-ghost" style={{padding:10}} onClick={onDismiss}>Skip</button>
      </div>
    </div>
  );
}

/* ============================ PLAN COMPLETION MODAL ============================ */
const LEVEL_COLOR={ beginner:"var(--moss)", intermediate:"var(--rope)", advanced:"var(--deload)" };

function PlanCompletionModal({ plan, logs, metrics, schedule, completedCycles, onStart, onClose }){
  const [stage,setStage]=useState("celebration");
  const [selectedTpl,setSelectedTpl]=useState(null);
  const [startDate,setStartDate]=useState(today());
  const summary=computeCycleSummary(plan.weeks,logs,metrics);
  const lastFlash=[...metrics].reverse().find(m=>m.flash!=null)?.flash??null;
  const lastPullups=[...metrics].reverse().find(m=>m.pullups!=null)?.pullups??null;

  return (
    <div className="ct-root" style={{position:"fixed",inset:0,zIndex:75,overflowY:"auto"}}>
      <style>{STYLE}</style>
      <div style={{position:"relative",zIndex:1,maxWidth:560,margin:"0 auto",padding:"20px 16px 80px"}}>

        {stage==="celebration" && (
          <div className="fadein stagger">
            <div style={{textAlign:"center",marginBottom:28,paddingTop:20}}>
              <div style={{width:64,height:64,borderRadius:18,background:"var(--rope)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
                <Award size={36} color="#1a120c"/>
              </div>
              <h1 className="disp" style={{fontSize:28,fontWeight:800,margin:"0 0 6px"}}>Plan complete!</h1>
              <div style={{color:"var(--chalk-dim)",fontSize:15}}>{plan.name}</div>
            </div>
            <div className="card" style={{padding:16,marginBottom:16}}>
              <div className="disp" style={{fontSize:12,color:"var(--rope)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:12}}>Your results</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <StatBox label="Sessions done" value={`${summary.totalSessionsDone}/${summary.totalSessionsScheduled}`} sub={`${summary.adherencePct}% adherence`}/>
                <StatBox label="Pull-up change"
                  value={summary.pullupStart!=null&&summary.pullupEnd!=null?`${summary.pullupEnd>=summary.pullupStart?"+":""}${summary.pullupEnd-summary.pullupStart}`:"—"}
                  sub={summary.pullupStart!=null?`${summary.pullupStart} → ${summary.pullupEnd??summary.pullupStart}`:"Not logged"}/>
                <StatBox label="Flash grade"
                  value={summary.flashEnd!=null?`V${summary.flashEnd}`:"—"}
                  sub={summary.flashStart!=null&&summary.flashEnd!=null&&summary.flashStart!==summary.flashEnd?`Was V${summary.flashStart}`:summary.flashStart!=null?`Started V${summary.flashStart}`:"Not logged"}/>
                <StatBox label="Pain sessions" value={summary.painSessions} sub={summary.painSessions===0?"Pain-free run!":"Sessions flagged"}/>
              </div>
            </div>
            <button className="btn btn-rope" style={{width:"100%",padding:14,fontSize:16,marginBottom:10}} onClick={()=>setStage("picking-plan")}>
              Choose your next plan
            </button>
            <button className="btn btn-ghost" style={{width:"100%",padding:12}} onClick={()=>{setSelectedTpl("foundation-12wk");setStage("confirming");}}>
              Restart this plan
            </button>
          </div>
        )}

        {stage==="picking-plan" && (
          <div className="fadein stagger">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <button className="btn btn-ghost" style={{padding:8}} onClick={()=>setStage("celebration")}><ChevronLeft size={16}/></button>
              <h2 className="disp" style={{fontSize:22,margin:0}}>Choose next plan</h2>
            </div>
            <div className="card" style={{padding:14,marginBottom:16}}>
              <div style={{fontSize:12,color:"var(--faint)",marginBottom:8}}>Carries forward to your new plan</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {lastPullups!=null&&<span className="pill" style={{background:"var(--surface2)",color:"var(--chalk)"}}>{lastPullups} pull-ups baseline</span>}
                {lastFlash!=null&&<span className="pill" style={{background:"var(--surface2)",color:"var(--chalk)"}}>V{lastFlash} flash grade</span>}
                <span className="pill" style={{background:"var(--surface2)",color:"var(--chalk)"}}>Your climbing pyramid</span>
                <span className="pill" style={{background:"var(--surface2)",color:"var(--chalk)"}}>Session day preferences</span>
              </div>
            </div>
            {Object.values(PLAN_TEMPLATES).map(t=>(
              <div key={t.id} className="card" style={{padding:16,marginBottom:12,cursor:"pointer",borderColor:selectedTpl===t.id?"var(--rope)":"var(--line)"}} onClick={()=>setSelectedTpl(t.id)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <strong className="disp" style={{fontSize:16}}>{t.name}</strong>
                  <span className="pill" style={{background:"var(--surface2)",color:LEVEL_COLOR[t.level]||"var(--chalk)"}}>{t.level}</span>
                </div>
                <div style={{fontSize:13,color:"var(--chalk-dim)",marginBottom:8}}>{t.subtitle}</div>
                <div style={{fontSize:12,color:"var(--faint)"}}>{t.targetGrades} · {t.phases.join(" → ")}</div>
                {selectedTpl===t.id&&(
                  <button className="btn btn-rope" style={{width:"100%",padding:10,marginTop:12}} onClick={e=>{e.stopPropagation();setStage("confirming");}}>
                    Select this plan →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {stage==="confirming" && selectedTpl && (()=>{
          const t=PLAN_TEMPLATES[selectedTpl];
          return (
            <div className="fadein stagger">
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                <button className="btn btn-ghost" style={{padding:8}} onClick={()=>setStage("picking-plan")}><ChevronLeft size={16}/></button>
                <h2 className="disp" style={{fontSize:22,margin:0}}>Confirm & start</h2>
              </div>
              <div className="card" style={{padding:16,marginBottom:14}}>
                <strong className="disp" style={{fontSize:18,display:"block",marginBottom:4}}>{t.name}</strong>
                <div style={{fontSize:13,color:"var(--chalk-dim)",marginBottom:10}}>{t.subtitle}</div>
                <div style={{fontSize:12,color:"var(--faint)"}}>{t.phases.join(" → ")}</div>
              </div>
              <div className="card" style={{padding:14,marginBottom:16}}>
                <Field label="Start date">
                  <input className="tinput" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/>
                </Field>
              </div>
              <button className="btn btn-rope" style={{width:"100%",padding:14,fontSize:16,marginBottom:10}} onClick={()=>onStart(selectedTpl,startDate)}>
                Start {t.name}
              </button>
              <button className="btn btn-ghost" style={{width:"100%",padding:12}} onClick={onClose}>
                Continue reviewing results
              </button>
            </div>
          );
        })()}

      </div>
    </div>
  );
}

/* ============================ CYCLE HISTORY VIEW ============================ */
function CycleHistoryView({ completedCycles, onClose }){
  const [expanded,setExpanded]=useState(null);
  return (
    <div className="ct-root" style={{position:"fixed",inset:0,zIndex:60,overflowY:"auto"}}>
      <style>{STYLE}</style>
      <div style={{position:"relative",zIndex:1,maxWidth:560,margin:"0 auto",padding:"20px 16px 60px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <button className="btn btn-ghost" style={{padding:8}} onClick={onClose}><ChevronLeft size={16}/></button>
          <h2 className="disp" style={{fontSize:22,margin:0}}>Training history</h2>
        </div>
        {!completedCycles.length && (
          <div style={{color:"var(--chalk-dim)",fontSize:14,textAlign:"center",marginTop:60,lineHeight:1.6}}>
            No completed cycles yet.<br/>Finish your first plan to see your history here.
          </div>
        )}
        {[...completedCycles].reverse().map(cycle=>{
          const s=cycle.summary||{};
          const t=PLAN_TEMPLATES[cycle.planTemplateId];
          const startStr=cycle.startedAt?new Date(cycle.startedAt).toLocaleDateString(undefined,{month:"short",year:"numeric"}):"?";
          const endStr=cycle.completedAt?new Date(cycle.completedAt).toLocaleDateString(undefined,{month:"short",year:"numeric"}):"?";
          const isOpen=expanded===cycle.cycleId;
          return (
            <div key={cycle.cycleId} className="card" style={{padding:16,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div className="disp" style={{fontSize:16,fontWeight:700}}>Cycle {cycle.cycleNumber} — {t?.name||cycle.planTemplateId}</div>
                  <div style={{fontSize:12,color:"var(--faint)",marginTop:2}}>{startStr} → {endStr}</div>
                </div>
                <button className="btn btn-ghost" style={{padding:"4px 8px",fontSize:12}} onClick={()=>setExpanded(isOpen?null:cycle.cycleId)}>
                  {isOpen?"Hide":"Expand"}
                </button>
              </div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {s.totalSessionsDone!=null&&<span style={{fontSize:12,color:"var(--chalk-dim)"}}>{s.totalSessionsDone}/{s.totalSessionsScheduled} sessions ({s.adherencePct}%)</span>}
                {s.pullupStart!=null&&s.pullupEnd!=null&&<span style={{fontSize:12,color:"var(--moss)"}}>{s.pullupEnd>=s.pullupStart?"+":""}{s.pullupEnd-s.pullupStart} pull-ups</span>}
                {s.flashEnd!=null&&<span style={{fontSize:12,color:"var(--chalk-dim)"}}>V{s.flashEnd} flash{s.flashStart!=null&&s.flashStart!==s.flashEnd?` (was V${s.flashStart})`:""}</span>}
                {s.projectEnd!=null&&<span style={{fontSize:12,color:"var(--chalk-dim)"}}>V{s.projectEnd} proj</span>}
              </div>
              {isOpen&&(
                <div className="fadein" style={{marginTop:14}}>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:11,color:"var(--faint)",marginBottom:8,letterSpacing:".04em",textTransform:"uppercase"}}>Weekly completion</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {(cycle.plan?.weeks||[]).map(w=>(
                        <div key={w.week} style={{textAlign:"center"}}>
                          <div style={{fontSize:9,color:"var(--faint)",marginBottom:2}}>W{w.week}</div>
                          <div style={{display:"flex",gap:2}}>
                            {w.sessions.map(s=>{
                              const l=(cycle.logs||{})[logKey(w.week,s.id)];
                              const dot=l?.status==="Y"?"var(--moss)":l?.status==="partial"?"var(--rope)":l?.status==="skip"?"var(--surface2)":"var(--line)";
                              return <div key={s.id} style={{width:7,height:7,borderRadius:"50%",background:dot}}/>;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {(cycle.metrics||[]).filter(m=>m.pullups!=null||m.flash!=null).length>0&&(
                    <div>
                      <div style={{fontSize:11,color:"var(--faint)",marginBottom:8,letterSpacing:".04em",textTransform:"uppercase"}}>Metrics logged</div>
                      {(cycle.metrics||[]).filter(m=>m.pullups!=null||m.flash!=null).map((m,i)=>(
                        <div key={i} style={{display:"flex",gap:12,fontSize:12,color:"var(--chalk-dim)",padding:"4px 0",borderTop:"1px solid var(--line)"}}>
                          <span style={{color:"var(--faint)",minWidth:40}}>Wk {m.week}</span>
                          {m.pullups!=null&&<span>{m.pullups} pull-ups</span>}
                          {m.flash!=null&&<span>V{m.flash} flash</span>}
                          {m.project!=null&&<span>V{m.project} proj</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ APP ============================ */
export default function App(){
  const [plan,setPlan]=useState(DEFAULT_PLAN);
  const [logs,setLogs]=useState({});
  const [metrics,setMetrics]=useState([]);
  const [schedule,setSchedule]=useState({ ...DEFAULT_SCHEDULE, startDate: today() });
  const [settings,setSettings]=useState(DEFAULT_SETTINGS);
  const [completedCycles,setCompletedCycles]=useState([]);
  const [cycleMeta,setCycleMeta]=useState({ cycleId:`cycle_${Date.now()}`, cycleNumber:1, planTemplateId:"foundation-12wk", startedAt:nowIso(), completedAt:null });
  const [completionModal,setCompletionModal]=useState(null);
  const [showHistory,setShowHistory]=useState(false);
  const [dismissedCheckpoints,setDismissedCheckpoints]=useState([]);
  const [dataUpdatedAt,setDataUpdatedAt]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [authReady,setAuthReady]=useState(!isCloudConfigured);
  const [session,setSession]=useState(null);
  const [syncStatus,setSyncStatus]=useState(isCloudConfigured?"signed-out":"local");
  const [authEmail,setAuthEmail]=useState("");
  const [authPassword,setAuthPassword]=useState("");
  const [authMessage,setAuthMessage]=useState(null);
  const [tab,setTab]=useState("today");
  const [curWeek,setCurWeek]=useState(1);
  const [runner,setRunner]=useState(null); // {week, session}
  const [edit,setEdit]=useState(false);
  const [manage,setManage]=useState(false);
  const [sends,setSends]=useState(DEFAULT_SENDS);
  const [drill,setDrill]=useState(null);
  const [routine,setRoutine]=useState(null);
  const saveTimer=useRef(null);
  const applyingRemoteRef=useRef(false);

  const currentAppData=()=>({
    schemaVersion:SCHEMA_VERSION,
    updatedAt:dataUpdatedAt || nowIso(),
    activeCycle:{ ...cycleMeta, plan, logs, metrics, schedule },
    completedCycles, sends, settings,
  });
  const applyAppData=(data)=>{
    const n=normalizeAppData(data);
    const ac=n.activeCycle;
    setPlan(ac.plan); setLogs(ac.logs); setMetrics(ac.metrics); setSchedule(ac.schedule);
    setSends(n.sends); setSettings(n.settings); setDataUpdatedAt(n.updatedAt);
    setCompletedCycles(n.completedCycles);
    setCycleMeta({ cycleId:ac.cycleId, cycleNumber:ac.cycleNumber, planTemplateId:ac.planTemplateId, startedAt:ac.startedAt, completedAt:ac.completedAt });
    setCurWeek(currentScheduleState(ac.plan,ac.schedule,ac.logs).currentWeek);
  };
  const pushCloudData=async(data)=>{
    if(!isCloudConfigured || !session?.user) return;
    if(typeof navigator !== "undefined" && !navigator.onLine){ setSyncStatus("offline"); return; }
    setSyncStatus("syncing");
    const payload=normalizeAppData(data);
    const { error }=await supabase.from("app_state").upsert({
      user_id:session.user.id,
      data:payload,
      schema_version:SCHEMA_VERSION,
      updated_at:payload.updatedAt,
    }, { onConflict:"user_id" });
    setSyncStatus(error ? "error" : "synced");
    if(error) console.error("Supabase sync failed", error);
  };
  const queueCloudSave=(data)=>{
    if(!isCloudConfigured || !session?.user) return;
    if(saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current=setTimeout(()=>pushCloudData(data), 650);
  };

  useEffect(()=>{
    const data=loadAppData();
    applyAppData(data);
    setLoaded(true);
  },[]);
  // Auto-open completion modal once on first load when plan is done.
  // After dismissal the Today tab banner is the persistent re-entry point.
  const shownCompletionOnLoad=useRef(false);
  useEffect(()=>{
    if(!loaded||shownCompletionOnLoad.current) return;
    if(Object.keys(logs).length>0 && isPlanComplete(plan.weeks,logs)){
      shownCompletionOnLoad.current=true;
      setCompletionModal("celebration");
    }
  },[loaded]);
  useEffect(()=>{
    if(!isCloudConfigured){
      setAuthReady(true);
      setSyncStatus("local");
      return;
    }
    let active=true;
    supabase.auth.getSession().then(({ data, error })=>{
      if(!active) return;
      if(error) setAuthMessage({ type:"error", text:error.message });
      setSession(data.session);
      setSyncStatus(data.session?"syncing":"signed-out");
      setAuthReady(true);
    });
    const { data:{ subscription } }=supabase.auth.onAuthStateChange((_event,nextSession)=>{
      setSession(nextSession);
      setSyncStatus(nextSession?"syncing":"signed-out");
    });
    return ()=>{ active=false; subscription.unsubscribe(); };
  },[]);
  useEffect(()=>{
    if(!loaded || !authReady || !isCloudConfigured) return;
    if(!session?.user){ setSyncStatus("signed-out"); return; }
    let active=true;
    const hydrateFromCloud=async()=>{
      if(typeof navigator !== "undefined" && !navigator.onLine){ setSyncStatus("offline"); return; }
      setSyncStatus("syncing");
      const local=loadAppData();
      const { data:row, error }=await supabase
        .from("app_state")
        .select("data, updated_at")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if(!active) return;
      if(error){ setSyncStatus("error"); console.error("Supabase load failed", error); return; }
      const remote=row?.data ? normalizeAppData({ ...row.data, updatedAt:row.data.updatedAt || row.updated_at }) : null;
      if(remote && new Date(remote.updatedAt) > new Date(local.updatedAt)){
        applyingRemoteRef.current=true;
        applyAppData(remote);
        saveAppData(remote,{touch:false});
        setSyncStatus("synced");
        return;
      }
      await pushCloudData(newestAppData(local, remote));
    };
    hydrateFromCloud();
    return ()=>{ active=false; };
  },[loaded,authReady,session?.user?.id]);
  useEffect(()=>{
    if(!loaded) return;
    const next=currentAppData();
    if(applyingRemoteRef.current){
      saveAppData(next,{touch:false});
      applyingRemoteRef.current=false;
      return;
    }
    const saved=saveAppData(next);
    queueCloudSave(saved);
  },[plan,logs,metrics,sends,schedule,settings,completedCycles,cycleMeta,loaded]);
  useEffect(()=>{
    if(typeof window === "undefined") return;
    const online=()=>{ if(session?.user) queueCloudSave(loadAppData()); };
    const offline=()=>setSyncStatus("offline");
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return ()=>{
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  },[session?.user?.id]);
  // Live cross-device sync: subscribe to this user's app_state row so an edit on
  // one device (e.g. the phone) is applied here the moment it lands in Postgres,
  // without waiting for a reload or reconnect. Our own writes echo back too, but
  // the updatedAt comparison skips anything not strictly newer than local.
  useEffect(()=>{
    if(!isCloudConfigured || !authReady || !session?.user) return;
    const userId=session.user.id;
    const applyRemoteRow=(row)=>{
      if(!row?.data) return;
      const remote=normalizeAppData({ ...row.data, updatedAt:row.data.updatedAt || row.updated_at });
      const local=loadAppData();
      if(new Date(remote.updatedAt) > new Date(local.updatedAt)){
        applyingRemoteRef.current=true;
        applyAppData(remote);
        saveAppData(remote,{touch:false});
        setSyncStatus("synced");
      }
    };
    const channel=supabase
      .channel(`app_state:${userId}`)
      .on(
        "postgres_changes",
        { event:"*", schema:"public", table:"app_state", filter:`user_id=eq.${userId}` },
        (payload)=>applyRemoteRow(payload.new)
      )
      .subscribe();
    return ()=>{ supabase.removeChannel(channel); };
  },[authReady,session?.user?.id]);

  const week=plan.weeks.find(w=>w.week===curWeek)||plan.weeks[0];
  const totalSessions=plan.weeks.length*4;
  const doneCount=Object.values(logs).filter(l=>l.status==="Y"||l.status==="partial").length;
  const spacingWarn=daysSince(lastClimbDate(logs))<2;
  const latestFlash=[...metrics].reverse().find(m=>m.flash!=null)?.flash ?? null;
  const schedState=currentScheduleState(plan,schedule,logs);
  const combinedSends=addSendMaps(sends,sendsFromLogs(logs));

  const saveLog=(wk,sid,data)=>{
    const key=logKey(wk,sid);
    const wasSkipped=logs[key]?.status==="skip";
    let shouldReschedule=false;
    let logData=data;
    if(data.status==="skip"){
      if(!wasSkipped){
        shouldReschedule=typeof window !== "undefined" && window.confirm("Treat this skipped workout as an unplanned rest and reschedule it? Choose Cancel to drop it from the plan.");
        logData={...data,skipAction:shouldReschedule?"reschedule":"drop"};
      } else {
        logData={...data,skipAction:logs[key]?.skipAction || "reschedule"};
      }
    }
    const nextLogs={...logs,[key]:normalizeLog(logData)};
    setLogs(nextLogs);
    if(shouldReschedule){
      setSchedule(s=>{
        const cascade=buildRescheduleCascade(plan,s,nextLogs,key,"Unplanned rest reschedule");
        return cascade ? applyCascadeToSchedule(s,cascade) : s;
      });
    }
    setRunner(null);
    if(!completionModal && isPlanComplete(plan.weeks,nextLogs)){
      setTimeout(()=>setCompletionModal("celebration"),400);
    }
  };
  const deleteLog=(wk,sid)=>{
    const key=logKey(wk,sid);
    if(!logs[key]) { setRunner(null); return; }
    const nextLogs={...logs};
    delete nextLogs[key];
    setLogs(nextLogs);
    setRunner(null);
  };
  const archiveAndStartNewCycle=(templateId,startDate)=>{
    const newData=archiveActiveCycle(currentAppData(),templateId,startDate);
    applyAppData(newData);
    setCompletionModal(null);
    setTab("today");
  };
  const openCalendarSession=(item)=>{
    setCurWeek(item.week);
    setRunner({week:item.week,session:item.session});
  };
  const replaceAppData=(data)=>{
    applyAppData({ ...data, updatedAt:nowIso() });
  };
  const handleAuthSubmit=async(e)=>{
    e.preventDefault();
    if(!isCloudConfigured) return;
    setAuthMessage(null);
    const credentials={ email:authEmail.trim(), password:authPassword };
    const { error }=await supabase.auth.signInWithPassword(credentials);
    if(error) setAuthMessage({ type:"error", text:error.message });
    else {
      setAuthPassword("");
      setAuthMessage(null);
    }
  };
  const signOut=async()=>{
    if(isCloudConfigured) await supabase.auth.signOut();
    setSession(null);
    setSyncStatus("signed-out");
  };
  const syncLabel={
    local:"Local only",
    "signed-out":"Signed out",
    syncing:"Syncing",
    synced:"Synced",
    offline:"Offline",
    error:"Sync issue",
  }[syncStatus] || "Sync";
  const SyncIcon=syncStatus==="offline" || syncStatus==="error" ? WifiOff : Wifi;

  if(!authReady){
    return (
      <div className="ct-root" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <style>{STYLE}</style>
        <div className="disp" style={{position:"relative",zIndex:1,color:"var(--chalk-dim)"}}>Loading Ascent...</div>
      </div>
    );
  }
  if(isCloudConfigured && !session){
    return (
      <AuthScreen
        email={authEmail} setEmail={setAuthEmail}
        password={authPassword} setPassword={setAuthPassword}
        message={authMessage}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  return (
    <div className="ct-root" style={{minHeight:"100vh"}}>
      <style>{STYLE}</style>
      {runner && <Runner week={runner.week} session={runner.session}
        spacingWarn={spacingWarn && runner.session.id!=="support"}
        existingLog={logs[logKey(runner.week,runner.session.id)]}
        onClose={()=>setRunner(null)} onSave={d=>saveLog(runner.week,runner.session.id,d)}
        onDelete={()=>deleteLog(runner.week,runner.session.id)}/>}

      <div style={{position:"relative",zIndex:1,maxWidth:560,margin:"0 auto",padding:"20px 16px 100px"}}>
        {/* header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:"var(--rope)",display:"flex",alignItems:"center",justifyContent:"center"}}><Mountain size={20} color="#1a120c"/></div>
            <div>
              <div className="disp" style={{fontWeight:800,fontSize:18,lineHeight:1}}>Ascent</div>
              <div style={{fontSize:11,color:"var(--faint)"}}>{plan.name}</div>
              <div className="mono" style={{fontSize:10,color:syncStatus==="error"?"var(--rope)":syncStatus==="offline"?"var(--deload)":"var(--moss)",display:"flex",alignItems:"center",gap:4,marginTop:3}}>
                <SyncIcon size={11}/>{syncLabel}
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {isCloudConfigured && (
              <button className="btn btn-ghost" title="Sign out" style={{padding:9}} onClick={signOut}><LogOut size={18}/></button>
            )}
            <button className="btn btn-ghost" title="Manage plan" style={{padding:9}} onClick={()=>setManage(true)}><Settings size={18}/></button>
          </div>
        </div>

        {/* ===== TODAY ===== */}
        {tab==="today" && (()=>{
          const wk=week;
          const accent=wk.type==="deload"?"var(--deload)":wk.type==="test"?"var(--test)":"var(--rope)";
          const weekDone=wk.sessions.filter(s=>{const l=logs[`${curWeek}-${s.id}`];return l&&l.status!=="skip";}).length;
          const featured=[...new Set(wk.sessions.flatMap(s=>s.drills||[]))];
          const intent=wk.phase.includes("Foundation")?"Build the movement base — quiet feet, efficient body position, and the habit of climbing a lot."
            :wk.phase.includes("Skill")?"Apply your technique on harder ground — projecting, dynamic moves, less assistance."
            :"Bring it together — flash on sight, structured V4 projecting, arrive fresh.";
          const ringC=2*Math.PI*22, ringO=ringC*(1-weekDone/4);
          const rTargets=weekRoutineTargets(wk);
          const rDone=weekRoutineDone(wk,curWeek,logs);
          const rKeys=Object.keys(rTargets);
          const travelToday=activeTravelBlock(schedule,today());
          const checkpointWeek=plan.weeks.find(w=>
            (w.type==="deload"||w.type==="test") &&
            w.sessions.every(s=>{const l=logs[logKey(w.week,s.id)];return l&&(l.status==="Y"||l.status==="partial"||l.status==="skip");}) &&
            !metrics.some(m=>m.week===w.week) &&
            !dismissedCheckpoints.includes(w.week)
          );
          const planDone=isPlanComplete(plan.weeks,logs);
          return (
          <div className="stagger">
            {planDone ? (
              <div className="card fadein" style={{padding:18,marginBottom:14,borderColor:"var(--moss)",background:"linear-gradient(135deg,var(--surface),var(--granite2))"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"var(--moss)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Award size={20} color="#1a120c"/>
                  </div>
                  <div>
                    <div className="disp" style={{fontSize:16,fontWeight:800,lineHeight:1.2}}>{plan.name} — complete</div>
                    <div style={{fontSize:12,color:"var(--chalk-dim)",marginTop:2}}>Time to pick your next plan.</div>
                  </div>
                </div>
                <button className="btn btn-rope" style={{width:"100%",padding:11,fontSize:14}} onClick={()=>setCompletionModal("celebration")}>
                  View results &amp; start next plan
                </button>
              </div>
            ) : (
              <>
                {checkpointWeek&&<CheckpointPrompt week={checkpointWeek}
                  onSave={entry=>setMetrics(m=>[...m.filter(x=>x.week!==entry.week),entry].sort((a,b)=>a.week-b.week))}
                  onDismiss={()=>setDismissedCheckpoints(d=>[...d,checkpointWeek.week])}/>}
                <div className="card" style={{padding:15,marginBottom:14,borderColor:schedState.due.length?"var(--rope)":schedState.overdue.length?"var(--deload)":"var(--line)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:10,marginBottom:9}}>
                    <div className="disp" style={{fontSize:15,color:"var(--rope)"}}>Today</div>
                    <button className="btn btn-ghost" style={{padding:"5px 9px",fontSize:12}} onClick={()=>setManage(true)}>Schedule</button>
                  </div>
                  <div style={{fontSize:13,color:"var(--chalk-dim)",lineHeight:1.5}}>
                    {schedState.due.length>0 ? (
                      <>Due now: {schedState.due.map(i=>`W${i.week} ${sessionTitle(i.session)}`).join(", ")}.</>
                    ) : schedState.overdue.length>0 ? (
                      <>Overdue: {schedState.overdue.slice(0,2).map(i=>`W${i.week} ${sessionTitle(i.session)} (${fmtFullDate(i.date)})`).join(", ")}.</>
                    ) : schedState.upcoming ? (
                      <>Next up: W{schedState.upcoming.week} {sessionTitle(schedState.upcoming.session)} on {fmtFullDate(schedState.upcoming.date)}.</>
                    ) : <>All scheduled sessions are logged.</>}
                  </div>
                  {travelToday && (
                    <div style={{marginTop:10,padding:"9px 10px",borderRadius:10,background:"var(--granite)",border:"1px solid var(--deload)",fontSize:13,color:"var(--chalk-dim)"}}>
                      {travelToday.label || "Travel block"} is active today. Treat this as a prompt to go lighter, slide sessions, or use deload-style climbing.
                    </div>
                  )}
                </div>
              </>
            )}
            {/* WEEK HERO */}
            <div className="card" style={{padding:0,marginBottom:14,overflow:"hidden"}}>
              <div style={{padding:"16px 16px 15px",borderLeft:`4px solid ${accent}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <button className="btn btn-ghost" style={{padding:4}} onClick={()=>setCurWeek(Math.max(1,curWeek-1))}><ChevronLeft size={15}/></button>
                      <div className="disp" style={{fontSize:26,fontWeight:800,lineHeight:1}}>Week {curWeek}</div>
                      <button className="btn btn-ghost" style={{padding:4}} onClick={()=>setCurWeek(Math.min(plan.weeks.length,curWeek+1))}><ChevronRight size={15}/></button>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
                      <span className="disp" style={{fontSize:12,color:accent,letterSpacing:".04em",textTransform:"uppercase"}}>{wk.phase}</span>
                      {wk.type!=="normal" && <span className="pill" style={{background:"var(--surface2)",color:accent}}>{wk.type}</span>}
                    </div>
                  </div>
                  {/* week progress ring */}
                  <svg width="58" height="58" style={{flexShrink:0}}>
                    <circle cx="29" cy="29" r="22" fill="none" stroke="var(--line)" strokeWidth="5"/>
                    <circle cx="29" cy="29" r="22" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={ringC} strokeDashoffset={ringO} transform="rotate(-90 29 29)" style={{transition:"stroke-dashoffset .4s"}}/>
                    <text x="29" y="34" textAnchor="middle" className="disp" fill="var(--chalk)" fontSize="16" fontWeight="700">{weekDone}/4</text>
                  </svg>
                </div>
                <p style={{margin:"12px 0 0",fontSize:14,color:"var(--chalk-dim)",lineHeight:1.5}}>{intent}</p>
                {featured.length>0 && (
                  <div style={{marginTop:14}}>
                    <div style={{fontSize:11,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:7}}>Drills this week · tap to learn</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {featured.map(dn=>(
                        <button key={dn} onClick={()=>setDrill(dn)} className="pill" style={{background:"var(--surface2)",color:"var(--rope)",border:"1px solid var(--line)",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                          {dn}<Info size={12} style={{opacity:.55}}/>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={{background:"var(--granite)",padding:"8px 16px",borderTop:"1px solid var(--line)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:"var(--faint)"}}>12-week consistency</span>
                <span className="mono" style={{fontSize:12,color:"var(--chalk-dim)"}}>{doneCount}/{totalSessions} sessions</span>
              </div>
            </div>

            {/* WEEKLY ROUTINE TRACKER */}
            {rKeys.length>0 && (
              <div className="card" style={{padding:15,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
                  <div className="disp" style={{fontSize:14,color:"var(--rope)"}}>This week's routines</div>
                  <div style={{fontSize:11,color:"var(--faint)"}}>done / scheduled · tap to view</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:11}}>
                  {rKeys.map(r=>{ const t=rTargets[r], dn=rDone[r]||0, pct=Math.min(1,dn/t);
                    return (
                      <button key={r} onClick={()=>setRoutine(r)} style={{background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left",width:"100%"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                          {React.createElement(CAT_ICON[ROUTINES[r].cat]||Activity,{size:15,style:{color:dn>=t?"var(--moss)":"var(--chalk-dim)"}})}
                          <span style={{flex:1,fontSize:14}}>{ROUTINES[r].label}</span>
                          <span className="mono" style={{fontSize:12,color:dn>=t?"var(--moss)":"var(--faint)"}}>{dn}/{t}</span>
                        </div>
                        <div style={{height:6,background:"var(--granite)",borderRadius:5,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct*100}%`,borderRadius:5,transition:"width .3s",background:dn>=t?"var(--moss)":"var(--rope)"}}/>
                        </div>
                      </button>
                    );})}
                </div>
              </div>
            )}

            {/* CLIMBING PYRAMID */}
            <Pyramid sends={combinedSends} setSends={setSends} flash={latestFlash}/>

            {spacingWarn && (
              <div className="card" style={{padding:13,borderColor:"var(--deload)",marginBottom:14,display:"flex",gap:10}}>
                <AlertTriangle size={18} style={{color:"var(--deload)",flexShrink:0,marginTop:1}}/>
                <div style={{fontSize:13,color:"var(--chalk-dim)"}}>Under 48h since your last hard climbing day — keep finger loading light today.</div>
              </div>
            )}

            <div style={{fontSize:11,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".06em",margin:"4px 2px 10px"}}>This week's sessions</div>
            {wk.sessions.map(s=>{
              const log=logs[`${curWeek}-${s.id}`];
              const sDate=scheduledDate(schedule,curWeek,s.id);
              const sTravel=activeTravelBlock(schedule,sDate);
              const item={ week:curWeek, phase:wk.phase, type:wk.type, session:s, log };
              const surface=workoutSurfaceStyle(item);
              return (
                <div key={s.id} className="card" style={{...surface,padding:15,marginBottom:11,
                  borderLeft:`3px solid ${sTravel?"var(--deload)":wk.type==="deload"?"var(--deload)":wk.type==="test"?"var(--test)":"var(--line)"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                    <div style={{flex:1}}>
                      <div className="disp" style={{fontSize:13,color:"var(--faint)",letterSpacing:".04em",textTransform:"uppercase"}}>{s.day}</div>
                      <div className="mono" style={{fontSize:11,color:"var(--faint)",marginTop:2}}>{fmtFullDate(sDate)}</div>
                      <div style={{fontSize:15,marginTop:3,lineHeight:1.4}}>{s.focus}</div>
                    </div>
                    {log ? (
                      <div style={{textAlign:"right"}}>
                        <div style={{width:30,height:30,borderRadius:8,marginLeft:"auto",display:"flex",alignItems:"center",justifyContent:"center",
                          background:log.status==="skip"?"var(--surface2)":"var(--moss)"}}>
                          {log.status==="skip"?<X size={16}/>:<Check size={16} color="#1a120c"/>}
                        </div>
                        {log.status!=="skip" && <div className="mono" style={{fontSize:11,color:"var(--faint)",marginTop:4}}>RPE {log.rpe}</div>}
                        {log.pain && <AlertTriangle size={13} style={{color:"var(--deload)",marginTop:3}}/>}
                        <button className="btn btn-ghost" style={{padding:"5px 8px",fontSize:11,marginTop:5}} onClick={()=>setRunner({week:curWeek,session:s})}>Edit</button>
                      </div>
                    ):(
                      <button className="btn btn-rope" style={{padding:"8px 12px",display:"flex",alignItems:"center",gap:5,fontSize:13}} onClick={()=>setRunner({week:curWeek,session:s})}><Play size={14}/>Start</button>
                    )}
                  </div>
                  {sTravel && (
                    <div style={{marginTop:10,fontSize:12,color:"var(--deload)"}}>
                      {sTravel.label || "Travel block"} overlaps this session. Consider going lighter or sliding it.
                    </div>
                  )}
                  {log?.pain && (
                    <div style={{marginTop:10,fontSize:12,color:"var(--deload)"}}>
                      Pain was flagged here. Next session should be lighter until it settles.
                    </div>
                  )}
                  {s.drills && s.drills.length>0 && (
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
                      {s.drills.map(dn=>(
                        <button key={dn} onClick={()=>setDrill(dn)} className="pill" style={{background:"transparent",color:"var(--rope)",border:"1px solid var(--rope-soft)",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                          {dn}<Info size={12} style={{opacity:.55}}/>
                        </button>
                      ))}
                    </div>
                  )}
                  {s.routines && s.routines.length>0 && (
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                      {s.routines.map(r=>{ const rdone=log&&log.routinesDone&&log.routinesDone.includes(r);
                        return (
                          <button key={r} onClick={()=>setRoutine(r)} className="pill" style={{cursor:"pointer",display:"flex",alignItems:"center",gap:5,
                            background:rdone?"var(--moss)":"var(--surface2)",color:rdone?"#1a120c":"var(--chalk-dim)",border:"1px solid var(--line)"}}>
                            {rdone?<Check size={12}/>:React.createElement(CAT_ICON[ROUTINES[r].cat]||Activity,{size:12})}{ROUTINES[r].label}
                          </button>
                        );})}
                    </div>
                  )}
                </div>
              );
            })}
          </div>);
        })()}

        {/* ===== PLAN ===== */}
        {tab==="plan" && (
          <div className="stagger">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <h2 className="disp" style={{fontSize:22,margin:0}}>The Plan</h2>
              <button className="btn btn-ghost" style={{padding:"7px 12px",display:"flex",gap:6,alignItems:"center",fontSize:13,color:edit?"var(--rope)":"var(--chalk)",borderColor:edit?"var(--rope)":"var(--line)"}} onClick={()=>setEdit(e=>!e)}>
                <Pencil size={14}/>{edit?"Done":"Edit"}
              </button>
            </div>
            {plan.weeks.map(w=>(
              <div key={w.week} className="card" style={{padding:14,marginBottom:11,
                borderLeft:`3px solid ${w.type==="deload"?"var(--deload)":w.type==="test"?"var(--test)":"var(--line)"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <strong className="disp">Week {w.week} <span style={{color:"var(--faint)",fontWeight:500,fontSize:13}}>· {w.phase}</span></strong>
                  {w.type!=="normal" && <span className="pill" style={{background:"var(--surface2)",color:PHASE_COLOR[w.type]}}>{w.type}</span>}
                </div>
                {w.sessions.map((s,si)=>{
                  const log=logs[`${w.week}-${s.id}`];
                  const surface=workoutSurfaceStyle({ week:w.week, phase:w.phase, type:w.type, session:s, log });
                  return (
                  <div key={s.id} style={{...surface,padding:"9px 10px",border:`1px solid ${si?"var(--line)":"transparent"}`,borderRadius:9,marginTop:si?7:0}}>
                    <div style={{fontSize:11,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".04em"}}>{s.day}</div>
                    {edit ? (
                      <textarea className="tinput" rows={2} value={s.focus} style={{marginTop:4,fontSize:13}}
                        onChange={e=>{ const v=e.target.value; setPlan(p=>{ const np=structuredClone(p);
                          np.weeks.find(x=>x.week===w.week).sessions[si].focus=v; return np; }); }}/>
                    ):(
                      <div style={{fontSize:14,marginTop:2,lineHeight:1.4}}>{s.focus}</div>
                    )}
                    {s.routines && s.routines.length>0 && (
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
                        {s.routines.map(r=>(
                          <span key={r} className="pill" style={{display:"inline-flex",alignItems:"center",gap:4,background:"var(--surface2)",color:"var(--chalk-dim)",fontSize:10}}>
                            {React.createElement(CAT_ICON[ROUTINES[r].cat]||Activity,{size:11})}{ROUTINES[r].label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );})}
              </div>
            ))}
          </div>
        )}

        {/* ===== CALENDAR ===== */}
        {tab==="calendar" && <CalendarView plan={plan} schedule={schedule} setSchedule={setSchedule} logs={logs} onOpenSession={openCalendarSession}/>}

        {/* ===== METRICS ===== */}
        {tab==="metrics" && <Metrics metrics={metrics} setMetrics={setMetrics} logs={logs} plan={plan} onEditLog={({week,session})=>setRunner({week,session})} planLen={plan.weeks.length} onShowHistory={()=>setShowHistory(true)} hasHistory={completedCycles.length>0}/>}

        {/* ===== LIBRARY ===== */}
        {tab==="library" && <Library/>}
      </div>

      {/* tab bar */}
      <div className="tabbar" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:40}}>
        <div style={{maxWidth:560,margin:"0 auto",display:"flex",justifyContent:"space-around",padding:"10px 8px 14px"}}>
          {[["today",Flame,"Today"],["calendar",CalendarDays,"Calendar"],["plan",Mountain,"Plan"],["metrics",Activity,"Metrics"],["library",Hand,"Library"]].map(([t,Icon,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab===t?"var(--rope)":"var(--faint)"}}>
              <Icon size={21}/><span className="disp" style={{fontSize:10,fontWeight:700}}>{l}</span>
            </button>
          ))}
        </div>
      </div>

      {manage && <Manage data={currentAppData()} onReplace={replaceAppData} setPlan={setPlan} setSchedule={setSchedule} onClose={()=>setManage(false)}/>}
      {completionModal && <PlanCompletionModal plan={plan} logs={logs} metrics={metrics} schedule={schedule} completedCycles={completedCycles} onStart={archiveAndStartNewCycle} onClose={()=>setCompletionModal(null)}/>}
      {showHistory && <CycleHistoryView completedCycles={completedCycles} onClose={()=>setShowHistory(false)}/>}
      {drill && <DrillSheetV2 name={drill} onClose={()=>setDrill(null)}/>}
      {routine && <RoutineSheet rkey={routine} week={curWeek} onClose={()=>setRoutine(null)} onDrill={(n)=>setDrill(n)}/>}
    </div>
  );
}

/* ============================ METRICS ============================ */
function Metrics({ metrics, setMetrics, logs, plan, onEditLog, planLen, onShowHistory, hasHistory }){
  const [w,setW]=useState(metrics.length?"" : 1);
  const [pu,setPu]=useState(""); const [fl,setFl]=useState(""); const [pr,setPr]=useState("");
  const [sl,setSl]=useState(""); const [pn,setPn]=useState("");
  const [editingMetricWeek,setEditingMetricWeek]=useState(null);
  const add=()=>{ if(!w) return;
    const existing=metrics.find(x=>x.week===+w);
    const entry={week:+w,date:existing?.date || today(),pullups:+pu||null,flash:+fl||null,project:+pr||null,sleep:+sl||null,pain:pn,amendedAt:existing?nowIso():existing?.amendedAt};
    setMetrics(m=>[...m.filter(x=>x.week!==+w),entry].sort((a,b)=>a.week-b.week));
    setPu("");setFl("");setPr("");setSl("");setPn("");setEditingMetricWeek(null);
  };
  const editMetric=(m)=>{
    setEditingMetricWeek(m.week);
    setW(String(m.week));
    setPu(m.pullups??"");
    setFl(m.flash??"");
    setPr(m.project??"");
    setSl(m.sleep??"");
    setPn(m.pain??"");
  };
  const clearMetricForm=()=>{
    setEditingMetricWeek(null);
    setW("");
    setPu("");setFl("");setPr("");setSl("");setPn("");
  };
  const deleteMetric=()=>{
    if(!editingMetricWeek) return;
    setMetrics(m=>m.filter(x=>x.week!==editingMetricWeek));
    clearMetricForm();
  };
  const weeklyStats=weeklyLogStats(logs,planLen);
  const activeWeeks=weeklyStats.filter(x=>x.completed || x.volume || x.effort || x.pain);
  const latestWeek=activeWeeks.at(-1);
  const latestFlash=latestMetricValue(metrics,"flash");
  const latestProject=latestMetricValue(metrics,"project");
  const pullDelta=metricDelta(metrics,"pullups");
  const flashDelta=metricDelta(metrics,"flash");
  const projectDelta=metricDelta(metrics,"project");
  const insights=buildMetricInsights(metrics,weeklyStats);
  const hasLogs=activeWeeks.length>0;
  const painWeeks=weeklyStats.filter(x=>x.pain>0).map(x=>x.week);
  const hardestSend=maxKnown(activeWeeks.map(x=>x.hardestSend));
  const recentLogs=loggedSessionItems(plan,logs).slice(0,8);

  return (
    <div className="stagger">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2 className="disp" style={{fontSize:22,margin:0}}>Progress Metrics</h2>
        {hasHistory&&<button className="btn btn-ghost" style={{padding:"6px 10px",fontSize:12,display:"flex",gap:5,alignItems:"center"}} onClick={onShowHistory}><History size={14}/>History</button>}
      </div>

      <MetricDashboard metrics={metrics} weeklyStats={weeklyStats} activeWeeks={activeWeeks} latestWeek={latestWeek} latestFlash={latestFlash} latestProject={latestProject} pullDelta={pullDelta} flashDelta={flashDelta} projectDelta={projectDelta} insights={insights} hasLogs={hasLogs} painWeeks={painWeeks} hardestSend={hardestSend} planLen={planLen}/>

      <MetricSection title="Recent logs">
        {recentLogs.length===0 ? (
          <EmptyMetric text="Session logs will appear here after you save workouts."/>
        ) : (
          <div className="card" style={{padding:6}}>
            {recentLogs.map(item=>{
              const sends=Object.values(item.log.volumeByGrade||{}).reduce((s,n)=>s+(+n||0),0);
              const attempts=attemptStats(item.log).count;
              return (
                <div key={item.key} style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,alignItems:"center",padding:"10px",borderBottom:"1px solid var(--line)"}}>
                  <div>
                    <div className="disp" style={{fontSize:13,color:"var(--chalk)"}}>W{item.week} {sessionTitle(item.session)}</div>
                    <div className="mono" style={{fontSize:11,color:"var(--faint)",marginTop:3}}>{item.log.date?fmtFullDate(item.log.date):"No date"} - RPE {item.log.rpe || "-"} - {sends} sends - {attempts} tries</div>
                    {item.log.notes && <div style={{fontSize:12,color:"var(--chalk-dim)",marginTop:5,lineHeight:1.35,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{item.log.notes}</div>}
                  </div>
                  <button className="btn btn-ghost" style={{padding:"7px 9px",display:"flex",alignItems:"center",gap:5,fontSize:12}} onClick={()=>onEditLog(item)}><Pencil size={13}/>Edit</button>
                </div>
              );
            })}
          </div>
        )}
      </MetricSection>

      <div className="card" style={{padding:15,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8,marginBottom:10}}>
          <div className="disp" style={{fontSize:14,color:"var(--rope)"}}>{editingMetricWeek?`Amend week ${editingMetricWeek}`:"Log this week's numbers"}</div>
          {editingMetricWeek && (
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <button className="btn btn-ghost" title="Delete entry" style={{padding:"4px 7px",display:"flex",alignItems:"center",color:"var(--deload)"}} onClick={deleteMetric}><Trash2 size={13}/></button>
              <button className="btn btn-ghost" style={{padding:"4px 8px",fontSize:12}} onClick={clearMetricForm}>Cancel</button>
            </div>
          )}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Field label="Week"><select className="tinput" value={w} onChange={e=>setW(e.target.value)}>
            <option value="">—</option>{Array.from({length:planLen},(_,i)=>i+1).map(n=><option key={n} value={n}>Week {n}</option>)}
          </select></Field>
          <Field label="Max pull-ups"><input className="tinput" inputMode="numeric" value={pu} onChange={e=>setPu(e.target.value)}/></Field>
          <Field label="Flash grade (V)"><input className="tinput" inputMode="numeric" value={fl} onChange={e=>setFl(e.target.value)}/></Field>
          <Field label="Project (V)"><input className="tinput" inputMode="numeric" value={pr} onChange={e=>setPr(e.target.value)}/></Field>
          <Field label="Avg sleep (hrs)"><input className="tinput" inputMode="decimal" value={sl} onChange={e=>setSl(e.target.value)}/></Field>
          <Field label="Pain / niggles"><input className="tinput" value={pn} onChange={e=>setPn(e.target.value)}/></Field>
        </div>
        <button className="btn btn-rope" style={{width:"100%",padding:11,marginTop:12,display:"flex",justifyContent:"center",gap:6,alignItems:"center"}} onClick={add}><Plus size={16}/>{editingMetricWeek?"Update entry":"Save entry"}</button>
      </div>

      {metrics.length>0 && (
        <div className="card" style={{padding:6}}>
          {metrics.map(m=>(
            <div key={m.week} style={{display:"grid",gridTemplateColumns:"54px 1fr auto",alignItems:"center",gap:10,padding:"10px 10px",borderBottom:"1px solid var(--line)"}}>
              <div className="disp" style={{width:60,fontSize:13,color:"var(--faint)"}}>Wk {m.week}</div>
              <div className="mono" style={{flex:1,fontSize:13}}>
                {m.pullups!=null&&<span>{m.pullups} PU&nbsp;&nbsp;</span>}
                {m.flash!=null&&<span style={{color:"var(--chalk-dim)"}}>V{m.flash} flash&nbsp;&nbsp;</span>}
                {m.project!=null&&<span style={{color:"var(--chalk-dim)"}}>V{m.project} proj</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                {m.pain && <AlertTriangle size={14} style={{color:"var(--deload)"}}/>}
                <button className="btn btn-ghost" style={{padding:"5px 7px",display:"flex",alignItems:"center",gap:4,fontSize:11}} onClick={()=>editMetric(m)}><Pencil size={12}/>Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function MetricDashboard({metrics,weeklyStats,activeWeeks,latestWeek,latestFlash,latestProject,pullDelta,flashDelta,projectDelta,insights,hasLogs,painWeeks,hardestSend,planLen}){
  return (
    <>
      <MetricSection title="Overview">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <MetricCard label="Flash" value={latestFlash!=null?`V${latestFlash}`:"--"} hint={flashDelta?`${fmtSigned(flashDelta.value)} since W${flashDelta.from.week}`:"manual checkpoint"}/>
          <MetricCard label="Project" value={latestProject!=null?`V${latestProject}`:"--"} hint={projectDelta?`${fmtSigned(projectDelta.value)} since W${projectDelta.from.week}`:"manual checkpoint"}/>
          <MetricCard label="Pull-ups" value={pullDelta?fmtSigned(pullDelta.value):"--"} hint={pullDelta?`since W${pullDelta.from.week}`:"needs two entries"}/>
          <MetricCard label="Consistency" value={hasLogs?`${activeWeeks.reduce((s,x)=>s+x.completed,0)}/${planLen*4}`:"--"} hint="sessions logged"/>
        </div>
        <div className="card" style={{padding:13,marginTop:8}}>
          <div className="disp" style={{fontSize:13,color:"var(--rope)",marginBottom:8}}>Coach notes</div>
          <div style={{display:"grid",gap:8}}>
            {insights.map((ins,idx)=>(
              <div key={idx} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:"var(--chalk-dim)",lineHeight:1.45}}>
                {ins.tone==="warn" ? <AlertTriangle size={15} style={{color:"var(--deload)",marginTop:1,flexShrink:0}}/> : <Activity size={15} style={{color:ins.tone==="good"?"var(--moss)":"var(--test)",marginTop:1,flexShrink:0}}/>}
                <span>{ins.text}</span>
              </div>
            ))}
          </div>
        </div>
      </MetricSection>

      <MetricSection title="Performance">
        <CombinedTrendChart metrics={metrics} weeklyStats={weeklyStats}/>
      </MetricSection>

      <MetricSection title="Load">
        {!hasLogs ? (
          <EmptyMetric text="Load, volume, and send stats will appear after sessions are logged."/>
        ) : (
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <MetricCard label="Latest volume" value={latestWeek?.volume || 0} hint={latestWeek?`week ${latestWeek.week}`:"no logs"}/>
              <MetricCard label="Latest effort" value={latestWeek?.effort || 0} hint="RPE weighted"/>
              <MetricCard label="Sends" value={activeWeeks.reduce((s,x)=>s+x.sends,0)} hint="from session logs"/>
              <MetricCard label="Hardest send" value={hardestSend!=null?`V${hardestSend}`:"--"} hint="logged volume"/>
            </div>
            <div className="card" style={{padding:6}}>
              {activeWeeks.slice(-6).map(s=>(
                <div key={s.week} style={{display:"grid",gridTemplateColumns:"48px 1fr auto",gap:10,alignItems:"center",padding:"10px",borderBottom:"1px solid var(--line)"}}>
                  <div className="disp" style={{fontSize:13,color:"var(--faint)"}}>Wk {s.week}</div>
                  <div style={{height:7,borderRadius:999,background:"var(--surface2)",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.min(100,(s.volume/Math.max(1,...activeWeeks.map(x=>x.volume)))*100)}%`,background:"var(--test)"}}/>
                  </div>
                  <div className="mono" style={{fontSize:12,color:"var(--chalk-dim)"}}>{s.sends} sends / {s.attempts} tries</div>
                </div>
              ))}
            </div>
          </>
        )}
      </MetricSection>

      <MetricSection title="Recovery">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <MetricCard label="Status" value={latestWeek?.pain?"Watch":"Clear"} hint={latestWeek?.pain?`${latestWeek.pain} pain flag${latestWeek.pain>1?"s":""}`:"latest logged week"}/>
          <MetricCard label="Avg RPE" value={latestWeek?.avgRpe?latestWeek.avgRpe.toFixed(1):"--"} hint={latestWeek?`week ${latestWeek.week}`:"no logs"}/>
          <MetricCard label="Sleep" value={latestMetricValue(metrics,"sleep")?`${latestMetricValue(metrics,"sleep")}h`:"--"} hint="latest checkpoint"/>
          <MetricCard label="Pain weeks" value={painWeeks.length} hint={painWeeks.length?`W${painWeeks.join(", W")}`:"none logged"}/>
        </div>
        {painWeeks.length>0 && (
          <div className="card" style={{padding:13,marginTop:8,display:"flex",gap:8,alignItems:"flex-start",color:"var(--chalk-dim)",fontSize:13,lineHeight:1.45}}>
            <AlertTriangle size={15} style={{color:"var(--deload)",marginTop:1,flexShrink:0}}/>
            <span>Pain markers are a cue to reduce intensity, extend warm-ups, or keep the next climbing day technical.</span>
          </div>
        )}
      </MetricSection>
    </>
  );
}
function Field({label,children}){return(<label style={{display:"block"}}><div style={{fontSize:11,color:"var(--faint)",marginBottom:4}}>{label}</div>{children}</label>);}
function MetricSection({title,children}){
  return (
    <section style={{marginBottom:14}}>
      <div className="disp" style={{fontSize:13,color:"var(--rope)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>{title}</div>
      {children}
    </section>
  );
}
function MetricCard({label,value,hint}){
  return (
    <div className="card" style={{padding:13,minHeight:82}}>
      <div style={{fontSize:11,color:"var(--faint)",marginBottom:6}}>{label}</div>
      <div className="disp" style={{fontSize:24,lineHeight:1,color:"var(--chalk)"}}>{value}</div>
      <div style={{fontSize:11,color:"var(--chalk-dim)",marginTop:7,lineHeight:1.25}}>{hint}</div>
    </div>
  );
}
function EmptyMetric({text}){
  return <div className="card" style={{padding:14,color:"var(--chalk-dim)",fontSize:13,lineHeight:1.45}}>{text}</div>;
}
function fmtSigned(n){ return `${n>0?"+":""}${n}`; }
function maxKnown(vals){
  const clean=vals.filter(v=>v!=null);
  return clean.length ? Math.max(...clean) : null;
}
function CombinedTrendChart({metrics,weeklyStats}){
  const series=[
    {label:"Pull-ups",color:"var(--rope)",pts:metrics.filter(m=>m.pullups!=null).map(m=>({week:m.week,value:+m.pullups}))},
    {label:"Flash",color:"var(--moss)",pts:metrics.filter(m=>m.flash!=null).map(m=>({week:m.week,value:+m.flash}))},
    {label:"Project",color:"var(--test)",pts:metrics.filter(m=>m.project!=null).map(m=>({week:m.week,value:+m.project}))},
    {label:"Sleep",color:"var(--chalk-dim)",pts:metrics.filter(m=>m.sleep!=null).map(m=>({week:m.week,value:+m.sleep}))},
    {label:"Volume",color:"var(--deload)",pts:weeklyStats.filter(w=>w.volume>0).map(w=>({week:w.week,value:w.volume}))},
  ].map(s=>normalizeSeries(s)).filter(s=>s.pts.length>1);
  if(!series.length) return <EmptyMetric text="Add at least two checkpoints or logged-volume weeks to compare trend lines."/>;
  const w=480,h=118,pad=12;
  const all=series.flatMap(s=>s.pts);
  const xs=all.map(p=>p.week), ys=all.map(p=>p.index);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const X=v=>pad+((v-minX)/((maxX-minX)||1))*(w-2*pad);
  const Y=v=>h-pad-((v-minY)/((maxY-minY)||1))*(h-2*pad);
  const pathFor=arr=>arr.map((p,i)=>`${i?"L":"M"}${X(p.week)},${Y(p.index)}`).join(" ");
  return (
    <div className="card" style={{padding:14,marginBottom:14}}>
      <div className="disp" style={{fontSize:13,color:"var(--rope)",marginBottom:6}}>Progress index</div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:118}}>
        {[0,.5,1].map((n,idx)=><line key={idx} x1={pad} x2={w-pad} y1={pad+n*(h-2*pad)} y2={pad+n*(h-2*pad)} stroke="var(--line)" strokeWidth="1"/>)}
        {series.map(s=><path key={s.label} d={pathFor(s.pts)} fill="none" stroke={s.color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>)}
        {series.flatMap(s=>s.pts.map((p,pi)=><circle key={`${s.label}-${pi}`} cx={X(p.week)} cy={Y(p.index)} r="2.8" fill={s.color}/>))}
      </svg>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginTop:4}}>
        {series.map(s=><span key={s.label} className="mono" style={{fontSize:10,color:s.color}}>{s.label}</span>)}
      </div>
      <div style={{fontSize:11,color:"var(--faint)",lineHeight:1.35,textAlign:"center",marginTop:8}}>
        Each line is normalized 0–100 within its own range. Use this to compare timing and direction, not raw magnitude.
      </div>
    </div>
  );
}
function normalizeSeries(series){
  const pts=series.pts.filter(p=>Number.isFinite(p.value));
  if(pts.length<2) return {...series,pts};
  const min=Math.min(...pts.map(p=>p.value)), max=Math.max(...pts.map(p=>p.value));
  return {...series,pts:pts.map(p=>({...p,index:max===min?50:((p.value-min)/(max-min))*100}))};
}

/* ============================ LIBRARY ============================ */
function Library(){
  const cats=["Technique","Pull-ups","Shoulder","Antagonist","Core","Foot/Ankle","Fingers"];
  const [open,setOpen]=useState(null);
  return (
    <div className="stagger">
      <h2 className="disp" style={{fontSize:22,margin:"0 0 4px"}}>Exercise Library</h2>
      <p style={{color:"var(--faint)",fontSize:13,marginTop:0,marginBottom:14}}>Dose is a guide, not a rule — quality over quantity.</p>

      {/* hangboard gate — the locked feature */}
      <div className="card" style={{padding:15,marginBottom:16,borderColor:"var(--line)",background:"linear-gradient(180deg,var(--granite2),var(--granite))"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <Lock size={16} style={{color:"var(--deload)"}}/>
          <strong className="disp" style={{fontSize:15}}>Hangboard protocol — locked</strong>
        </div>
        <p style={{margin:0,fontSize:13,color:"var(--chalk-dim)",lineHeight:1.5}}>Unlocks only when all three are true: you can comfortably hang bodyweight on a ~20mm edge for several seconds, you're completely free of finger pain, and you have a solid stretch of consistent climbing behind you. Until then, your fingers get stronger from climbing itself.</p>
      </div>

      {cats.map(cat=>(
        <div key={cat} style={{marginBottom:14}}>
          <div className="disp" style={{fontSize:13,color:"var(--rope)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
            {React.createElement(CAT_ICON[cat]||Activity,{size:15})}{cat}
          </div>
          {EX.filter(e=>e.c===cat).map(e=>{ const g=guideFor(e); return (
            <div key={e.n} className="card" style={{padding:13,marginBottom:8,cursor:"pointer"}} onClick={()=>setOpen(open===e.n?null:e.n)}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                <strong style={{fontSize:14,display:"flex",alignItems:"center",gap:6}}>{e.g&&<Lock size={12} style={{color:"var(--faint)"}}/>}{e.n}</strong>
                <span className="mono" style={{fontSize:10,color:"var(--faint)",whiteSpace:"nowrap"}}>{e.d}</span>
              </div>
              {open===e.n && (
                <div className="fadein" style={{marginTop:10,display:"grid",gridTemplateColumns:"96px minmax(0,1fr)",gap:12,alignItems:"start"}}>
                  <MovementDemo id={g.demoId} compact label={e.n}/>
                  <div style={{minWidth:0}}>
                    <p style={{margin:"0 0 6px",fontSize:13,lineHeight:1.5}}><span style={{color:"var(--moss)"}}>Set up: </span>{g.setup}</p>
                    <p style={{margin:"0 0 6px",fontSize:13,lineHeight:1.5,color:"var(--chalk-dim)"}}><span style={{color:"var(--rope)"}}>Count: </span>{g.repCounting}</p>
                    <p style={{margin:"0 0 6px",fontSize:13,lineHeight:1.5,color:"var(--chalk-dim)"}}><span style={{color:"var(--deload)"}}>Watch: </span>{g.commonMistake}</p>
                  </div>
                </div>
              )}
            </div>
          );})}
        </div>
      ))}
    </div>
  );
}

/* ============================ MANAGE (import/export) ============================ */
function Manage({ data, onReplace, setPlan, setSchedule, onClose }){
  const sc=data.activeCycle?.schedule||data.schedule||{};
  const [json,setJson]=useState("");
  const [msg,setMsg]=useState("");
  const [blockDraft,setBlockDraft]=useState(JSON.stringify(sc.travelBlocks||[],null,2));
  const exportAll=()=>setJson(exportBackup(data));
  const importAll=()=>{
    try{
      const result=importBackup(json,data);
      if(result.ok){ onReplace(result.data); setBlockDraft(JSON.stringify((result.data.activeCycle?.schedule||result.data.schedule||{}).travelBlocks||[],null,2)); setMsg("✓ Backup imported"); }
    }
    catch(e){ setMsg("✗ "+e.message); }
  };
  const saveBlocks=()=>{
    try{
      const blocks=JSON.parse(blockDraft||"[]");
      if(!Array.isArray(blocks)) throw new Error("Travel blocks must be an array");
      setSchedule(s=>({...s,travelBlocks:blocks,lastRescheduleUndo:null}));
      setMsg("✓ Travel blocks saved");
    } catch(e){ setMsg("✗ "+e.message); }
  };
  return (
    <div className="ct-root" style={{position:"fixed",inset:0,zIndex:60,overflowY:"auto"}}>
      <div style={{position:"relative",zIndex:1,maxWidth:560,margin:"0 auto",padding:"20px 16px 40px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h2 className="disp" style={{fontSize:22,margin:0}}>Manage plan</h2>
          <button className="btn btn-ghost" style={{padding:8}} onClick={onClose}><X size={18}/></button>
        </div>
        <p style={{color:"var(--chalk-dim)",fontSize:14,lineHeight:1.55,marginTop:0}}>
          Back up the whole trainer: plan, logs, metrics, pyramid corrections, schedule, and settings. Plan-only JSON still imports without touching your history.
        </p>
        <div className="card" style={{padding:14,marginBottom:14}}>
          <div className="disp" style={{fontSize:14,color:"var(--rope)",marginBottom:10}}>Schedule</div>
          <Field label="Plan start date"><input className="tinput" type="date" value={sc.startDate||""} onChange={e=>setSchedule(s=>({...s,startDate:e.target.value,lastRescheduleUndo:null}))}/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
            {SESSION_IDS.map(id=>(
              <Field key={id} label={id==="support"?"Support":`Climb ${id.slice(-1)}`}>
                <select className="tinput" value={sc.preferredSessionDays?.[id]??0} onChange={e=>setSchedule(s=>({...s,preferredSessionDays:{...s.preferredSessionDays,[id]:+e.target.value},lastRescheduleUndo:null}))}>
                  {WEEKDAYS.map((d,i)=><option key={d} value={i}>{d}</option>)}
                </select>
              </Field>
            ))}
          </div>
          <Field label="Travel / deload blocks JSON">
            <textarea className="tinput mono" rows={5} style={{fontSize:12}} value={blockDraft} onChange={e=>setBlockDraft(e.target.value)}
              placeholder='[{"label":"Victoria","startDate":"2026-06-20","endDate":"2026-06-27"}]'/>
          </Field>
          <button className="btn btn-ghost" style={{width:"100%",padding:10,marginTop:8}} onClick={saveBlocks}>Save travel blocks</button>
        </div>
        <div style={{display:"flex",gap:8,margin:"14px 0"}}>
          <button className="btn btn-ghost" style={{flex:1,padding:11,display:"flex",justifyContent:"center",gap:6,alignItems:"center"}} onClick={exportAll}><Download size={16}/>Export backup</button>
          <button className="btn btn-ghost" style={{flex:1,padding:11,display:"flex",justifyContent:"center",gap:6,alignItems:"center"}} onClick={()=>{setPlan(DEFAULT_PLAN);setMsg("✓ Reset plan to default");}}><RefreshCw size={16}/>Reset plan</button>
        </div>
        <textarea className="tinput mono" rows={12} style={{fontSize:12}} placeholder='Paste a full backup or legacy plan JSON here…' value={json} onChange={e=>setJson(e.target.value)}/>
        <button className="btn btn-rope" style={{width:"100%",padding:12,marginTop:10,display:"flex",justifyContent:"center",gap:6,alignItems:"center"}} onClick={importAll}><Upload size={16}/>Import</button>
        {msg && <div style={{marginTop:10,fontSize:14,color:msg[0]==="✓"?"var(--moss)":"var(--rope)"}}>{msg}</div>}
      </div>
    </div>
  );
}
