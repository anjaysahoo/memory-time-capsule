"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  asChild?: boolean;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      borderRadius = "0.75rem",
      shimmerDuration = "2s",
      className,
      children,
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    // If asChild, render just the wrapper and let the child handle the element
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn(
          "relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          sizeClasses[size],
          "bg-gradient-to-r from-secondary via-secondary/90 to-secondary text-secondary-foreground hover:scale-105 transition-transform duration-200",
          className,
          (children as React.ReactElement).props.className
        ),
        style: {
          borderRadius,
          ...(children as React.ReactElement).props.style,
        },
        children: (
          <>
            <motion.div
              className="absolute inset-0 opacity-50"
              style={{
                background: `linear-gradient(to right, transparent, ${shimmerColor}, transparent)`,
              }}
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: parseFloat(shimmerDuration),
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <span className="relative z-10">{(children as React.ReactElement).props.children}</span>
          </>
        ),
      });
    }

    return (
      <button
        ref={ref}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          sizeClasses[size],
          "bg-gradient-to-r from-secondary via-secondary/90 to-secondary text-secondary-foreground hover:scale-105 transition-transform duration-200",
          className
        )}
        style={{
          borderRadius,
        }}
        {...props}
      >
        <motion.div
          className="absolute inset-0 opacity-50"
          style={{
            background: `linear-gradient(to right, transparent, ${shimmerColor}, transparent)`,
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: parseFloat(shimmerDuration),
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

