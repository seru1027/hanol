import styles from './Sticker.module.css';

// 동아리 색 클래스. orgId로 고르므로 목록 순서나 이름이 바뀌어도 같은 동아리는 늘 같은 색
// orgId는 주소에서 온 문자열일 수도 있어 숫자로 바꾼다
export function stickerClass(orgId) {
  return styles[`s${Number(orgId) % 6}`];
}
