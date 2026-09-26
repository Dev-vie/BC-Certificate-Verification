import React, { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Carousel.css";

export interface CarouselItemData {
  id: string | number;
  title: string;
  description: string;
  icon?: ReactNode;
  step?: string | number;
  badge?: string;
}

const DEFAULT_ITEMS: CarouselItemData[] = [
  {
    id: 1,
    title: "Design a Template",
    description:
      "Upload your background, add your logo and position fields using the visual editor.",
    step: "01",
  },
  {
    id: 2,
    title: "Issue a Certificate",
    description:
      "Select a template, fill in student details, and issue in one click.",
    step: "02",
  },
  {
    id: 3,
    title: "Blockchain Anchoring",
    description:
      "A SHA-256 hash of the certificate is automatically stored on the blockchain.",
    step: "03",
  },
  {
    id: 4,
    title: "Share & Verify",
    description:
      "Recipient gets a QR code and link. Anyone can verify authenticity instantly.",
    step: "04",
  },
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring" as const, stiffness: 300, damping: 30 };

interface CarouselItemProps {
  item: CarouselItemData;
  index: number;
  itemWidth: number;
  round?: boolean;
  trackItemOffset: number;
  x: MotionValue<number>;

  transition: any;
}

function CarouselItem({
  item,
  index,
  itemWidth,
  round,
  trackItemOffset,
  x,
  transition,
}: CarouselItemProps) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ];
  const outputRange = [60, 0, -60];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      key={`${item?.id ?? index}-${index}`}
      className={`carousel-item ${round ? "round" : ""}`}
      style={{
        width: itemWidth,
        minWidth: itemWidth,
        height: round ? itemWidth : "100%",
        rotateY,
        ...(round && { borderRadius: "50%" }),
      }}
      transition={transition}
    >
      <div className={`carousel-item-header ${round ? "round" : ""}`}>
        {item.step ? (
          <span className="carousel-step-badge">{item.step}</span>
        ) : null}
        {item.icon ? (
          <span className="carousel-icon-container">{item.icon}</span>
        ) : null}
        {item.badge ? (
          <span className="carousel-badge">{item.badge}</span>
        ) : null}
      </div>
      <div className="carousel-item-content">
        <div className="carousel-item-title">{item.title}</div>
        <p className="carousel-item-description">{item.description}</p>
      </div>
    </motion.div>
  );
}

export interface CarouselProps {
  items?: CarouselItemData[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  showArrows?: boolean;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  items = DEFAULT_ITEMS,
  baseWidth = 320,
  autoplay = false,
  autoplayDelay = 3500,
  pauseOnHover = true,
  loop = true,
  round = false,
  showArrows = true,
  className = "",
}) => {
  const containerPadding = 16;
  const itemWidth = Math.max(200, baseWidth - containerPadding * 2);
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) return items;
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue<number>(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = items.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: any, info: any) => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
        ? -1
        : 0;

    if (direction === 0) return;

    setPosition((prev) => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isAnimating) return;
    setPosition((prev) => {
      if (loop) {
        return prev - 1;
      }
      return Math.max(0, prev - 1);
    });
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isAnimating) return;
    setPosition((prev) => {
      if (loop) {
        return prev + 1;
      }
      return Math.min(items.length - 1, prev + 1);
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0,
        },
      };

  const activeIndex =
    items.length === 0
      ? 0
      : loop
      ? (position - 1 + items.length) % items.length
      : Math.min(position, items.length - 1);

  return (
    <div className={`carousel-wrapper ${className}`}>

      {showArrows && items.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          className="carousel-nav-btn prev"
          aria-label="Previous step"
          title="Previous Step"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div
        ref={containerRef}
        className={`carousel-container ${round ? "round" : ""}`}
        style={{
          width: `${baseWidth}px`,
          maxWidth: "100%",
          ...(round && { height: `${baseWidth}px`, borderRadius: "50%" }),
        }}
      >
        <motion.div
          className="carousel-track"
          drag={isAnimating ? false : "x"}
          {...dragProps}
          style={{
            width: itemWidth,
            gap: `${GAP}px`,
            perspective: 1000,
            perspectiveOrigin: `${
              position * trackItemOffset + itemWidth / 2
            }px 50%`,
            x,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(position * trackItemOffset) }}
          transition={effectiveTransition}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
        >
          {itemsForRender.map((item, index) => (
            <CarouselItem
              key={`${item?.id ?? index}-${index}`}
              item={item}
              index={index}
              itemWidth={itemWidth}
              round={round}
              trackItemOffset={trackItemOffset}
              x={x}
              transition={effectiveTransition}
            />
          ))}
        </motion.div>
        <div className={`carousel-indicators-container ${round ? "round" : ""}`}>
          <div className="carousel-indicators">
            {items.map((_, index) => (
              <motion.button
                type="button"
                key={index}
                className={`carousel-indicator ${
                  activeIndex === index ? "active" : "inactive"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={activeIndex === index}
                animate={{
                  scale: activeIndex === index ? 1.25 : 1,
                }}
                onClick={() => setPosition(loop ? index + 1 : index)}
                transition={{ duration: 0.15 }}
              />
            ))}
          </div>
        </div>
      </div>

      {showArrows && items.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="carousel-nav-btn next"
          aria-label="Next step"
          title="Next Step"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

export default Carousel;
