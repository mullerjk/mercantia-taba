"use client"

import { useEffect, useRef, useState } from "react"

interface BlurFadeProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function BlurFade({ children, delay = 0, className = "" }: BlurFadeProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 blur-none"
          : "opacity-0 translate-y-4 blur-sm"
      } ${className}`}
    >
      {children}
    </div>
  )
}
