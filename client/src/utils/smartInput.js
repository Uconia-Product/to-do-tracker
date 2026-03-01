import { format, addDays, startOfDay } from 'date-fns';

// ---------------------------------------------------------------------------
// Day-name → JS day index (0 = Sunday … 6 = Saturday)
// ---------------------------------------------------------------------------
const DAY_MAP = {
  sunday: 0,    sun: 0,
  monday: 1,    mon: 1,
  tuesday: 2,   tue: 2,   tues: 2,
  wednesday: 3, wed: 3,
  thursday: 4,  thu: 4,   thur: 4,  thurs: 4,
  friday: 5,    fri: 5,
  saturday: 6,  sat: 6,
};

// ---------------------------------------------------------------------------
// Detect a due date from free text.
// Recognises: today, tomorrow, full day names, abbreviations.
// Returns a 'yyyy-MM-dd' string, or null if nothing matched.
// ---------------------------------------------------------------------------
export function parseSmartDate(text) {
  if (!text) return null;

  // Tokenise on word boundaries (ignore punctuation / casing)
  const words = text.toLowerCase().match(/[a-z]+/g) || [];

  for (const word of words) {
    if (word === 'today') {
      return format(new Date(), 'yyyy-MM-dd');
    }

    if (word === 'tomorrow' || word === 'tmr' || word === 'tmrw') {
      return format(addDays(new Date(), 1), 'yyyy-MM-dd');
    }

    if (word in DAY_MAP) {
      const targetDay = DAY_MAP[word];
      const today = startOfDay(new Date());
      const currentDay = today.getDay(); // 0 = Sunday
      // daysUntil is 0 when it's already that day (i.e. maps to today)
      const daysUntil = (targetDay - currentDay + 7) % 7;
      return format(addDays(today, daysUntil), 'yyyy-MM-dd');
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Detect a priority from free text.
// Recognises: p1, p2, p3, p4 (case-insensitive, whole-word).
// Returns 1–4, or null if nothing matched.
// ---------------------------------------------------------------------------
export function parseSmartPriority(text) {
  if (!text) return null;
  const match = text.match(/\bp([1-4])\b/i);
  return match ? parseInt(match[1], 10) : null;
}
