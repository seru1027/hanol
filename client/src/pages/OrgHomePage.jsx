import { useState } from 'react';
import { useOutletContext } from 'react-router';
import BackLink from '../components/BackLink.jsx';
import { stickerClass } from '../components/sticker.js';
import { messageOf } from '../messages.js';
import JoinBox from './JoinBox.jsx';
import MemberBox from './MemberBox.jsx';
import NoticeBox from './NoticeBox.jsx';
import styles from './OrgHomePage.module.css';

// SCR-ORG-03 동아리 홈 (/orgs/:orgId). 동아리 레이아웃(SCR-ORG-00) 안의 index 화면
// 박스 세 개가 각자 자기 API를 부른다 (NOTICE-01, MEMBER-01, 회장·운영진만 JOIN-01·03). ORG-03은 다시 부르지 않는다
export default function OrgHomePage() {
  // 동아리 레이아웃이 넘긴 값
  const { orgs, orgId, orgName, myRole } = useOutletContext();
  // 머리의 '멤버 n명': 멤버 박스(MEMBER-01)가 불러온 수를 올려 받는다. 같은 API를 다시 부르지 않는다
  const [memberCount, setMemberCount] = useState(null);
  // 역할에 따른 세 겹 중 '화면 숨김 + 호출 생략': 일반 회원은 JoinBox를 그리지 않으므로 그 안의 JOIN-01·03 요청도 없다
  // 세 번째 겹(서버 차단)은 역할 미들웨어. 여기 판단은 화면 표시용일 뿐이다 (명세 ORG-03 myRole)
  const canManage = myRole === 'OWNER' || myRole === 'ADMIN';

  // ① 머리 = 첫 글자 네모 + 동아리명(ORG-02 목록에서) + 내 역할 · 인원 (2026-11-26, Figma 05 동아리 홈 A). 오른쪽 행동 버튼 없음
  // 이름을 못 찾을 때: 목록 응답 전·방금 만든 동아리(갱신 전)면 비워 두고 곧 채운다 / 목록이 실패(null)했으면 '동아리 홈'
  const title = orgName ?? (orgs === null ? messageOf('ORG_HOME_FALLBACK_TITLE') : '');

  return (
    <section>
      {/* 상위 링크: 동아리 홈 → 메인 (화면정의서에는 없음, 사용자 요청 2026-11-16) */}
      <BackLink to="/" label={messageOf('BACK_TO_MAIN')} />
      <header className={styles.head}>
        {/* 메인 카드 색 띠와 같은 색·첫 글자: 같은 동아리임을 알아보게 하는 장식이라 화면 읽기에서 뺀다 */}
        {title && (
          <span className={`${styles.mark} ${stickerClass(orgId)}`} aria-hidden="true">
            {[...title][0]}
          </span>
        )}
        <div className={styles.headText}>
          <h1 className={styles.headTitle}>{title}</h1>
          <p className={styles.headMeta}>
            {messageOf(`ROLE_${myRole}`)}
            {memberCount !== null && ` · ${messageOf('BOX_MEMBERS_COUNT').replace('{n}', memberCount)}`}
          </p>
        </div>
      </header>
      {/* 2열: 왼쪽 공지 / 오른쪽 가입 관리 → 멤버 (와이어프레임 순서). 두 열의 아래 끝을 맞춘다 */}
      <div className={styles.grid}>
        <NoticeBox />
        <div className={styles.side}>
          {canManage && <JoinBox />}
          <MemberBox onCount={setMemberCount} />
        </div>
      </div>
    </section>
  );
}
