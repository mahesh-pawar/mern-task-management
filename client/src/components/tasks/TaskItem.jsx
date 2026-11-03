import { formatDate, isOverdue } from '../../utils/date';
import { STATUS_OPTIONS } from '../../features/tasks/taskOptions';
import { OverdueBadge, PriorityBadge, StatusBadge } from './TaskBadges';

function TaskItem({ task, onEdit, onDelete, onStatusChange, statusUpdating = false }) {
  const overdue = isOverdue(task);
  const completed = task.status === 'completed';

  return (
    <li className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className={`truncate text-sm font-semibold ${completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
            {task.title}
          </h3>
          {task.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {overdue && <OverdueBadge />}
            {task.dueDate && (
              <span className={`text-xs ${overdue ? 'font-medium text-red-600' : 'text-slate-500'}`}>
                Due {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:shrink-0">
          <label className="sr-only" htmlFor={`status-${task._id}`}>
            Change status
          </label>
          <select
            id={`status-${task._id}`}
            value={task.status}
            disabled={statusUpdating}
            onChange={(event) => onStatusChange(task, event.target.value)}
            className="rounded-lg border border-slate-300 bg-white py-1.5 pl-2 pr-7 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
            aria-label={`Edit ${task.title}`}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${task.title}`}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}

export default TaskItem;
