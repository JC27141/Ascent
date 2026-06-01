import React, { useState, useEffect, useRef } from "react";
import {
  Check, X, Lock, Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  Plus, AlertTriangle, Settings, Upload, Download, Pencil, Mountain,
  Activity, Flame, Footprints, Dumbbell, Hand, Wind, RefreshCw, Info
} from "lucide-react";

/* ============================ THEME ============================ */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Spline+Sans:wght@400;500;600&family=Spline+Sans+Mono:wght@500;600&display=swap');
:root{
  --granite:#19150f; --granite2:#221c14; --surface:#2a2218; --surface2:#332a1f;
  --line:#46392b; --chalk:#f3ece0; --chalk-dim:#b6a890; --faint:#7d6f5b;
  --rope:#d4673a; --rope-soft:#a44e2c; --deload:#d99a2b; --test:#6699b3; --moss:#9bab63;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
.ct-root{font-family:'Spline Sans',system-ui,sans-serif;color:var(--chalk);background:
  radial-gradient(900px 600px at 80% -10%, rgba(212,103,58,.10), transparent 60%),
  radial-gradient(700px 500px at -10% 110%, rgba(102,153,179,.08), transparent 55%),
  var(--granite);min-height:100%;}
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
const SCHEMA_VERSION = 1;
const APP_DATA_KEY = "ascent_app_data_v1";
const SESSION_IDS = ["climb1", "climb2", "climb3", "support"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DEFAULT_SCHEDULE = {
  startDate: "",
  preferredSessionDays: { climb1:1, climb2:3, climb3:5, support:6 },
  travelBlocks: [],
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
          {list.map(e=>(
            <button key={e.n} onClick={()=>onDrill&&onDrill(e.n)} className="card" style={{padding:13,textAlign:"left",cursor:"pointer",background:"var(--granite)",color:"var(--chalk)"}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                <strong style={{fontSize:14}}>{e.n}</strong>
                <span className="mono" style={{fontSize:10,color:"var(--faint)",whiteSpace:"nowrap"}}>{e.d}</span>
              </div>
            </button>
          ))}
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
const makeDefaultAppData = () => ({
  schemaVersion: SCHEMA_VERSION,
  plan: DEFAULT_PLAN,
  logs: {},
  metrics: [],
  sends: DEFAULT_SENDS,
  schedule: { ...DEFAULT_SCHEDULE, startDate: today() },
  settings: DEFAULT_SETTINGS,
});
function normalizeAppData(raw){
  const base=makeDefaultAppData();
  return {
    ...base,
    ...(raw||{}),
    schemaVersion: SCHEMA_VERSION,
    plan: raw?.plan?.weeks ? raw.plan : base.plan,
    logs: raw?.logs && typeof raw.logs==="object" ? raw.logs : base.logs,
    metrics: Array.isArray(raw?.metrics) ? raw.metrics : base.metrics,
    sends: raw?.sends && typeof raw.sends==="object" ? raw.sends : base.sends,
    schedule: {
      ...base.schedule,
      ...(raw?.schedule||{}),
      preferredSessionDays: {
        ...base.schedule.preferredSessionDays,
        ...(raw?.schedule?.preferredSessionDays||{}),
      },
      travelBlocks: Array.isArray(raw?.schedule?.travelBlocks) ? raw.schedule.travelBlocks : [],
    },
    settings: { ...base.settings, ...(raw?.settings||{}) },
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
function saveAppData(next){ writeJson(APP_DATA_KEY, normalizeAppData(next)); }
function exportBackup(data){ return JSON.stringify({ ...normalizeAppData(data), exportedAt:new Date().toISOString() }, null, 2); }
function importBackup(json, current){
  const parsed=JSON.parse(json);
  if(parsed?.weeks && Array.isArray(parsed.weeks)){
    return { ok:true, data:{ ...current, plan:parsed } };
  }
  if(!parsed?.plan?.weeks) throw new Error("Backup needs either a plan weeks array or a full app backup.");
  return { ok:true, data:normalizeAppData({ ...current, ...parsed }) };
}

/* ============================ HELPERS ============================ */
const exByName = (n) => EX.find((e) => e.n === n);
const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const today = () => new Date().toISOString().slice(0,10);
const PHASE_COLOR = { deload:"var(--deload)", test:"var(--test)", normal:"var(--rope)" };
const CAT_ICON = { Shoulder:Wind, "Pull-ups":Dumbbell, Core:Activity, "Foot/Ankle":Footprints, Fingers:Hand, Technique:Mountain, Antagonist:Dumbbell };
const logKey = (week, sid) => `${week}-${sid}`;
const addDays = (date, days) => {
  const d=new Date(`${date}T12:00:00`);
  d.setDate(d.getDate()+days);
  return d.toISOString().slice(0,10);
};
const scheduledDate = (schedule, weekNum, sid) => addDays(schedule.startDate || today(), (weekNum-1)*7 + +(schedule.preferredSessionDays?.[sid] ?? 0));
const sessionTitle = (s) => s?.day || "Session";
function activeTravelBlock(schedule, date){
  return (schedule.travelBlocks||[]).find(b=>b.startDate && b.endDate && date>=b.startDate && date<=b.endDate);
}
function scheduleItems(plan, schedule, logs){
  return plan.weeks.flatMap(w=>w.sessions.map(s=>{
    const date=scheduledDate(schedule,w.week,s.id);
    return { week:w.week, phase:w.phase, type:w.type, session:s, date, log:logs[logKey(w.week,s.id)], travel:activeTravelBlock(schedule,date) };
  })).sort((a,b)=>a.date.localeCompare(b.date));
}
function currentScheduleState(plan, schedule, logs){
  const items=scheduleItems(plan,schedule,logs);
  const t=today();
  const open=items.filter(i=>!i.log || i.log.status==="skip");
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
function Runner({ week, session, onClose, onSave, spacingWarn, existingLog }){
  const sessionRoutines=session.routines||[];
  const steps=[];
  steps.push({kind:"warmup"});
  if(session.id!=="support") steps.push({kind:"climb"});
  sessionRoutines.forEach(r=>steps.push({kind:"routine",rkey:r}));
  steps.push({kind:"log"});
  const [i,setI]=useState(0);
  const [status,setStatus]=useState(existingLog?.status || "Y");
  const [rpe,setRpe]=useState(existingLog?.rpe || 6);
  const [pain,setPain]=useState(!!existingLog?.pain);
  const [notes,setNotes]=useState(existingLog?.notes || "");
  const [rd,setRd]=useState(existingLog?.routinesDone || sessionRoutines); // routines done
  const [volume,setVolume]=useState(existingLog?.volumeByGrade || {});
  const [d,setD]=useState(null);
  const step=steps[i];
  const last=i===steps.length-1;
  const toggleR=(r)=>setRd(p=>p.includes(r)?p.filter(x=>x!==r):[...p,r]);

  const save=()=>{ onSave({status,rpe,pain,notes,routinesDone:rd,date:today(),volumeByGrade:volume}); };
  const bumpVolume=(g,delta)=>setVolume(v=>({ ...v, [g]:Math.max(0,(+v[g]||0)+delta) }));

  return (
    <div className="ct-root" style={{position:"fixed",inset:0,zIndex:50,overflowY:"auto"}}>
      {d && <DrillSheet name={d} onClose={()=>setD(null)}/>}
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
                  {session.drills.map(dn=>{ const e=exByName(dn); if(!e) return null; const det=DETAIL[dn]||{};
                    return (
                      <button key={dn} onClick={()=>setD(dn)} className="card" style={{padding:14,textAlign:"left",cursor:"pointer",background:"var(--surface)",color:"var(--chalk)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                          <strong className="disp" style={{fontSize:16}}>{e.n}</strong>
                          <span className="mono" style={{fontSize:11,color:"var(--faint)",whiteSpace:"nowrap"}}>{e.d}</span>
                        </div>
                        {det.look && <p style={{margin:"6px 0 0",fontSize:14,color:"var(--chalk-dim)",lineHeight:1.5}}>{det.look}</p>}
                        <span style={{fontSize:12,color:"var(--rope)",marginTop:6,display:"inline-block"}}>How &amp; why →</span>
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
                {EX.filter(e=>e.c===cat && (!e.g || e.g<=week)).map(e=>{ const det=DETAIL[e.n]||{};
                  return (
                  <button key={e.n} onClick={()=>setD(e.n)} className="card" style={{padding:14,textAlign:"left",cursor:"pointer",background:"var(--surface)",color:"var(--chalk)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                      <strong className="disp" style={{fontSize:16}}>{e.n}</strong>
                      <span className="mono" style={{fontSize:11,color:"var(--faint)",whiteSpace:"nowrap"}}>{e.d}</span>
                    </div>
                    <p style={{margin:"6px 0 0",fontSize:14,color:"var(--chalk-dim)",lineHeight:1.5}}>{det.look||e.h}</p>
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
              <h2 className="disp" style={{fontSize:26,margin:"0 0 14px"}}>Log it</h2>
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
              <button className="btn btn-rope" style={{width:"100%",padding:14,fontSize:16}} onClick={save}>Save session</button>
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

/* ============================ APP ============================ */
export default function App(){
  const [plan,setPlan]=useState(DEFAULT_PLAN);
  const [logs,setLogs]=useState({});
  const [metrics,setMetrics]=useState([]);
  const [schedule,setSchedule]=useState({ ...DEFAULT_SCHEDULE, startDate: today() });
  const [settings,setSettings]=useState(DEFAULT_SETTINGS);
  const [loaded,setLoaded]=useState(false);
  const [tab,setTab]=useState("today");
  const [curWeek,setCurWeek]=useState(1);
  const [runner,setRunner]=useState(null); // {week, session}
  const [edit,setEdit]=useState(false);
  const [manage,setManage]=useState(false);
  const [sends,setSends]=useState(DEFAULT_SENDS);
  const [drill,setDrill]=useState(null);
  const [routine,setRoutine]=useState(null);

  useEffect(()=>{
    const data=loadAppData();
    setPlan(data.plan);
    setLogs(data.logs);
    setMetrics(data.metrics);
    setSends(data.sends);
    setSchedule(data.schedule);
    setSettings(data.settings);
    setCurWeek(currentScheduleState(data.plan,data.schedule,data.logs).currentWeek);
    setLoaded(true);
  },[]);
  useEffect(()=>{
    if(loaded) saveAppData({ schemaVersion:SCHEMA_VERSION, plan, logs, metrics, sends, schedule, settings });
  },[plan,logs,metrics,sends,schedule,settings,loaded]);

  const week=plan.weeks.find(w=>w.week===curWeek)||plan.weeks[0];
  const totalSessions=plan.weeks.length*4;
  const doneCount=Object.values(logs).filter(l=>l.status==="Y"||l.status==="partial").length;
  const spacingWarn=daysSince(lastClimbDate(logs))<2;
  const latestFlash=[...metrics].reverse().find(m=>m.flash!=null)?.flash ?? null;
  const schedState=currentScheduleState(plan,schedule,logs);
  const combinedSends=addSendMaps(sends,sendsFromLogs(logs));

  const saveLog=(wk,sid,data)=>{ setLogs(p=>({...p,[logKey(wk,sid)]:data})); setRunner(null); };
  const replaceAppData=(data)=>{
    setPlan(data.plan); setLogs(data.logs); setMetrics(data.metrics); setSends(data.sends);
    setSchedule(data.schedule); setSettings(data.settings); setCurWeek(currentScheduleState(data.plan,data.schedule,data.logs).currentWeek);
  };

  return (
    <div className="ct-root" style={{minHeight:"100vh"}}>
      <style>{STYLE}</style>
      {runner && <Runner week={runner.week} session={runner.session}
        spacingWarn={spacingWarn && runner.session.id!=="support"}
        existingLog={logs[logKey(runner.week,runner.session.id)]}
        onClose={()=>setRunner(null)} onSave={d=>saveLog(runner.week,runner.session.id,d)}/>}

      <div style={{position:"relative",zIndex:1,maxWidth:560,margin:"0 auto",padding:"20px 16px 100px"}}>
        {/* header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:"var(--rope)",display:"flex",alignItems:"center",justifyContent:"center"}}><Mountain size={20} color="#1a120c"/></div>
            <div>
              <div className="disp" style={{fontWeight:800,fontSize:18,lineHeight:1}}>Ascent</div>
              <div style={{fontSize:11,color:"var(--faint)"}}>{plan.name}</div>
            </div>
          </div>
          <button className="btn btn-ghost" style={{padding:9}} onClick={()=>setManage(true)}><Settings size={18}/></button>
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
          return (
          <div className="stagger">
            <div className="card" style={{padding:15,marginBottom:14,borderColor:schedState.due.length?"var(--rope)":schedState.overdue.length?"var(--deload)":"var(--line)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:10,marginBottom:9}}>
                <div className="disp" style={{fontSize:15,color:"var(--rope)"}}>Today</div>
                <button className="btn btn-ghost" style={{padding:"5px 9px",fontSize:12}} onClick={()=>setManage(true)}>Schedule</button>
              </div>
              <div style={{fontSize:13,color:"var(--chalk-dim)",lineHeight:1.5}}>
                {schedState.due.length>0 ? (
                  <>Due now: {schedState.due.map(i=>`W${i.week} ${sessionTitle(i.session)}`).join(", ")}.</>
                ) : schedState.overdue.length>0 ? (
                  <>Overdue: {schedState.overdue.slice(0,2).map(i=>`W${i.week} ${sessionTitle(i.session)} (${i.date})`).join(", ")}.</>
                ) : schedState.upcoming ? (
                  <>Next up: W{schedState.upcoming.week} {sessionTitle(schedState.upcoming.session)} on {schedState.upcoming.date}.</>
                ) : <>All scheduled sessions are logged.</>}
              </div>
              {travelToday && (
                <div style={{marginTop:10,padding:"9px 10px",borderRadius:10,background:"var(--granite)",border:"1px solid var(--deload)",fontSize:13,color:"var(--chalk-dim)"}}>
                  {travelToday.label || "Travel block"} is active today. Treat this as a prompt to go lighter, slide sessions, or use deload-style climbing.
                </div>
              )}
            </div>
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
              return (
                <div key={s.id} className="card" style={{padding:15,marginBottom:11,
                  borderLeft:`3px solid ${sTravel?"var(--deload)":wk.type==="deload"?"var(--deload)":wk.type==="test"?"var(--test)":"var(--line)"}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                    <div style={{flex:1}}>
                      <div className="disp" style={{fontSize:13,color:"var(--faint)",letterSpacing:".04em",textTransform:"uppercase"}}>{s.day}</div>
                      <div className="mono" style={{fontSize:11,color:"var(--faint)",marginTop:2}}>{sDate}</div>
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
                {w.sessions.map((s,si)=>(
                  <div key={s.id} style={{padding:"7px 0",borderTop:si?"1px solid var(--line)":"none"}}>
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
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ===== METRICS ===== */}
        {tab==="metrics" && <Metrics metrics={metrics} setMetrics={setMetrics} planLen={plan.weeks.length}/>}

        {/* ===== LIBRARY ===== */}
        {tab==="library" && <Library/>}
      </div>

      {/* tab bar */}
      <div className="tabbar" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:40}}>
        <div style={{maxWidth:560,margin:"0 auto",display:"flex",justifyContent:"space-around",padding:"10px 8px 14px"}}>
          {[["today",Flame,"Today"],["plan",Mountain,"Plan"],["metrics",Activity,"Metrics"],["library",Hand,"Library"]].map(([t,Icon,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab===t?"var(--rope)":"var(--faint)"}}>
              <Icon size={22}/><span className="disp" style={{fontSize:11,fontWeight:700}}>{l}</span>
            </button>
          ))}
        </div>
      </div>

      {manage && <Manage data={{ schemaVersion:SCHEMA_VERSION, plan, logs, metrics, sends, schedule, settings }}
        onReplace={replaceAppData} setPlan={setPlan} setSchedule={setSchedule} onClose={()=>setManage(false)}/>}
      {drill && <DrillSheet name={drill} onClose={()=>setDrill(null)}/>}
      {routine && <RoutineSheet rkey={routine} week={curWeek} onClose={()=>setRoutine(null)} onDrill={(n)=>setDrill(n)}/>}
    </div>
  );
}

/* ============================ METRICS ============================ */
function Metrics({ metrics, setMetrics, planLen }){
  const [w,setW]=useState(metrics.length?"" : 1);
  const [pu,setPu]=useState(""); const [fl,setFl]=useState(""); const [pr,setPr]=useState("");
  const [sl,setSl]=useState(""); const [pn,setPn]=useState("");
  const add=()=>{ if(!w) return;
    const entry={week:+w,date:today(),pullups:+pu||null,flash:+fl||null,project:+pr||null,sleep:+sl||null,pain:pn};
    setMetrics(m=>[...m.filter(x=>x.week!==+w),entry].sort((a,b)=>a.week-b.week));
    setPu("");setFl("");setPr("");setSl("");setPn("");
  };
  const first=metrics.find(m=>m.pullups!=null);
  const lastM=[...metrics].reverse().find(m=>m.pullups!=null);
  const delta=(first&&lastM&&first.week!==lastM.week)?lastM.pullups-first.pullups:null;
  const pts=metrics.filter(m=>m.pullups!=null);

  return (
    <div className="stagger">
      <h2 className="disp" style={{fontSize:22,margin:"0 0 12px"}}>Progress Metrics</h2>

      {delta!=null && (
        <div className="card" style={{padding:16,marginBottom:14,display:"flex",alignItems:"center",gap:14}}>
          <div className="disp" style={{fontSize:40,color:delta>=0?"var(--moss)":"var(--rope)",lineHeight:1}}>{delta>=0?"+":""}{delta}</div>
          <div style={{fontSize:13,color:"var(--chalk-dim)"}}>clean pull-ups gained<br/>since week {first.week}. The bigger gains are in how efficiently you move — they won't show as a number.</div>
        </div>
      )}

      {pts.length>1 && <Spark pts={pts}/>}

      <div className="card" style={{padding:15,marginBottom:14}}>
        <div className="disp" style={{fontSize:14,marginBottom:10,color:"var(--rope)"}}>Log this week's numbers</div>
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
        <button className="btn btn-rope" style={{width:"100%",padding:11,marginTop:12,display:"flex",justifyContent:"center",gap:6,alignItems:"center"}} onClick={add}><Plus size={16}/>Save entry</button>
      </div>

      {metrics.length>0 && (
        <div className="card" style={{padding:6}}>
          {metrics.map(m=>(
            <div key={m.week} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 10px",borderBottom:"1px solid var(--line)"}}>
              <div className="disp" style={{width:60,fontSize:13,color:"var(--faint)"}}>Wk {m.week}</div>
              <div className="mono" style={{flex:1,fontSize:13}}>
                {m.pullups!=null&&<span>{m.pullups} PU&nbsp;&nbsp;</span>}
                {m.flash!=null&&<span style={{color:"var(--chalk-dim)"}}>V{m.flash} flash&nbsp;&nbsp;</span>}
                {m.project!=null&&<span style={{color:"var(--chalk-dim)"}}>V{m.project} proj</span>}
              </div>
              {m.pain && <AlertTriangle size={14} style={{color:"var(--deload)"}}/>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function Field({label,children}){return(<label style={{display:"block"}}><div style={{fontSize:11,color:"var(--faint)",marginBottom:4}}>{label}</div>{children}</label>);}
function Spark({pts}){
  const w=480,h=90,pad=10;
  const xs=pts.map(p=>p.week), ys=pts.map(p=>p.pullups);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const X=v=>pad+((v-minX)/((maxX-minX)||1))*(w-2*pad);
  const Y=v=>h-pad-((v-minY)/((maxY-minY)||1))*(h-2*pad);
  const d=pts.map((p,i)=>`${i?"L":"M"}${X(p.week)},${Y(p.pullups)}`).join(" ");
  return (
    <div className="card" style={{padding:14,marginBottom:14}}>
      <div className="disp" style={{fontSize:13,color:"var(--rope)",marginBottom:6}}>Pull-up trend</div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:90}}>
        <path d={d} fill="none" stroke="var(--rope)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=>(<circle key={i} cx={X(p.week)} cy={Y(p.pullups)} r="3.5" fill="var(--moss)"/>))}
      </svg>
    </div>
  );
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
          {EX.filter(e=>e.c===cat).map(e=>(
            <div key={e.n} className="card" style={{padding:13,marginBottom:8,cursor:"pointer"}} onClick={()=>setOpen(open===e.n?null:e.n)}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                <strong style={{fontSize:14,display:"flex",alignItems:"center",gap:6}}>{e.g&&<Lock size={12} style={{color:"var(--faint)"}}/>}{e.n}</strong>
                <span className="mono" style={{fontSize:10,color:"var(--faint)",whiteSpace:"nowrap"}}>{e.d}</span>
              </div>
              {open===e.n && (
                <div className="fadein" style={{marginTop:10,display:"flex",gap:12}}>
                  {DETAIL[e.n]?.fig && <div style={{width:74,height:74,flexShrink:0,background:"var(--granite)",borderRadius:10,border:"1px solid var(--line)",padding:5}}><Figure id={DETAIL[e.n].fig}/></div>}
                  <div>
                    {DETAIL[e.n]?.look && <p style={{margin:"0 0 6px",fontSize:13,lineHeight:1.5}}><span style={{color:"var(--moss)"}}>Looks like — </span>{DETAIL[e.n].look}</p>}
                    <p style={{margin:0,fontSize:13,color:"var(--chalk-dim)",lineHeight:1.5}}>{e.h}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ============================ MANAGE (import/export) ============================ */
function Manage({ data, onReplace, setPlan, setSchedule, onClose }){
  const [json,setJson]=useState("");
  const [msg,setMsg]=useState("");
  const [blockDraft,setBlockDraft]=useState(JSON.stringify(data.schedule.travelBlocks||[],null,2));
  const exportAll=()=>setJson(exportBackup(data));
  const importAll=()=>{
    try{
      const result=importBackup(json,data);
      if(result.ok){ onReplace(result.data); setBlockDraft(JSON.stringify(result.data.schedule.travelBlocks||[],null,2)); setMsg("✓ Backup imported"); }
    }
    catch(e){ setMsg("✗ "+e.message); }
  };
  const saveBlocks=()=>{
    try{
      const blocks=JSON.parse(blockDraft||"[]");
      if(!Array.isArray(blocks)) throw new Error("Travel blocks must be an array");
      setSchedule(s=>({...s,travelBlocks:blocks}));
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
          <Field label="Plan start date"><input className="tinput" type="date" value={data.schedule.startDate||""} onChange={e=>setSchedule(s=>({...s,startDate:e.target.value}))}/></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
            {SESSION_IDS.map(id=>(
              <Field key={id} label={id==="support"?"Support":`Climb ${id.slice(-1)}`}>
                <select className="tinput" value={data.schedule.preferredSessionDays?.[id] ?? 0} onChange={e=>setSchedule(s=>({...s,preferredSessionDays:{...s.preferredSessionDays,[id]:+e.target.value}}))}>
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
