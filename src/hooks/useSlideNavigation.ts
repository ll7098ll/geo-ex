import { useState, useEffect, useRef, useCallback } from 'react';

export function useSlideNavigation() {
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollAnimRef = useRef<number | null>(null);

  const cancelScrollAnim = useCallback(() => {
    if (scrollAnimRef.current !== null) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.style.scrollSnapType = '';
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onUserInterrupt = () => cancelScrollAnim();
    container.addEventListener('wheel', onUserInterrupt, { passive: true });
    container.addEventListener('touchstart', onUserInterrupt, { passive: true });
    return () => {
      cancelScrollAnim();
      container.removeEventListener('wheel', onUserInterrupt);
      container.removeEventListener('touchstart', onUserInterrupt);
    };
  }, [cancelScrollAnim]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute('data-slide-index');
            if (indexStr !== null) {
              setActiveSlideIndex(Number(indexStr));
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.55,
      }
    );

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSlide = useCallback(
    (index: number) => {
      const container = containerRef.current;
      const target = slideRefs.current[index];
      if (!container || !target) return;

      cancelScrollAnim();

      const startTop = container.scrollTop;
      const targetTop = target.offsetTop;
      const delta = targetTop - startTop;
      if (Math.abs(delta) < 1) {
        container.scrollTop = targetTop;
        return;
      }

      container.style.scrollSnapType = 'none';
      const duration = Math.min(680, Math.max(380, Math.abs(delta) * 0.42));
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        container.scrollTop = startTop + delta * eased;

        if (t < 1) {
          scrollAnimRef.current = requestAnimationFrame(step);
        } else {
          container.scrollTop = targetTop;
          container.style.scrollSnapType = '';
          scrollAnimRef.current = null;
        }
      };

      scrollAnimRef.current = requestAnimationFrame(step);
    },
    [cancelScrollAnim]
  );

  const setSlideRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      slideRefs.current[index] = el;
    },
    []
  );

  return {
    activeSlideIndex,
    containerRef,
    scrollToSlide,
    setSlideRef,
  };
}
