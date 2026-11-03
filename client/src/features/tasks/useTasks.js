import { useCallback, useEffect, useState } from 'react';

import useDebounce from '../../hooks/useDebounce';
import taskService from '../../services/task.service';
import { PAGE_SIZE } from './taskOptions';

const DEFAULT_FILTERS = {
  page: 1,
  status: '',
  priority: '',
  search: '',
  sort: 'createdAt:desc', // "<sortBy>:<order>"
};

// Loads the current page of tasks for the given filters.
// All filtering, sorting and pagination happens on the server.
export default function useTasks() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // Wait until the user stops typing before searching
  const search = useDebounce(filters.search);
  const { page, status, priority, sort } = filters;

  // Changing any filter goes back to page 1; changing only the page keeps the rest.
  const updateFilters = useCallback((changes) => {
    setFilters((prev) => ({ ...prev, page: 1, ...changes }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let ignore = false; // skip stale responses if filters change mid-request
    const [sortBy, order] = sort.split(':');

    setLoading(true);
    setError('');

    taskService
      .list({ page, limit: PAGE_SIZE, status, priority, search: search.trim(), sortBy, order })
      .then((result) => {
        if (ignore) return;
        setTasks(result.tasks);
        setPagination(result.pagination);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, status, priority, sort, search, reloadKey]);

  const hasActiveFilters = Boolean(status || priority || filters.search);

  return { tasks, pagination, loading, error, filters, hasActiveFilters, updateFilters, resetFilters, reload };
}
