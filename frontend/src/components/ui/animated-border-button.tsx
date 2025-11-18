"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ComponentPropsWithoutRef, forwardRef } from "react";

interface AnimatedBorderButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  href?: string;
}

export const AnimatedBorderButton = forwardRef<HTMLButtonElement, AnimatedBorderButtonProps>(
  ({ children, className, href, ...props }, ref) => {
    const Component = href ? "a" : "button";
    
    return (
      <Component
        ref={ref as any}
        href={href}
        className={cn(
          "relative inline-flex items-center justify-center",
          "px-6 py-3 text-lg font-medium",
          "border-2 border-white text-white rounded-lg",
          "hover:bg-white hover:text-black transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "-inset-px pointer-events-none absolute rounded-[inherit] border-2 border-transparent border-inset [mask-clip:padding-box,border-box]",
            "[mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
          )}
        >
          <motion.div
            className={cn(
              "absolute aspect-square bg-gradient-to-r from-transparent via-white to-white"
            )}
            animate={{
              offsetDistance: ["0%", "100%"],
            }}
            style={{
              width: 20,
              offsetPath: `rect(0 auto auto 0 round ${20}px)`,
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
              ease: "linear",
            }}
          />
        </div>
        {children}
      </Component>
    );
  }
);

AnimatedBorderButton.displayName = "AnimatedBorderButton";

