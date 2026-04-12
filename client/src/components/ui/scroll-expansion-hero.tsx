import { useEffect, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollExpandHeroProps {
  mediaSrc: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

const ScrollExpandHero = ({
  mediaSrc, bgImageSrc, title, date, scrollToExpand, children,
}: ScrollExpandHeroProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [fullyExpanded, setFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (fullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setFullyExpanded(false); e.preventDefault();
      } else if (!fullyExpanded) {
        e.preventDefault();
        const p = Math.min(Math.max(scrollProgress + e.deltaY * 0.0009, 0), 1);
        setScrollProgress(p);
        if (p >= 1) { setFullyExpanded(true); setShowContent(true); }
        else if (p < 0.75) setShowContent(false);
      }
    };
    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const delta = touchStartY - e.touches[0].clientY;
      if (fullyExpanded && delta < -20 && window.scrollY <= 5) {
        setFullyExpanded(false); e.preventDefault();
      } else if (!fullyExpanded) {
        e.preventDefault();
        const p = Math.min(Math.max(scrollProgress + delta * (delta < 0 ? 0.008 : 0.005), 0), 1);
        setScrollProgress(p);
        if (p >= 1) { setFullyExpanded(true); setShowContent(true); }
        else if (p < 0.75) setShowContent(false);
        setTouchStartY(e.touches[0].clientY);
      }
    };
    const handleScroll = () => { if (!fullyExpanded) window.scrollTo(0, 0); };
    const handleTouchEnd = () => setTouchStartY(0);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, fullyExpanded, touchStartY]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const w     = 320 + scrollProgress * (isMobile ? 600 : 1200);
  const h     = 420 + scrollProgress * (isMobile ? 200 : 380);
  const shift = scrollProgress * (isMobile ? 160 : 140);
  const word1 = title?.split(' ')[0] ?? '';
  const word2 = title?.split(' ').slice(1).join(' ') ?? '';

  return (
    <div className="overflow-hidden w-full max-w-full">
      <section className="relative flex flex-col items-center min-h-[100dvh] overflow-hidden">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh] overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            style={{ opacity: 1 - scrollProgress }}
          >
            <img
              src={bgImageSrc}
              alt="background"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(28, 26, 21, 0.45)'
            }} />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center relative z-10 overflow-hidden w-full">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative overflow-hidden">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
                style={{ width: `${w}px`, height: `${h}px`, maxWidth: '95vw', maxHeight: '85vh', boxShadow: '0 0 80px rgba(0,0,0,0.5)', transition: 'none' }}
              >
                <img src={mediaSrc} alt="Propiedad en Florida" className="w-full h-full object-cover object-center" />
                <motion.div
                  className="absolute inset-0 bg-[#1C1A15]"
                  animate={{ opacity: 0.65 - scrollProgress * 0.55 }}
                  transition={{ duration: 0.15 }}
                />
              </div>

              {!fullyExpanded && (
                <div className="flex flex-col items-center text-center gap-1 w-full relative z-10 overflow-hidden px-4">
                  <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#F7F3EC] leading-none"
                    style={{ transform: `translateX(${-Math.min(shift, 40)}vw)`, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '-0.02em' }}
                  >
                    {word1}
                  </motion.h1>
                  <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#C9A455] leading-none"
                    style={{ transform: `translateX(${Math.min(shift, 40)}vw)`, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', letterSpacing: '-0.02em' }}
                  >
                    {word2}
                  </motion.h1>
                </div>
              )}

              {!fullyExpanded && (
                <div className="flex flex-col items-center gap-3 mt-6 relative z-10 overflow-hidden px-4">
                  {date && (
                    <p className="text-[#F7F3EC]/60 text-xs font-medium uppercase tracking-[0.15em]"
                      style={{ transform: `translateX(${-Math.min(shift, 40)}vw)` }}>
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <motion.p
                      className="text-[#C9A455] text-sm font-medium tracking-wide"
                      style={{ transform: `translateX(${Math.min(shift, 40)}vw)` }}
                      animate={{ y: [0, 7, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ↓ {scrollToExpand}
                    </motion.p>
                  )}
                </div>
              )}
            </div>

            <motion.div
              className="w-full max-w-full"
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandHero;
