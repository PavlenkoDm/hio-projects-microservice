export function addMonths(baseDate: Date, months: number): Date {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const day = baseDate.getDate();

  const targetYear = year + Math.floor((month + months) / 12);
  const targetMonth = (month + months) % 12;

  const lastDayOfTargetMonth = new Date(
    targetYear,
    targetMonth + 1,
    0,
  ).getDate();

  const targetDay = Math.min(day, lastDayOfTargetMonth);

  return new Date(
    targetYear,
    targetMonth,
    targetDay,
    baseDate.getHours(),
    baseDate.getMinutes(),
    baseDate.getSeconds(),
  );
}
