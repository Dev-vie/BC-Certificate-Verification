import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';

export interface ShuffleProps {
  text: string;
  shuffleDirection?: 'up' | 'down';
  duration?: number;
  animationMode?: 'normal' | 'evenodd' | 'random';
  shuffleTimes?: number;
  ease?: string;
  stagger?: number;
  threshold?: number;
  triggerOnce?: boolean;
  triggerOnHover?: boolean;
  respectReducedMotion?: boolean;
  loop?: boolean;
  loopDelay?: number;
  className?: string;
}

const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+-=?@$';

const EASE_MAP: Record<string, string | number[]> = {
  'power1.in': 'easeIn',
  'power1.out': 'easeOut',
  'power1.inOut': 'easeInOut',
  'power2.in': [0.55, 0.085, 0.68, 0.53],
  'power2.out': [0.25, 0.46, 0.45, 0.94],
  'power2.inOut': [0.455, 0.03, 0.515, 0.955],
  'power3.in': [0.55, 0.055, 0.675, 0.19],
  'power3.out': [0.215, 0.61, 0.355, 1],
  'power3.inOut': [0.645, 0.045, 0.355, 1],
  'power4.in': [0.895, 0.03, 0.685, 0.22],
  'power4.out': [0.165, 0.84, 0.44, 1],
  'power4.inOut': [0.77, 0, 0.175, 1],
  'expo.in': [0.95, 0.05, 0.795, 0.035],
  'expo.out': [0.19, 1, 0.22, 1],
  'expo.inOut': [1, 0, 0, 1],
  'circ.in': [0.6, 0.04, 0.98, 0.335],
  'circ.out': [0.075, 0.82, 0.165, 1],
  'circ.inOut': [0.785, 0.135, 0.15, 0.86],
  'back.in': [0.6, -0.28, 0.735, 0.045],
  'back.out': [0.175, 0.885, 0.32, 1.275],
  'back.inOut': [0.68, -0.55, 0.265, 1.55],
};

export function Shuffle({
  text,
  shuffleDirection = 'up',
  duration = 0.35,
  animationMode = 'normal',
  shuffleTimes = 1,
  ease = 'power3.out',
  stagger = 0.03,
  threshold = 0.1,
  triggerOnce = true,
  triggerOnHover = true,
  respectReducedMotion = true,
  loop = false,
  loopDelay = 0,
  className = '',
}: ShuffleProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const [displayChars, setDisplayChars] = useState<string[]>(() => text.split(''));
  const [hasTriggered, setHasTriggered] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (!respectReducedMotion || typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, [respectReducedMotion]);

  const revealOrder = useMemo(() => {
    const indices = Array.from({ length: text.length }, (_, i) => i);
    if (prefersReducedMotion) return indices;

    if (animationMode === 'evenodd') {
      const evens = indices.filter((i) => i % 2 === 0);
      const odds = indices.filter((i) => i % 2 !== 0);
      return [...evens, ...odds];
    }

    if (animationMode === 'random') {
      const shuffled = [...indices];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (i * 7 + text.length) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    return indices;
  }, [text, animationMode, prefersReducedMotion]);

  const revealOrderMap = useMemo(() => {
    const map = new Map<number, number>();
    revealOrder.forEach((originalIndex, orderIndex) => {
      map.set(originalIndex, orderIndex);
    });
    return map;
  }, [revealOrder]);

  const startAnimation = useCallback(() => {
    if (prefersReducedMotion) {
      setDisplayChars(text.split(''));
      return;
    }
    setTriggerCount((prev) => prev + 1);
    setIsAnimating(true);
  }, [prefersReducedMotion, text]);

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) {
      setDisplayChars(text.split(''));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (triggerOnce && hasTriggered) return;
            setHasTriggered(true);
            startAnimation();
          } else {
            if (!triggerOnce) {
              setIsAnimating(false);
            }
          }
        });
      },
      { threshold }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [threshold, triggerOnce, hasTriggered, prefersReducedMotion, text, startAnimation]);

  useEffect(() => {
    if (triggerCount === 0 || prefersReducedMotion) return;

    const chars = text.split('');
    const startTime = performance.now();
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      let allSettled = true;

      const nextChars = chars.map((char, index) => {
        if (char === ' ' || char === '\n' || char === '\t') return char;

        const orderIndex = revealOrderMap.get(index) ?? index;
        const delay = orderIndex * stagger;
        const settleTime = delay + duration;

        if (elapsed >= settleTime) {
          return char;
        }

        allSettled = false;

        const scrambleInterval = 0.04 / Math.max(0.1, shuffleTimes);
        const tickIndex = Math.floor(elapsed / scrambleInterval);

        const seed = (tickIndex + index) % GLYPHS.length;
        return GLYPHS[seed];
      });

      setDisplayChars(nextChars);

      if (!allSettled) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setIsAnimating(false);

        if (loop) {
          setTimeout(() => {
            startAnimation();
          }, loopDelay * 1000);
        }
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [triggerCount, text, stagger, duration, shuffleTimes, loop, loopDelay, revealOrderMap, prefersReducedMotion, startAnimation]);

  const charVariants = {
    hidden: (direction: 'up' | 'down') => ({
      y: direction === 'up' ? 16 : -16,
      opacity: 0,
    }),
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const resolvedEase = (EASE_MAP[ease] || ease || [0.215, 0.61, 0.355, 1]) as unknown as import('motion/react').Easing;

  const handleMouseEnter = () => {
    if (triggerOnHover && !isAnimating) {
      startAnimation();
    }
  };

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-flex flex-wrap overflow-hidden py-1 ${className}`}
      style={{ lineHeight: '1.2' }}
    >
      {displayChars.map((char, index) => {
        const orderIndex = revealOrderMap.get(index) ?? index;
        return (
          <motion.span
            key={`${triggerCount}-${index}`}
            custom={shuffleDirection}
            variants={charVariants}
            initial="hidden"
            animate={isAnimating ? 'visible' : 'visible'}
            transition={{
              delay: orderIndex * stagger,
              duration: duration,
              ease: resolvedEase,
            }}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}

export default Shuffle;
