import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';

const styles = {
  primary: 'bg-electric text-white hover:bg-electric-600 shadow-[0_8px_24px_-8px_rgba(78,138,46,.7)]',
  light: 'bg-white text-navy-900 hover:bg-mist',
  outline: 'border border-white/30 text-white hover:border-white hover:bg-white/10',
  outlineDark: 'border border-ink/20 text-ink hover:border-electric hover:text-electric',
  ghost: 'text-electric hover:text-electric-600',
};

export default function Button({ to, href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const reduce = !useMotionEnabled();
  const cls = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 ${size === 'lg' ? 'px-7 py-3.5 text-base' : 'px-5 py-2.5 text-[15px]'} ${styles[variant]} ${className}`;
  const motionProps = reduce ? {} : { whileHover: { y: -1 }, whileTap: { scale: 0.97 } };
  if (to) return <motion.span className="inline-flex" {...motionProps}><Link to={to} className={cls} {...rest}>{children}</Link></motion.span>;
  if (href) return <motion.a href={href} className={cls} {...motionProps} {...rest}>{children}</motion.a>;
  return <motion.button className={cls} {...motionProps} {...rest}>{children}</motion.button>;
}
