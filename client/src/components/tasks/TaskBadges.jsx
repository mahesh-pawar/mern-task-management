import { PRIORITY_LABELS, STATUS_LABELS } from '../../features/tasks/taskOptions';

const BASE = 'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset';

const STATUS_STYLES = {
  todo: 'bg-slate-50 text-slate-700 ring-slate-200',
  in_progress: 'bg-amber-50 text-amber-800 ring-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

const PRIORITY_STYLES = {
  low: 'bg-sky-50 text-sky-700 ring-sky-200',
  medium: 'bg-violet-50 text-violet-700 ring-violet-200',
  high: 'bg-red-50 text-red-700 ring-red-200',
};

const PRIORITY_DOTS = { low: 'bg-sky-500', medium: 'bg-violet-500', high: 'bg-red-500' };

export function StatusBadge({ status }) {
  return <span className={`${BASE} ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`${BASE} ${PRIORITY_STYLES[priority]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOTS[priority]}`} aria-hidden="true" />
      {PRIORITY_LABELS[priority]} priority
    </span>
  );
}

export function OverdueBadge() {
  return <span className={`${BASE} bg-red-600 text-white ring-red-600`}>Overdue</span>;
}
