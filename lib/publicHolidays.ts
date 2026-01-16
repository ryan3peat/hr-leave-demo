/**
 * Hong Kong Public Holidays for 2026 and 2027
 * Based on Hong Kong Labour Laws
 */

export interface PublicHoliday {
  date: Date;
  name: string;
}

/**
 * Hong Kong Public Holidays 2026
 */
export const HK_PUBLIC_HOLIDAYS_2026: PublicHoliday[] = [
  { date: new Date(2026, 0, 1), name: "New Year's Day" },
  { date: new Date(2026, 1, 6), name: "Lunar New Year's Day" },
  { date: new Date(2026, 1, 7), name: "Second Day of Lunar New Year" },
  { date: new Date(2026, 1, 8), name: "Third Day of Lunar New Year" },
  { date: new Date(2026, 3, 4), name: "Ching Ming Festival" },
  { date: new Date(2026, 3, 5), name: "Good Friday" },
  { date: new Date(2026, 3, 6), name: "Day Following Good Friday" },
  { date: new Date(2026, 3, 7), name: "Easter Monday" },
  { date: new Date(2026, 4, 1), name: "Labour Day" },
  { date: new Date(2026, 4, 5), name: "Buddha's Birthday" },
  { date: new Date(2026, 5, 9), name: "Tuen Ng Festival" },
  { date: new Date(2026, 6, 1), name: "Hong Kong Special Administrative Region Establishment Day" },
  { date: new Date(2026, 9, 6), name: "Day Following National Day" },
  { date: new Date(2026, 9, 7), name: "Chung Yeung Festival" },
  { date: new Date(2026, 11, 25), name: "Christmas Day" },
  { date: new Date(2026, 11, 26), name: "Boxing Day" },
];

/**
 * Hong Kong Public Holidays 2027
 */
export const HK_PUBLIC_HOLIDAYS_2027: PublicHoliday[] = [
  { date: new Date(2027, 0, 1), name: "New Year's Day" },
  { date: new Date(2027, 1, 25), name: "Lunar New Year's Day" },
  { date: new Date(2027, 1, 26), name: "Second Day of Lunar New Year" },
  { date: new Date(2027, 1, 27), name: "Third Day of Lunar New Year" },
  { date: new Date(2027, 3, 4), name: "Ching Ming Festival" },
  { date: new Date(2027, 3, 16), name: "Good Friday" },
  { date: new Date(2027, 3, 17), name: "Day Following Good Friday" },
  { date: new Date(2027, 3, 19), name: "Easter Monday" },
  { date: new Date(2027, 4, 1), name: "Labour Day" },
  { date: new Date(2027, 4, 24), name: "Buddha's Birthday" },
  { date: new Date(2027, 5, 29), name: "Tuen Ng Festival" },
  { date: new Date(2027, 6, 1), name: "Hong Kong Special Administrative Region Establishment Day" },
  { date: new Date(2027, 9, 1), name: "National Day" },
  { date: new Date(2027, 9, 6), name: "Day Following National Day" },
  { date: new Date(2027, 9, 26), name: "Chung Yeung Festival" },
  { date: new Date(2027, 11, 25), name: "Christmas Day" },
  { date: new Date(2027, 11, 27), name: "Boxing Day" },
];

/**
 * All Hong Kong Public Holidays (2026-2027)
 */
export const HK_PUBLIC_HOLIDAYS: PublicHoliday[] = [
  ...HK_PUBLIC_HOLIDAYS_2026,
  ...HK_PUBLIC_HOLIDAYS_2027,
];

/**
 * Check if a date is a public holiday
 */
export function isPublicHoliday(date: Date): boolean {
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();
  
  return HK_PUBLIC_HOLIDAYS.some((holiday) => {
    const holidayYear = holiday.date.getFullYear();
    const holidayMonth = holiday.date.getMonth();
    const holidayDay = holiday.date.getDate();
    return (
      dateYear === holidayYear &&
      dateMonth === holidayMonth &&
      dateDay === holidayDay
    );
  });
}

/**
 * Get public holidays in a date range
 */
export function getPublicHolidaysInRange(startDate: Date, endDate: Date): PublicHoliday[] {
  return HK_PUBLIC_HOLIDAYS.filter((holiday) => {
    return holiday.date >= startDate && holiday.date <= endDate;
  });
}

/**
 * Calculate working days (excluding public holidays and weekends)
 */
export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  let workingDays = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  // Normalize to start of day
  current.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Exclude weekends (Saturday = 6, Sunday = 0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isPublicHoliday(current)) {
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workingDays;
}
