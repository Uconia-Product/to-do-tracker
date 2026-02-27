import React from 'react';
import { getPriorityConfig } from '../../utils/priorityUtils';

export default function PriorityFlag({ priority }) {
  if (priority === 4 || !priority) return null;
  const config = getPriorityConfig(priority);

  return (
    <span
      className={`inline-flex items-center rounded text-xs px-1.5 py-0.5 font-semibold ${config.color} ${config.bg}`}
    >
      {config.label}
    </span>
  );
}
