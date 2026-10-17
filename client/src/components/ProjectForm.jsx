import { useState } from 'react';

const empty = { title: '', description: '', status: 'NOT_STARTED', priority: 'MEDIUM', dueDate: '' };

export default function ProjectForm({ initial = empty, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    ...empty,
    ...initial,
    dueDate: initial.dueDate ? new Date(initial.dueDate).toISOString().slice(0, 10) : ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || null });
    } catch (cause) {
      setError(cause);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      {error && <div className="form-error">{error}</div>}
      <label className="field"><span>Project name</span><input autoFocus required maxLength={120} placeholder="e.g. Website redesign" value={form.title} onChange={(event) => update('title', event.target.value)} /></label>
      <label className="field"><span>Description <small>Optional</small></span><textarea rows="3" maxLength={2000} placeholder="What are you working towards?" value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
      <div className="form-grid">
        <label className="field"><span>Status</span><select value={form.status} onChange={(event) => update('status', event.target.value)}><option value="NOT_STARTED">Not started</option><option value="IN_PROGRESS">In progress</option><option value="COMPLETED">Completed</option></select></label>
        <label className="field"><span>Priority</span><select value={form.priority} onChange={(event) => update('priority', event.target.value)}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></label>
      </div>
      <label className="field"><span>Due date <small>Optional</small></span><input type="date" value={form.dueDate} onChange={(event) => update('dueDate', event.target.value)} /></label>
      <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : 'Save project'}</button></div>
    </form>
  );
}
