import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculates experience in years rounded up to 1 decimal, incrementing on the first day of each month.
// Capped at 10.0 years.
export function calculateExperienceYears(startYear: number, startMonthIndexZeroBased: number, startDay: number = 1, now: Date = new Date()): number {
  const start = new Date(startYear, startMonthIndexZeroBased, startDay)

  const startMonthOrdinal = start.getFullYear() * 12 + start.getMonth()
  const nowMonthOrdinal = now.getFullYear() * 12 + now.getMonth()

  let monthsElapsed = nowMonthOrdinal - startMonthOrdinal

  // Ensure non-negative
  if (monthsElapsed < 0) monthsElapsed = 0

  const years = monthsElapsed / 12
  const roundedUpOneDecimal = Math.min(10, Math.ceil(years * 10) / 10)
  return roundedUpOneDecimal
}
