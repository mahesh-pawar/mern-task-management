export const STATUS_LABELS = {
  todo: 'To do',
  in_progress: 'In progress',
  completed: 'Completed',
};

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
export const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }));

// One select drives both sortBy and order: value = "<sortBy>:<order>"
export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'dueDate:asc', label: 'Due date (earliest)' },
  { value: 'dueDate:desc', label: 'Due date (latest)' },
];

export const PAGE_SIZE = 10;
