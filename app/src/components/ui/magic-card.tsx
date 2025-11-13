"use client"

import React from "react"

import { cn } from "@/lib/utils"

interface MagicCardProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
  gradientFrom?: string
  gradientTo?: string
}

export function MagicCard({
  children,
  className,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}: MagicCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}08 0%, ${gradientTo}08 100%)`,
      }}
    >
      <div className="relative">{children}</div>
    </div>
  )
}
