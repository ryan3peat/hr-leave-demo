import { differenceInYears, differenceInDays, isAfter, isBefore, isEqual, startOfDay } from "date-fns";
import { isPublicHoliday, calculateWorkingDays } from "./publicHolidays";

/**
 * Calculate years of service from first day of work to today
 * Returns fractional years (e.g., 2.5 years)
 */
export function calculateYearsOfService(firstDayOfWork: Date): number {
  const today = new Date();
  return differenceInYears(today, firstDayOfWork);
}

/**
 * Calculate the number of leave days for a date range
 * Handles Full Day and Half Day (AM/PM) durations
 * Excludes public holidays and weekends
 */
export function calculateLeaveDays(
  startDate: Date,
  endDate: Date,
  duration: "Full Day" | "Half Day AM" | "Half Day PM"
): number {
  // Use working days calculation (excludes weekends and public holidays)
  const workingDays = calculateWorkingDays(startDate, endDate);
  
  if (duration === "Full Day") {
    return workingDays;
  } else {
    // Half day = 0.5 days per working day
    return workingDays * 0.5;
  }
}

/**
 * Format date range as a readable string
 */
export function formatDateRange(start: Date, end: Date): string {
  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  const endStr = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  if (startStr === endStr) {
    return startStr;
  }
  
  return `${startStr} - ${endStr}`;
}

/**
 * Check if two date ranges overlap
 * Two ranges overlap if: start1 <= end2 AND start2 <= end1
 */
export function isDateRangeOverlapping(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  const start1Day = startOfDay(start1);
  const end1Day = startOfDay(end1);
  const start2Day = startOfDay(start2);
  const end2Day = startOfDay(end2);
  
  // Two ranges overlap if start1 <= end2 AND start2 <= end1
  return (
    (isBefore(start1Day, end2Day) || isEqual(start1Day, end2Day)) &&
    (isBefore(start2Day, end1Day) || isEqual(start2Day, end1Day))
  );
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return isAfter(date, new Date());
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  return isBefore(date, new Date());
}

/**
 * Get start and end of month for a given date
 */
export function getMonthRange(date: Date): { start: Date; end: Date } {
  const year = date.getFullYear();
  const month = date.getMonth();
  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 0),
  };
}
