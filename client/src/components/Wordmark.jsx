import { messageOf } from '../messages.js';
import styles from './Wordmark.module.css';

// 서비스명 '한올' 워드마크: 그림 선과 같은 둥근 한 줄 획 (DESIGN.md auth 워드마크)
// 획은 먹색, '올'의 ㅇ만 실 색(주황). 획 굵기는 크기와 상관없이 고정(non-scaling-stroke)이라 작아도 실처럼 가늘다
// 그림 좌표 79 × 46. 화면 읽기는 숨긴 글자 '한올'을 읽고, 그림은 건너뛴다
//
// size     'sm'(로그인 폼 위) | 'lg'(오른쪽 패널)
// drawO    false면 '올'의 ㅇ을 비워 둔다. 오른쪽 패널에서는 흘러내리는 실이 그 자리를 한 바퀴 그린다
// svgRef   ㅇ 자리를 재야 하는 쪽(오른쪽 패널)이 그림 위치를 읽는 데 쓴다

export const WORDMARK_VIEW = { width: 79, height: 46 };
export const WORDMARK_O = { cx: 61, cy: 9, r: 7 }; // '올'의 ㅇ

// 한: ㅎ 꼭지·가로획, ㅏ, 받침 ㄴ / 올: ㅗ, 받침 ㄹ (ㅎ의 ㅇ은 원으로 따로)
const STROKES = 'M9 4H17 M4 10H22 M30 2V31 M30 15.5H36 M7 31V43H37 M61 16V22 M47 22H75 M49 28H73V34H49V40.5H75';

export default function Wordmark({ size = 'sm', drawO = true, svgRef }) {
  return (
    <span className={`${styles.wordmark} ${styles[size]}`}>
      <span className="visually-hidden">{messageOf('SERVICE_NAME')}</span>
      <svg ref={svgRef} className={styles.art} viewBox={`0 0 ${WORDMARK_VIEW.width} ${WORDMARK_VIEW.height}`} aria-hidden="true" focusable="false">
        <path d={STROKES} className={styles.ink} />
        <circle cx="13" cy="18.5" r="5.5" className={styles.ink} />
        {drawO && <circle cx={WORDMARK_O.cx} cy={WORDMARK_O.cy} r={WORDMARK_O.r} className={styles.thread} />}
      </svg>
    </span>
  );
}
