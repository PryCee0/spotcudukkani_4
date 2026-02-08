import { ReactNode, useRef } from "react";
import { motion, useInView, type Variant } from "framer-motion";

type AnimationDirection = "up" | "down" | "left" | "right" | "fade" | "scale";

interface ScrollAnimationProps {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const getVariants = (direction: AnimationDirection): { hidden: Variant; visible: Variant } => {
  const hidden: { opacity: number; y?: number; x?: number; scale?: number } = { opacity: 0 };
  const visible: { opacity: number; y?: number; x?: number; scale?: number } = { opacity: 1 };

  switch (direction) {
    case "up":
      hidden.y = 40;
      visible.y = 0;
      break;
    case "down":
      hidden.y = -40;
      visible.y = 0;
      break;
    case "left":
      hidden.x = 40;
      visible.x = 0;
      break;
    case "right":
      hidden.x = -40;
      visible.x = 0;
      break;
    case "scale":
      hidden.scale = 0.9;
      visible.scale = 1;
      break;
    case "fade":
    default:
      break;
  }

  return { hidden, visible };
};

export default function ScrollAnimation({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className = "",
  once = true,
  amount = 0.15,
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });
  const variants = getVariants(direction);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation wrapper
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  amount?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  once = true,
  amount = 0.15,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  direction?: AnimationDirection;
  className?: string;
}

export function StaggerItem({
  children,
  direction = "up",
  className = "",
}: StaggerItemProps) {
  const variants = getVariants(direction);

  return (
    <motion.div
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
