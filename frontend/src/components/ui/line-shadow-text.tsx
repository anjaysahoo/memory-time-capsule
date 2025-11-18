import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface LineShadowTextProps extends React.HTMLAttributes<HTMLElement> {
  shadowColor?: string
  as?: React.ElementType
}

export function LineShadowText({
  children,
  shadowColor = "white",
  className,
  as: Component = "span",
  ...props
}: LineShadowTextProps) {
  const MotionComponent = motion.create(Component)
  const content = typeof children === "string" ? children : null

  if (!content) {
    throw new Error("LineShadowText only accepts string content")
  }

  return (
    <MotionComponent
      style={{ 
        "--shadow-color": shadowColor,
      } as React.CSSProperties}
      className={cn(
        "relative z-0 inline-flex font-bold",
        "[&::after]:absolute [&::after]:inset-0 [&::after]:content-[attr(data-text)]",
        "[&::after]:bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,var(--shadow-color)_3px,var(--shadow-color)_15px)]",
        "[&::after]:-z-10 [&::after]:bg-clip-text [&::after]:text-transparent",
        "[&::after]:animate-[line-shadow_8s_linear_infinite]",
        className
      )}
      data-text={content}
      {...props}
    >
      {content}
    </MotionComponent>
  )
}
