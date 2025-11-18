"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 3,
  borderWidth = 2,
  colorFrom = "hsl(var(--primary))",
  colorTo = "hsl(var(--secondary))",
  delay = 0,
}: BorderBeamProps) => {
  return (
    <motion.div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-lg pointer-events-none",
        className
      )}
    >
      <motion.div
        className="absolute h-full"
        style={{
          width: `${size}px`,
          background: `linear-gradient(to right, transparent, ${colorFrom}, ${colorTo}, transparent)`,
          filter: `blur(${borderWidth}px)`,
        }}
        animate={{
          x: ["-200%", "200%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          delay,
        }}
      />
    </motion.div>
  );
};

