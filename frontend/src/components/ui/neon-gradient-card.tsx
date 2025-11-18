"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NeonGradientCardProps {
  children: React.ReactNode;
  className?: string;
  borderSize?: number;
  borderRadius?: number;
  neonColors?: {
    firstColor: string;
    secondColor: string;
  };
}

export const NeonGradientCard = ({
  children,
  className,
  borderSize = 2,
  borderRadius = 12,
  neonColors = {
    firstColor: "139, 126, 255",
    secondColor: "245, 158, 11",
  },
}: NeonGradientCardProps) => {
  return (
    <div
      className={cn("relative group", className)}
      style={{
        borderRadius: `${borderRadius}px`,
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, 
            rgba(${neonColors.firstColor}, 0.3), 
            rgba(${neonColors.secondColor}, 0.3), 
            rgba(${neonColors.firstColor}, 0.3))`,
          backgroundSize: "200% 100%",
          padding: `${borderSize}px`,
          borderRadius: `${borderRadius}px`,
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <Card className={cn("relative z-10 h-full", className)}>{children}</Card>
    </div>
  );
};

