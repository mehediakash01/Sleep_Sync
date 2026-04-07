"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

type MotionLazyProps = {
  children: ReactNode;
};

type MotionRevealProps = {
  amount?: number;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function MotionLazy({ children }: MotionLazyProps) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function MotionReveal({
  amount = 0.2,
  children,
  className,
  delay = 0,
  y = 20,
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        delay,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.div>
  );
}
