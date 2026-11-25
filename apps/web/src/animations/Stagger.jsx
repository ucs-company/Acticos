import { motion } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';

const EASE = [0.22, 1, 0.36, 1];

// Container that reveals its <StaggerItem> children one after another on scroll.
export function Stagger({ children, className = '', delay = 0, stagger = 0.08, as = 'div', ...rest }) {
  const reduce = !useMotionEnabled();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className = '', y = 22, as = 'div', ...rest }) {
  const reduce = !useMotionEnabled();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={reduce ? {} : { hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
