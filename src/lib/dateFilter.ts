export const MONTH_LABELS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

/** Returns a [start, end) UTC date range for the given month/year filter, or null for "all time". */
export function getMonthYearRange(month?: string, year?: string): { start: Date; end: Date } | null {
  const y = year ? Number(year) : undefined;
  const m = month ? Number(month) : undefined; // 1-12

  if (y && m) {
    return { start: new Date(Date.UTC(y, m - 1, 1)), end: new Date(Date.UTC(y, m, 1)) };
  }
  if (y) {
    return { start: new Date(Date.UTC(y, 0, 1)), end: new Date(Date.UTC(y + 1, 0, 1)) };
  }
  return null;
}

export function recentYears(count = 5): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => currentYear - i);
}
