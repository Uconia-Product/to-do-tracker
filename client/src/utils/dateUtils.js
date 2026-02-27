import { format, isToday, isBefore, parseISO, isWithinInterval, addDays, startOfDay } from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  return format(date, 'MMM d');
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  return isBefore(date, startOfDay(new Date())) && !isToday(date);
}

export function isDueToday(dateStr) {
  if (!dateStr) return false;
  return isToday(parseISO(dateStr));
}

export function isUpcoming(dateStr) {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  const today = startOfDay(new Date());
  return isWithinInterval(date, { start: today, end: addDays(today, 7) });
}
