import { useEffect, useRef, useCallback } from 'react';

export function useParallax(speed: number = 0.0) {
  const ref = useRef<HTMLElement | null>(null);
  const rafId = useRef<number>(0);

  const update = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = `translateY(-${window.scrollY * speed}px)`;
    }
  }, [speed]);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [update]);

  return ref;
}
