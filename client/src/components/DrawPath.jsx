import { motion } from 'motion/react';
import { useState } from 'react';

// 선이 처음부터 끝까지 그려지는 path (Motion pathLength 0 → 1: 선 길이만큼 dash를 밀어 그린다)
// 그리는 동안은 선 끝을 평평하게(butt), 다 그리면 둥글게(round) 바꾼다.
// 둥근 끝은 길이 0인 선에도 굵기만 한 반원을 붙여 '점'으로 보이는데, 평평한 끝은 길이 0이면 아무것도 그리지 않는다.
// 그래서 프레임 타이밍과 상관없이 그리는 도중에 점이 생기지 않는다
//
// animate  false면 처음부터 다 그려진 평범한 path
// step     Motion transition (delay·duration·ease)
export default function DrawPath({ d, className, step, animate = true }) {
  const [done, setDone] = useState(false);
  if (!animate) return <path d={d} className={className} />;
  return (
    <motion.path
      d={d}
      className={className}
      style={done ? undefined : { strokeLinecap: 'butt' }}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={step}
      onAnimationComplete={() => setDone(true)}
    />
  );
}
