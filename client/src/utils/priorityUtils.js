export const PRIORITY_CONFIG = {
  1: {
    label: 'P1',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-400',
    dot: 'bg-red-500',
  },
  2: {
    label: 'P2',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-400',
    dot: 'bg-orange-500',
  },
  3: {
    label: 'P3',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-400',
    dot: 'bg-blue-500',
  },
  4: {
    label: 'P4',
    color: 'text-gray-400',
    bg: '',
    border: 'border-gray-200',
    dot: 'bg-gray-300',
  },
};

export function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG[4];
}
