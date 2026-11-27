import styles from './PageCard.module.css';

// 동아리 안 화면의 카드 하나 (공지·회원·가입 신청 목록, 공지 쓰기·수정. 2026-11-26, Figma 05 목록·쓰기 B)
// 공지 상세처럼 머리와 내용을 한 카드에 담는다. 머리: 작은 동아리명 → 화면 이름(h1) + 개수, 오른쪽 행동 버튼
//
// eyebrow  화면 이름 위 작은 글자 (동아리명). 아직 모르면 생략
// title    화면 이름. 화면의 h1
// count    제목 옆 개수 글자 ('3', '6명'). 목록을 불러온 뒤에만 넘긴다. h1 안에 두어 '회원 6명'으로 함께 읽힌다
// actions  오른쪽 버튼들 (회장·운영진만 등, 넘기는 쪽이 판단)
// children 목록·폼·상태 패널
export default function PageCard({ eyebrow, title, count, actions, children }) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div className={styles.heading}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>
            {title}
            {count && <span className={styles.count}>{count}</span>}
          </h1>
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}
