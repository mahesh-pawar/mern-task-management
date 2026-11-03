import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import StatCard from './StatCard';
import useAuth from '../auth/useAuth';
import buttonClass from '../../components/common/buttonClass';
import EmptyState from '../../components/common/EmptyState';
import ErrorAlert from '../../components/common/ErrorAlert';
import { PageLoader } from '../../components/common/Spinner';
import { OverdueBadge, PriorityBadge, StatusBadge } from '../../components/tasks/TaskBadges';
import dashboardService from '../../services/dashboard.service';
import taskService from '../../services/task.service';
import { formatDate, isOverdue } from '../../utils/date';

const icon = (d) => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const ICONS = {
  total: icon('M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z'),
  pending: icon('M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'),
  inProgress: icon('M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'),
  completed: icon('M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'),
  overdue: icon('M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z'),
};

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsResult, recent] = await Promise.all([
        dashboardService.getStats(),
        taskService.list({ limit: 5, sortBy: 'createdAt', order: 'desc' }),
      ]);
      setStats(statsResult);
      setRecentTasks(recent.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hi {firstName}, here&apos;s your overview</h1>
          <p className="mt-1 text-sm text-slate-500">A snapshot of where your tasks stand today.</p>
        </div>
        <Link to="/tasks" className={buttonClass()}>
          Manage tasks
        </Link>
      </div>

      {loading && !stats && <PageLoader label="Loading dashboard..." />}
      {error && <ErrorAlert message={error} onRetry={load} />}

      {stats && (
        <>
          <section aria-label="Task statistics" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            <StatCard label="Total tasks" value={stats.total} accent="indigo" icon={ICONS.total} />
            <StatCard label="Pending" value={stats.pending} accent="slate" icon={ICONS.pending} />
            <StatCard label="In progress" value={stats.inProgress} accent="amber" icon={ICONS.inProgress} />
            <StatCard label="Completed" value={stats.completed} accent="emerald" icon={ICONS.completed} />
            <StatCard label="Overdue" value={stats.overdue} accent="red" icon={ICONS.overdue} />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Completion</h2>
              <p className="text-2xl font-semibold text-slate-900 tabular-nums">{stats.completionRate}%</p>
            </div>
            <div
              className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={stats.completionRate}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Task completion"
            >
              <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${stats.completionRate}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Recent tasks</h2>
              {recentTasks.length > 0 && (
                <Link to="/tasks" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View all
                </Link>
              )}
            </div>

            {recentTasks.length === 0 ? (
              <EmptyState
                title="No tasks yet"
                description="Your newest tasks will show up here."
                action={
                  <Link to="/tasks" className={buttonClass()}>
                    Go to tasks
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
                {recentTasks.map((task) => (
                  <li key={task._id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {task.title}
                      </p>
                      {task.dueDate && <p className="text-xs text-slate-500">Due {formatDate(task.dueDate)}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2 sm:shrink-0">
                      {isOverdue(task) && <OverdueBadge />}
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
