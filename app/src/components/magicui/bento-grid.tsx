"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Link from "next/link";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  href: string;
  cta: string;
  className?: string;
  background?: ReactNode;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 max-w-7xl mx-auto md:auto-rows-[18rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  Icon,
  name,
  description,
  href,
  cta,
  className,
  background,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative col-span-3 flex flex-col overflow-hidden rounded-xl",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:scale-90">
        {background}
      </div>

      <div className="pointer-events-none z-10 flex flex-col justify-end items-start h-full p-6">
        <div className="flex flex-col gap-1">
          <Icon className="h-7 w-7 origin-left transform-gpu text-neutral-700" />
          <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
            {name}
          </h3>
          <p className="max-w-lg text-neutral-400">{description}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </div>
  );
}
