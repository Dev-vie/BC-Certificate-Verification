import { cx } from "@/utils/cx";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link?: string;
    icon?: LucideIcon;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cx(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-4",
        className
      )}
    >
      {items.map((item, idx) => {
        const isLink = !!item.link;
        const CardWrapper = isLink ? "a" : "div";

        return (
          <CardWrapper
            href={item.link}
            key={item.title + idx}
            className="relative group block p-2 h-full w-full decoration-none"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ cursor: isLink ? "pointer" : "default" }}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-emerald-500/10 block rounded-3xl border border-emerald-500/20"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              {item.icon && (
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#3D876C] flex items-center justify-center border border-emerald-100/50 mb-4 transition-all group-hover:scale-110">
                  <item.icon className="w-5.5 h-5.5" />
                </div>
              )}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </CardWrapper>
        );
      })}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cx(
        "rounded-2xl h-full w-full p-6 overflow-hidden bg-white border border-slate-200/80 group-hover:border-emerald-500/30 shadow-sm transition-all duration-300 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div>{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cx("text-slate-900 font-bold tracking-tight text-lg mt-2", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cx(
        "mt-3 text-slate-600 tracking-normal leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
export default HoverEffect;
