const projectStatus = {
  NOT_STARTED: ['Not started', 'status-neutral'],
  IN_PROGRESS: ['In progress', 'status-progress'],
  COMPLETED: ['Completed', 'status-done']
};

const taskStatus = {
  TODO: ['To do', 'status-neutral'],
  IN_PROGRESS: ['In progress', 'status-progress'],
  DONE: ['Done', 'status-done']
};

export function StatusBadge({ status, task = false }) {
  const [label, style] = (task ? taskStatus : projectStatus)[status] || ['Unknown', 'status-neutral'];
  return <span className={`status-badge ${style}`}><span />{label}</span>;
}

export function PriorityBadge({ priority }) {
  const labels = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };
  return <span className={`priority-badge priority-${priority?.toLowerCase()}`}>{labels[priority] || priority}</span>;
}
