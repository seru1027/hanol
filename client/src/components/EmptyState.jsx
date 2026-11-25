import styles from './EmptyState.module.css';
import { THREAD_LOOP } from './threadLoop.js';

// 목록이 비었을 때 상자 안 가운데: 멈춘 실 고리 + 제목 + 설명 (client/DESIGN.md list-table 빈 상태)
// 고리는 로딩과 같은 파비콘 경로지만 움직이지 않는다. 꾸밈이라 화면 읽기에서 뺀다
// 나머지 props(ref·tabIndex 등)는 바깥 div로 넘긴다 (React 19는 ref도 보통 prop으로 받는다)
export default function EmptyState({ title, desc, ...rest }) {
  return (
    <div className={styles.empty} {...rest}>
      <svg className={styles.loop} viewBox={THREAD_LOOP.viewBox} aria-hidden="true" focusable="false">
        <path d={THREAD_LOOP.d} strokeWidth={THREAD_LOOP.strokeWidth} />
      </svg>
      <p className={styles.title}>{title}</p>
      {desc && <p className={styles.desc}>{desc}</p>}
    </div>
  );
}
