import { useState } from 'react';
import { useLocale } from '../state/locale.jsx';

const empty = { title: '', description: '', status: 'NOT_STARTED', priority: 'MEDIUM', dueDate: '' };

export default function ProjectForm({ initial = empty, onSubmit, onCancel }) {
  const { t } = useLocale();
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
      <label className="field"><span>{t('projectName')}</span><input autoFocus required maxLength={120} placeholder={t('exampleProject')} value={form.title} onChange={(event) => update('title', event.target.value)} /></label>
      <label className="field"><span>{t('description')} <small>{t('optional')}</small></span><textarea rows="3" maxLength={2000} placeholder={t('projectDescriptionPlaceholder')} value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
      <div className="form-grid">
        <label className="field"><span>{t('status')}</span><select value={form.status} onChange={(event) => update('status', event.target.value)}><option value="NOT_STARTED">{t('notStarted')}</option><option value="IN_PROGRESS">{t('inProgress')}</option><option value="COMPLETED">{t('completed')}</option></select></label>
        <label className="field"><span>{t('priority')}</span><select value={form.priority} onChange={(event) => update('priority', event.target.value)}><option value="LOW">{t('low')}</option><option value="MEDIUM">{t('medium')}</option><option value="HIGH">{t('high')}</option></select></label>
      </div>
      <label className="field"><span>{t('dueDate')} <small>{t('optional')}</small></span><input type="date" value={form.dueDate} onChange={(event) => update('dueDate', event.target.value)} /></label>
      <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onCancel}>{t('cancel')}</button><button className="button button-primary" disabled={saving}>{saving ? t('saving') : t('saveProject')}</button></div>
    </form>
  );
}
