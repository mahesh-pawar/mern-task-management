import Button from '../../components/common/Button';
import { PRIORITY_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from './taskOptions';

const selectClass =
  'w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';

// Controlled by useTasks: every change calls onChange({ field: value })
function TaskFilters({ filters, hasActiveFilters, onChange, onReset }) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto]">
      <div className="relative col-span-2 md:col-span-1">
        <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
        <input
          type="search"
          aria-label="Search tasks by title"
          placeholder="Search by title..."
          value={filters.search}
          maxLength={100}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <select aria-label="Filter by status" value={filters.status} onChange={(e) => onChange({ status: e.target.value })} className={selectClass}>
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select aria-label="Filter by priority" value={filters.priority} onChange={(e) => onChange({ priority: e.target.value })} className={selectClass}>
        <option value="">All priorities</option>
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select aria-label="Sort tasks" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })} className={selectClass}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Button variant="ghost" onClick={onReset} disabled={!hasActiveFilters} className="max-md:justify-self-start">
        Clear
      </Button>
    </div>
  );
}

export default TaskFilters;
