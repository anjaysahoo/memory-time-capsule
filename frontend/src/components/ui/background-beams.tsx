"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beams = Array.from({ length: 8 });

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {beams.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-primary/30 to-transparent"
          style={{
            left: `${(i + 1) * 12.5}%`,
            filter: "blur(2px)",
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleY: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

