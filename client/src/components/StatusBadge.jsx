import { useLocale } from '../state/locale.jsx';

const projectStatus = {
  NOT_STARTED: ['notStarted', 'status-neutral'],
  IN_PROGRESS: ['inProgress', 'status-progress'],
  COMPLETED: ['completed', 'status-done']
};

const taskStatus = {
  TODO: ['todo', 'status-neutral'],
  IN_PROGRESS: ['inProgress', 'status-progress'],
  DONE: ['completed', 'status-done']
};

export function StatusBadge({ status, task = false }) {
  const { t } = useLocale();
  const [label, style] = (task ? taskStatus : projectStatus)[status] || ['unknown', 'status-neutral'];
  return <span className={`status-badge ${style}`}><span />{t(label)}</span>;
}

export function PriorityBadge({ priority }) {
  const { t } = useLocale();
  const labels = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };
  return <span className={`priority-badge priority-${priority?.toLowerCase()}`}>{t(labels[priority] || 'unknown')}</span>;
}
