import React, { useEffect, useRef, useState } from 'react';

type Props = React.PropsWithChildren<{
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delay?: number;      // ms
  duration?: number;   // ms
  y?: number;          // px translateY
  once?: boolean;      // reveal only once
}>;

/**
 * Minimal reveal-on-scroll:
 * - Fades and slides content up slightly.
 * - Respects prefers-reduced-motion.
 * - Reveals once by default (no re-animating on scroll).
 */
export default function ScrollReveal({
  children,
  as = 'div',
  className,
  delay = 40,
  duration = 420,
  y = 10,
  once = true,
}: Props) {
  const Tag = as as any;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Accessibility: reveal immediately for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0,0,0)' : `translate3d(0, ${y}px, 0)`,
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
