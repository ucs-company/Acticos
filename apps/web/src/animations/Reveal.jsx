import { motion } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';

// Used sparingly: for headline blocks that introduce a section, not on every card.
export default function Reveal({ children, delay = 0, y = 18, className = '', as = 'div', ...rest }) {
  const reduce = !useMotionEnabled();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
