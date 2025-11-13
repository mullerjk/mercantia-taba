"use client";

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, ReactNode } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * The content to be repeated
   */
  children: ReactNode;
  /**
   * Whether to pause on hover
   */
  pauseOnHover?: boolean;
  /**
   * Whether to reverse the direction
   */
  reverse?: boolean;
  /**
   * Whether to fade the edges
   */
  fade?: boolean;
  /**
   * Custom duration for the animation
   */
  duration?: string;
  /**
   * Custom className for the marquee container
   */
  className?: string;
}

export function Marquee({
  children,
  pauseOnHover = false,
  reverse = false,
  fade = false,
  duration = "40s",
  className,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "flex w-full overflow-hidden",
        fade && "[mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)]",
        className
      )}
      style={{
        "--duration": duration,
        "--gap": "1rem",
      } as React.CSSProperties}
      {...props}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[--gap]",
          "animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animationDuration: "var(--duration)",
        }}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center justify-around gap-[--gap]",
          "animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animationDuration: "var(--duration)",
        }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}
