import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const duration = 300;
    const start = window.scrollY;
    const startTime = performance.now();

    if (start === 0) return;

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic function for smooth feel
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      window.scrollTo(0, start * (1 - easeOutCubic));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
