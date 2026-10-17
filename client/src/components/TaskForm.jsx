import { useState } from 'react';

export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    status: initial?.status || 'TODO',
    dueDate: initial?.dueDate ? new Date(initial.dueDate).toISOString().slice(0, 10) : ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
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
      <label className="field"><span>Task name</span><input autoFocus required maxLength={160} placeholder="What needs to get done?" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
      <label className="field"><span>Description <small>Optional</small></span><textarea rows="3" maxLength={2000} placeholder="Add a little more detail" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
      <div className="form-grid">
        <label className="field"><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="DONE">Done</option></select></label>
        <label className="field"><span>Due date</span><input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} /></label>
      </div>
      <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : 'Save task'}</button></div>
    </form>
  );
}
