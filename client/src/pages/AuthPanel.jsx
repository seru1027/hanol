import { motion, useReducedMotion } from 'motion/react';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import Wordmark, { WORDMARK_O, WORDMARK_VIEW } from '../components/Wordmark.jsx';
import { messageOf } from '../messages.js';
import styles from './AuthPanel.module.css';

// SCR-AUTH-01 ① 오른쪽 패널: 실뜨기 한 줄 그림 + 서비스명·슬로건·뜻 (DESIGN.md auth 오른쪽 패널)
// 그림은 Figma 04 Components 'auth-panel-illustration (P3)'에서 SVG로 내보낸 선 (바탕은 CSS가 칠한다)
// 실은 한 올: 손가락 고리를 차례로 걸며 실뜨기 모양을 만든 뒤, 풀려 내려와 워드마크 '올'의 ㅇ을 한 바퀴 그린다

const VIEW_W = 734; // 그림 좌표 (1440 화면의 패널 크기)
const VIEW_H = 900;

// 손 세 개: 위 두 손 + 오른쪽 위 손을 복제해 돌린 아래 손 (검지 끝을 갈고리로). 안쪽을 바탕색으로 채워 실이 손 뒤로 지나간다
const HANDS = [
  'M88 0C96 44 103 92 120 132C129 155 139 170 145 190C151 210 151 233 163 246C169 253 180 251 182 242C185 232 175 210 178 199C180 193 184 197 188 206L214 284C218 297 224 305 232 302C241 299 238 288 235 278L216 214C214 207 218 205 222 212L246 277C250 289 256 296 263 292C271 288 267 277 264 268L243 204C241 198 245 197 248 203L270 253C274 264 281 272 288 267C295 262 291 253 287 243L266 192C263 186 267 184 271 190L288 218C294 228 301 232 306 227C312 221 306 211 301 203L274 160C263 142 243 130 229 113C209 88 198 47 187 0',
  'M552 0C548 43 541 80 525 111C514 132 496 145 481 164L443 216C436 225 434 234 440 238C447 243 453 236 459 228L485 197C490 191 494 194 490 201L454 265C449 275 448 284 455 287C463 291 469 281 474 272L506 216C510 209 514 211 511 218L484 278C479 289 479 298 486 300C494 303 500 293 504 284L534 223C537 217 541 218 539 225L524 270C520 282 522 289 529 290C538 292 542 282 545 273L565 218C570 204 575 194 580 194C585 195 582 209 578 221C573 235 574 247 582 249C592 253 599 238 605 223C611 205 610 188 616 171C631 127 643 68 651 0',
  'M886.39 712.15L609.26 552.15C574.02 527.19 545.48 502.63 526.63 473.27C513.94 453.25 511.69 431.16 502.73 408.67L476.7 349.76C472.4 339.2 465.61 332.96 459.15 336.16C451.32 339.72 454.38 348.42 458.31 357.61L472.15 395.63C474.85 402.96 470.25 404.93 466.19 397.96L437.02 349.3C439.43 343.8 441.71 350.25 444.93 342.92C449.35 332.85 429.27 324.03 424.85 334.1C420.83 343.26 411.01 348.72 418.28 360.69L445.2 404.32C449.26 411.28 445.53 413.75 440.97 407.65L402.5 354.26C395.48 344.43 387.68 339.93 382.45 345C375.85 350.43 381.51 360.62 387.31 368.59L425.14 425.07C428.83 430.66 425.97 433.63 420.9 428.4L389.43 392.91C381.04 383.44 373.98 381.67 369.61 387.24C363.38 394.03 370.04 402.49 376.33 409.59L413.97 454.41C423.59 465.74 429.75 475.07 427.25 479.4C423.88 483.23 413.26 473.64 404.87 464.17C395.24 452.84 384.35 447.71 378.62 453.64C370.15 460.3 379.65 473.86 389.64 486.55C402.22 500.75 417.45 508.38 429.17 522.08C459.77 557.07 504.87 596.96 559.76 637.89L836.89 797.89',
];

// 손가락 고리의 앞쪽 띠 (그림 좌표, 왼쪽 끝 → 오른쪽 끝)
// 꺾은선 path(M·L·H·V)를 점 목록으로
function pts(d) {
  const out = [];
  let x = 0;
  let y = 0;
  const re = /([MLHV])([^MLHV]*)/g;
  for (const [, cmd, args] of d.matchAll(re)) {
    const n = args.trim().split(/[\s,]+/).map(Number);
    if (cmd === 'H') x = n[0];
    else if (cmd === 'V') y = n[0];
    else [x, y] = n;
    out.push([x, y]);
  }
  return out;
}
const LOOP = {
  L1: pts('M207.4 276.3L207.9 277.4L209 278.3L210.6 279.1L212.6 279.6L215.1 279.9L217.8 280L220.7 279.7L223.7 279.3L226.7 278.6L229.5 277.7L232 276.7L234.2 275.5L235.9 274.3L237.1 273L237.8 271.7V270.5'), // 왼쪽 위 손, 아래 손가락
  L2: pts('M279.9 214.5L280.7 215.4L281.9 216L283.6 216.3H285.6L287.9 215.9L290.4 215.2L293 214.2L295.5 213L298 211.6L300.2 210L302.2 208.3L303.7 206.6L304.9 205L305.6 203.4L305.8 202.1L305.5 200.9'), // 왼쪽 위 손, 안쪽 손가락
  R1: pts('M485.1 268.2L484.9 269.4L485.2 270.7L486 272.2L487.3 273.6L489 275L491 276.4L493.3 277.6L495.7 278.6L498.2 279.4L500.7 280L503.1 280.3H505.3L507.2 280.1L508.8 279.6L509.9 278.8L510.5 277.8'), // 오른쪽 위 손, 가운데 손가락
  R2: pts('M579.2 210.2L579.3 211.4L580 212.7L581.3 214L583.1 215.2L585.4 216.4L588 217.4L590.9 218.3L594 218.9L597.1 219.3L600.1 219.5H602.9L605.4 219.1L607.5 218.6L609.2 217.8L610.3 216.9L610.8 215.8'), // 오른쪽 위 손, 엄지
};
const HOOK = [446, 352]; // 아래 손 검지 갈고리 안쪽: 실이 모이는 곳
const rev = (a) => [...a].reverse();

// 한붓그리기: 같은 선을 두 번 지나지 않고 실 여섯 가닥과 고리 넷을 모두 지나 흘러내리는 실로 이어진다
//   ①(L1) → ②(R1) 감고 → 갈고리 → ③(R2) 감고 → ④(L2) 감고 → 갈고리 → ① 감고 → 흘러내림
// 고리를 지날 때는 한쪽 끝으로 들어가 앞쪽 띠를 따라 반대쪽 끝으로 나온다
const KNOT = [
  LOOP.L1.at(-1),
  ...LOOP.R1,
  HOOK,
  ...rev(LOOP.R2),
  ...rev(LOOP.L2),
  HOOK,
  ...rev(LOOP.L1),
];
const FALL = [[200, 400], [180, 530], [140, 640]]; // ① 바깥쪽 끝에서 풀려 내려오는 실 (3차 곡선의 조절점 두 개 + 끝)

// 움직임 (DESIGN.md motion: 열림만 움직임, 움직임 줄이기 존중). 이 탭에서 처음 한 번만
const DRAWN_KEY = 'hanol.authThreadDrawn';
// 손이 먼저 들어온다: 각자 팔이 뻗은 방향의 화면 밖 쪽에서 60만큼 미끄러져 들어와 멈춘다 (그림 좌표)
const EASE_OUT = [0.23, 1, 0.32, 1]; // --ease-out
const HAND_FROM = [[-17, -58], [21, -56], [52, 30]]; // 왼쪽 위 손, 오른쪽 위 손, 오른쪽 아래 손
const HAND_STEP = (i) => ({ delay: i * 0.08, duration: 0.5, ease: EASE_OUT });
const HANDS_IN = 0.6; // 손이 거의 자리를 잡은 때. 실은 여기서 시작한다
// 실 한 올: 고리에서 천천히 풀리기 시작해(기울기 0) 일정한 속도로 손가락을 걸고, 끝은 일정한 속도(기울기 1)로 ㅇ에 넘겨준다
const THREAD_SPEED = 1000; // px/초. 길이에 비례한 시간이라 화면 크기가 달라도 같은 속도로 풀린다
const THREAD_EASE = [0.3, 0, 0.75, 0.75];
// ㅇ 한 바퀴: 넘겨받은 속도로 감기 시작해(첫 기울기 ≈ 1000px/초 ÷ 고리 평균 속도) 천천히 멈춘다
const RING_DURATION = 0.45;
const RING_EASE = [0.06, 0.49, 0.3, 1];

function readDrawn() {
  try { return sessionStorage.getItem(DRAWN_KEY) === '1'; } catch { return false; }
}

// 3차 곡선 길이 (점을 촘촘히 찍어 더한다)
function cubicLength(p0, p1, p2, p3) {
  let len = 0;
  let prev = p0;
  for (let i = 1; i <= 40; i++) {
    const t = i / 40;
    const u = 1 - t;
    const p = [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
    len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    prev = p;
  }
  return len;
}

const polylineLength = (a) => a.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - a[i][0], p[1] - a[i][1]), 0);
const xy = (q) => `${q[0]} ${q[1]}`;

// pathLength 0 → 1: 선의 길이만큼 dash를 밀어 처음부터 끝까지 그려지는 것처럼 보인다
function DrawPath({ d, className, step, animate }) {
  if (!animate) return <path d={d} className={className} />;
  return <motion.path d={d} className={className} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={step} />;
}

// 손 하나: 그릴 때만 들어오는 움직임을 준다
function Hand({ d, index, className, animate }) {
  if (!animate) return <path d={d} className={className} />;
  const [x, y] = HAND_FROM[index];
  return (
    <motion.g initial={{ opacity: 0, x, y }} animate={{ opacity: 1, x: 0, y: 0 }} transition={HAND_STEP(index)}>
      <path d={d} className={className} />
    </motion.g>
  );
}

export default function AuthPanel() {
  const reduceMotion = useReducedMotion();
  // 처음 그린 순간의 값으로 고정: 그리는 도중에 기록이 바뀌어도 움직임이 끊기지 않게
  const [animate] = useState(() => !readDrawn());
  const draw = animate && !reduceMotion;
  const maskId = useId();
  const panelRef = useRef(null);
  const markRef = useRef(null);
  // 실 한 올 (패널 픽셀 좌표). 패널 크기와 워드마크 위치를 재야 하므로 그린 뒤에 계산한다
  const [thread, setThread] = useState(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const mark = markRef.current;
    function measure() {
      const p = panel.getBoundingClientRect();
      const m = mark.getBoundingClientRect();
      // 그림은 xMidYMin slice: 패널을 꽉 채우도록 키우고 가로는 가운데, 세로는 위에 맞춘다
      const s = Math.max(p.width / VIEW_W, p.height / VIEW_H);
      const offsetX = (p.width - VIEW_W * s) / 2;
      const toPanel = ([x, y]) => [offsetX + x * s, y * s];
      const knot = KNOT.map(toPanel);
      const [c1, c2, f3] = FALL.map(toPanel);
      const f0 = knot.at(-1);
      // 워드마크 그림 좌표 → 패널 좌표
      const k = m.height / WORDMARK_VIEW.height;
      const cx = m.left - p.left + WORDMARK_O.cx * k;
      const cy = m.top - p.top + WORDMARK_O.cy * k;
      const r = WORDMARK_O.r * k;
      // ㅇ의 왼쪽 위(-150도)로 들어가 한 바퀴 돌고, 조금 더 지나(-120도) 끝난다
      const at = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
      const e = at(-150);
      const a1 = [f3[0] - 20 * s, f3[1] + 40 * s];
      const a2 = [e[0] - 40, e[1] - 6];
      const length = polylineLength(knot) + cubicLength(f0, c1, c2, f3) + cubicLength(f3, a1, a2, e);
      const duration = length / THREAD_SPEED;
      setThread({
        // 실뜨기 → 흘러내림 → ㅇ 입구까지 한 가닥 (실 굵기)
        main: `M ${knot.map(xy).join(' L ')} C ${xy(c1)} ${xy(c2)} ${xy(f3)} C ${xy(a1)} ${xy(a2)} ${xy(e)}`,
        mainStep: { delay: HANDS_IN, duration, ease: THREAD_EASE },
        // 손 앞에 보일 곳: 고리 띠 네 개 (나머지는 손 뒤로 지나간다)
        loops: Object.values(LOOP).map((loop) => `M ${loop.map(toPanel).map(xy).join(' L ')}`),
        // ㅇ 한 바퀴 (워드마크 획 굵기). 실이 닿는 순간 이어서 시작한다
        ring: `M ${xy(e)} A ${r} ${r} 0 1 1 ${xy(at(30))} A ${r} ${r} 0 1 1 ${xy(e)} A ${r} ${r} 0 0 1 ${xy(at(-120))}`,
        ringStep: { delay: HANDS_IN + duration, duration: RING_DURATION, ease: RING_EASE },
      });
    }
    measure();
    try { sessionStorage.setItem(DRAWN_KEY, '1'); } catch { /* 저장이 막힌 브라우저: 매번 그린다 */ }
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <aside ref={panelRef} className={styles.panel} aria-label={messageOf('AUTH_PANEL_LABEL')}>
      {/* 그림은 장식: 뜻은 아래 글자가 말한다. 실 한 올을 같은 시간에 두 겹으로 그린다 — 손 뒤 겹(전체) + 손 앞 겹(고리 띠만) */}
      {thread && (
        <svg className={styles.art} aria-hidden="true" focusable="false">
          <DrawPath d={thread.main} className={styles.thread} animate={draw} step={thread.mainStep} />
        </svg>
      )}
      <svg className={styles.art} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
        {HANDS.map((d, i) => <Hand key={d} d={d} index={i} className={styles.hand} animate={draw} />)}
      </svg>
      {thread && (
        <svg className={styles.art} aria-hidden="true" focusable="false">
          <mask id={maskId} maskUnits="userSpaceOnUse">
            {thread.loops.map((d) => <path key={d} d={d} className={styles.loopMask} />)}
          </mask>
          <g mask={`url(#${maskId})`}>
            {/* 고리 띠 밑의 바탕색 띠: 실이 손가락 앞을 지나는 곳에서 윤곽선을 살짝 끊는다 */}
            <DrawPath d={thread.main} className={styles.loopGap} animate={draw} step={thread.mainStep} />
            <DrawPath d={thread.main} className={styles.thread} animate={draw} step={thread.mainStep} />
          </g>
          <DrawPath d={thread.ring} className={styles.ring} animate={draw} step={thread.ringStep} />
        </svg>
      )}

      <div className={styles.intro}>
        <p className={styles.name}><Wordmark size="lg" drawO={false} svgRef={markRef} /></p>
        <p className={styles.tagline}>
          <span className={styles.accent}>{messageOf('AUTH_PANEL_TAGLINE_ACCENT')}</span>
          {messageOf('AUTH_PANEL_TAGLINE_REST')}
        </p>
        <p className={styles.meaning}>{messageOf('AUTH_PANEL_MEANING')}</p>
      </div>
    </aside>
  );
}
