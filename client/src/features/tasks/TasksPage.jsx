import { useState } from 'react';

import useTasks from './useTasks';
import TaskFilters from './TaskFilters';
import TaskFormModal from './TaskFormModal';
import TaskItem from '../../components/tasks/TaskItem';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import ErrorAlert from '../../components/common/ErrorAlert';
import Pagination from '../../components/common/Pagination';
import { PageLoader } from '../../components/common/Spinner';
import taskService from '../../services/task.service';

function TasksPage() {
  const { tasks, pagination, loading, error, filters, hasActiveFilters, updateFilters, resetFilters, reload } = useTasks();

  // Task form: undefined = closed, null = creating, task object = editing
  const [formTask, setFormTask] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const handleSaved = () => {
    setFormTask(undefined);
    reload();
  };

  const handleStatusChange = async (task, status) => {
    setActionError('');
    setStatusUpdatingId(task._id);
    try {
      await taskService.updateStatus(task._id, status);
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    setActionError('');
    setDeleting(true);
    try {
      await taskService.remove(deleteTarget._id);
      setDeleteTarget(null);

      // Deleted the only task on this page: go back one page instead of showing an empty list
      if (tasks.length === 1 && filters.page > 1) {
        updateFilters({ page: filters.page - 1 });
      } else {
        reload();
      }
    } catch (err) {
      setDeleteTarget(null);
      setActionError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const firstLoad = loading && !pagination;

  let content;
  if (firstLoad) {
    content = <PageLoader label="Loading tasks..." />;
  } else if (error) {
    content = <ErrorAlert message={error} onRetry={reload} />;
  } else if (tasks.length === 0) {
    content = hasActiveFilters ? (
      <EmptyState
        title="No tasks match your filters"
        description="Try a different search term or clear the filters."
        action={
          <Button variant="secondary" onClick={resetFilters}>
            Clear filters
          </Button>
        }
      />
    ) : (
      <EmptyState
        title="No tasks yet"
        description="Create your first task to start tracking your work."
        action={<Button onClick={() => setFormTask(null)}>New task</Button>}
      />
    );
  } else {
    content = (
      <>
        <ul className={`space-y-3 transition-opacity ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={setFormTask}
              onDelete={setDeleteTarget}
              onStatusChange={handleStatusChange}
              statusUpdating={statusUpdatingId === task._id}
            />
          ))}
        </ul>
        <div className="mt-6">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(page) => updateFilters({ page })}
          />
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">Create, organise and track everything on your plate.</p>
        </div>
        <Button onClick={() => setFormTask(null)}>
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          New task
        </Button>
      </div>

      <TaskFilters filters={filters} hasActiveFilters={hasActiveFilters} onChange={updateFilters} onReset={resetFilters} />

      <ErrorAlert message={actionError} />

      {content}

      {formTask !== undefined && <TaskFormModal task={formTask} onClose={() => setFormTask(undefined)} onSaved={handleSaved} />}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete task?"
        message={deleteTarget ? `"${deleteTarget.title}" will be permanently deleted. This cannot be undone.` : ''}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default TasksPage;
