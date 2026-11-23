import DrawPath from './DrawPath.jsx';
import { messageOf } from '../messages.js';
import styles from './Wordmark.module.css';

// 서비스명 '한올' 워드마크: 그림 선과 같은 둥근 한 줄 획 (DESIGN.md auth 워드마크)
// 획은 먹색, '올'의 ㅇ만 실 색(주황). 굵기는 크기마다 그림 좌표 단위로 정해 작아도 실처럼 가늘다 (--stroke-wordmark-*-art)
// 그림 좌표 79 × 46. 화면 읽기는 숨긴 글자 '한올'을 읽고, 그림은 건너뛴다
//
// size     'sm'(로그인 폼 위) | 'lg'(오른쪽 패널)
// drawO    false면 '올'의 ㅇ을 비워 둔다. 오른쪽 패널에서는 흘러내리는 실이 그 자리를 한 바퀴 그린다
// svgRef   ㅇ 자리를 재야 하는 쪽(오른쪽 패널)이 그림 위치를 읽는 데 쓴다
// drawPlan 주면 검은 획이 필순대로 한 획씩 그려진다: { han: { delay, duration }, ol: { delay, duration } }. 없으면 처음부터 보인다

export const WORDMARK_VIEW = { width: 79, height: 46 };
export const WORDMARK_O = { cx: 61, cy: 9, r: 7 }; // '올'의 ㅇ

// 필순: 한(ㅎ 꼭지 → 가로획 → ㅇ → ㅏ 세로 → ㅏ 짧은 획 → 받침 ㄴ) / 올(ㅗ 세로 → ㅗ 가로 → 받침 ㄹ). ㅎ의 ㅇ은 위에서 시작해 왼쪽으로 돈다
const STROKES = [
  { d: 'M9 4H17', len: 8, part: 'han' },
  { d: 'M4 10H22', len: 18, part: 'han' },
  { d: 'M13 13A5.5 5.5 0 1 0 13 24A5.5 5.5 0 1 0 13 13', len: 34.6, part: 'han' },
  { d: 'M30 2V31', len: 29, part: 'han' },
  { d: 'M30 15.5H36', len: 6, part: 'han' },
  { d: 'M7 31V43H37', len: 42, part: 'han' },
  { d: 'M61 16V22', len: 6, part: 'ol' },
  { d: 'M47 22H75', len: 28, part: 'ol' },
  { d: 'M49 28H73V34H49V40.5H75', len: 86.5, part: 'ol' },
];
const PART_LENGTH = STROKES.reduce((sum, s) => ({ ...sum, [s.part]: (sum[s.part] ?? 0) + s.len }), {});

// 각 획의 시작·길이: 그 글자에 주어진 시간을 획 길이에 비례해 나눠, 앞 획이 끝나면 다음 획이 이어진다
function strokeTiming(plan) {
  const done = { han: 0, ol: 0 };
  return STROKES.map(({ len, part }) => {
    const { delay, duration } = plan[part];
    const start = delay + (done[part] / PART_LENGTH[part]) * duration;
    done[part] += len;
    return { delay: start, duration: (len / PART_LENGTH[part]) * duration, ease: 'linear' };
  });
}

export default function Wordmark({ size = 'sm', drawO = true, svgRef, drawPlan }) {
  const timing = drawPlan ? strokeTiming(drawPlan) : null;
  return (
    <span className={`${styles.wordmark} ${styles[size]}`}>
      <span className="visually-hidden">{messageOf('SERVICE_NAME')}</span>
      <svg ref={svgRef} className={styles.art} viewBox={`0 0 ${WORDMARK_VIEW.width} ${WORDMARK_VIEW.height}`} aria-hidden="true" focusable="false">
        {STROKES.map(({ d }, i) => (
          <DrawPath key={d} d={d} className={styles.ink} animate={!!timing} step={timing?.[i]} />
        ))}
        {drawO && <circle cx={WORDMARK_O.cx} cy={WORDMARK_O.cy} r={WORDMARK_O.r} className={styles.thread} />}
      </svg>
    </span>
  );
}
