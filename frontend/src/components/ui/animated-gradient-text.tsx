"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedGradientText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.h1
      className={cn(
        "bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        backgroundSize: "200% auto",
      }}
    >
      {children}
    </motion.h1>
  );
};

