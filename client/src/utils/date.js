const pad = (n) => String(n).padStart(2, '0');

// ISO string -> 'YYYY-MM-DD' in the user's local timezone (for <input type="date">)
export function toDateInputValue(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// 'YYYY-MM-DD' -> ISO string at the END of that local day, so a task due
// "today" only becomes overdue after today is over. Empty -> null (clears it).
export function fromDateInputValue(value) {
  if (!value) return null;
  return new Date(`${value}T23:59:59.999`).toISOString();
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function isOverdue(task) {
  return Boolean(task.dueDate) && task.status !== 'completed' && new Date(task.dueDate) < new Date();
}
