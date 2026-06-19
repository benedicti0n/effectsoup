"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RangeSliderProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  className?: string
  disabled?: boolean
}

export function RangeSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className,
  disabled,
}: RangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn(
        "h-2 w-full cursor-pointer appearance-none rounded-full bg-muted outline-none",
        "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-ring [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:ring-4",
        "[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:ring-2 [&::-moz-range-thumb]:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--muted) ${percentage}%, var(--muted) 100%)`,
      }}
    />
  )
}
