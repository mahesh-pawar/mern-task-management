import { useState } from 'react';

import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ErrorAlert from '../../components/common/ErrorAlert';
import { Input, Select, Textarea } from '../../components/common/FormField';
import taskService from '../../services/task.service';
import { fromDateInputValue, toDateInputValue } from '../../utils/date';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from './taskOptions';

const FORM_ID = 'task-form';

function initialForm(task) {
  return {
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    dueDate: toDateInputValue(task?.dueDate),
  };
}

// task = null -> create, otherwise edit. Mounted fresh each time it opens.
function TaskFormModal({ task, onClose, onSaved }) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState(() => initialForm(task));
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setFieldErrors({ title: 'Title is required' });
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: fromDateInputValue(form.dueDate),
    };

    setSaving(true);
    try {
      const saved = isEdit ? await taskService.update(task._id, payload) : await taskService.create(payload);
      onSaved(saved, isEdit);
    } catch (err) {
      setFieldErrors(err.fieldErrors || {});
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      title={isEdit ? 'Edit task' : 'New task'}
      onClose={saving ? () => {} : onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} loading={saving}>
            {isEdit ? 'Save changes' : 'Create task'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4" noValidate>
        <ErrorAlert message={error} />
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={fieldErrors.title}
          maxLength={200}
          placeholder="e.g. Prepare sprint review"
          autoFocus
        />
        <Textarea
          label="Description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          error={fieldErrors.description}
          maxLength={2000}
          placeholder="Optional details"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS_OPTIONS} error={fieldErrors.status} />
          <Select label="Priority" name="priority" value={form.priority} onChange={handleChange} options={PRIORITY_OPTIONS} error={fieldErrors.priority} />
          <Input label="Due date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} error={fieldErrors.dueDate} />
        </div>
      </form>
    </Modal>
  );
}

export default TaskFormModal;
