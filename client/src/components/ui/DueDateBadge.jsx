import React from 'react';
import { formatDate, isOverdue, isDueToday } from '../../utils/dateUtils';

export default function DueDateBadge({ dueDate }) {
  if (!dueDate) return null;

  const label = formatDate(dueDate);
  const overdue = isOverdue(dueDate);
  const today = isDueToday(dueDate);

  return (
    <span
      className={`text-xs flex items-center gap-1 font-medium ${
        overdue ? 'text-red-500' : today ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
      }`}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {label}
    </span>
  );
}
