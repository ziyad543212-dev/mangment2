import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Check, Circle, Clock3, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { api, getApiError } from '../services/api.js';
import Modal from '../components/Modal.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge.jsx';

const columns = [
  { id: 'TODO', title: 'To do', tone: 'todo' },
  { id: 'IN_PROGRESS', title: 'In progress', tone: 'progress' },
  { id: 'DONE', title: 'Done', tone: 'done' }
];

function dateLabel(date) {
  if (!date) return null;
  const [year, month, day] = date.slice(0, 10).split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  const days = Math.ceil((new Date(year, month - 1, day) - new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) / 86400000);
  return { text: days < 0 ? 'Overdue' : days === 0 ? 'Today' : parsed.toLocaleDateString('en', { month: 'short', day: 'numeric' }), overdue: days < 0 };
}

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadProject = useCallback(async () => {
    setError('');
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data.project);
    } catch (cause) {
      setError(getApiError(cause));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { loadProject(); }, [loadProject]);

  const visibleTasks = useMemo(() => project?.tasks.filter((task) => {
    const matchesSearch = !search || task.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (!statusFilter || task.status === statusFilter);
  }) || [], [project, search, statusFilter]);

  async function createTask(data) {
    try {
      await api.post(`/projects/${projectId}/tasks`, data);
      setModal('');
      await loadProject();
    } catch (cause) {
      throw getApiError(cause);
    }
  }

  async function updateTask(data) {
    try {
      await api.patch(`/projects/${projectId}/tasks/${editingTask.id}`, data);
      setEditingTask(null);
      setModal('');
      await loadProject();
    } catch (cause) {
      throw getApiError(cause);
    }
  }

  async function changeTaskStatus(task, status) {
    try {
      await api.patch(`/projects/${projectId}/tasks/${task.id}`, { status });
      await loadProject();
    } catch (cause) {
      setError(getApiError(cause));
    }
  }

  async function removeTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This can't be undone.`)) return;
    try {
      await api.delete(`/projects/${projectId}/tasks/${task.id}`);
      await loadProject();
    } catch (cause) {
      setError(getApiError(cause));
    }
  }

  async function updateProject(data) {
    try {
      await api.patch(`/projects/${projectId}`, data);
      setModal('');
      await loadProject();
    } catch (cause) {
      throw getApiError(cause);
    }
  }

  async function removeProject() {
    if (!window.confirm(`Delete "${project.title}" and all its tasks? This can't be undone.`)) return;
    try {
      await api.delete(`/projects/${projectId}`);
      navigate('/');
    } catch (cause) {
      setError(getApiError(cause));
    }
  }

  if (loading) return <div className="page-loading"><span className="spinner" /> Loading project</div>;
  if (error && !project) return <div className="not-found"><div className="empty-icon"><Circle size={22} /></div><h2>Project unavailable</h2><p>{error}</p><Link className="button button-soft" to="/"><ArrowLeft size={15} /> Back to overview</Link></div>;

  return (
    <>
      <Link className="back-link" to="/"><ArrowLeft size={15} /> All projects</Link>
      {error && <div className="page-error">{error}<button onClick={loadProject}>Retry</button></div>}
      <section className="project-hero panel">
        <div className="project-hero-top"><div className="project-hero-icon"><span><Check size={17} /></span></div><div className="project-actions"><button className="button button-soft button-small" onClick={() => setModal('edit-project')}><Pencil size={14} /> Edit project</button><button className="icon-button danger-icon" aria-label="Delete project" onClick={removeProject}><Trash2 size={17} /></button></div></div>
        <span className="eyebrow">PROJECT OVERVIEW</span>
        <h1>{project.title}</h1>
        <p className="project-hero-description">{project.description || 'Give this project a description to keep everyone aligned.'}</p>
        <div className="project-hero-meta"><StatusBadge status={project.status} /><PriorityBadge priority={project.priority} /><span className="hero-meta-item"><CalendarDays size={14} /> Due {project.dueDate ? new Date(`${project.dueDate.slice(0, 10)}T12:00:00`).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No due date'}</span><span className="hero-meta-item"><Check size={14} /> {project.tasks.filter((task) => task.status === 'DONE').length} of {project.tasks.length} tasks complete</span></div>
        {project.tasks.length > 0 && <div className="project-progress"><span style={{ width: `${Math.round(project.tasks.filter((task) => task.status === 'DONE').length / project.tasks.length * 100)}%` }} /></div>}
      </section>
      <section className="board-section">
        <div className="board-heading"><div><span className="eyebrow">MAKE IT HAPPEN</span><h2>Task board <span className="heading-count">{project.tasks.length}</span></h2></div><div className="board-tools"><label className="search-box board-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a task…" /></label><select className="select-compact" aria-label="Filter tasks" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All tasks</option><option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="DONE">Done</option></select><button className="button button-primary button-small" onClick={() => { setEditingTask(null); setModal('new-task'); }}><Plus size={15} /> Add task</button></div></div>
        <div className="kanban-grid">{columns.map((column) => {
          const tasks = visibleTasks.filter((task) => task.status === column.id);
          return <section className="kanban-column" key={column.id}><div className="column-heading"><span className={`column-indicator ${column.tone}`} /><h3>{column.title}</h3><span className="column-count">{tasks.length}</span></div><div className="task-stack">{tasks.map((task) => <article className={`task-card ${task.status === 'DONE' ? 'task-complete' : ''}`} key={task.id}><div className="task-card-top"><select className={`task-status-select task-select-${task.status.toLowerCase()}`} aria-label={`Change status for ${task.title}`} value={task.status} onChange={(event) => changeTaskStatus(task, event.target.value)}><option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="DONE">Done</option></select><div className="task-menu"><button className="icon-button task-more" aria-label={`More actions for ${task.title}`} onClick={() => { setEditingTask(task); setModal('edit-task'); }}><MoreHorizontal size={18} /></button><div className="task-action-menu"><button onClick={() => { setEditingTask(task); setModal('edit-task'); }}><Pencil size={13} /> Edit task</button><button onClick={() => removeTask(task)}><Trash2 size={13} /> Delete task</button></div></div></div><h4>{task.title}</h4>{task.description && <p>{task.description}</p>}<div className="task-card-foot">{task.dueDate ? <span className={`task-date ${dateLabel(task.dueDate).overdue ? 'task-overdue' : ''}`}><Clock3 size={13} /> {dateLabel(task.dueDate).text}</span> : <span /> }{task.status === 'DONE' && <span className="task-done-check"><Check size={13} /></span>}</div></article>)}
            {tasks.length === 0 && <div className="column-empty">{search || statusFilter ? 'No matching tasks' : column.id === 'TODO' ? 'Add a task to get started' : 'Nothing here yet'}</div>}</div></section>;
        })}</div>
        {project.tasks.length === 0 && <div className="board-empty"><div className="empty-icon"><Check size={22} /></div><h3>Your board is ready</h3><p>Break this project into small, satisfying steps.</p><button className="button button-primary button-small" onClick={() => setModal('new-task')}><Plus size={15} /> Add the first task</button></div>}
      </section>
      {modal === 'new-task' && <Modal title="Add a task" onClose={() => setModal('')}><TaskForm onSubmit={createTask} onCancel={() => setModal('')} /></Modal>}
      {modal === 'edit-task' && editingTask && <Modal title="Edit task" onClose={() => setModal('')}><TaskForm initial={editingTask} onSubmit={updateTask} onCancel={() => setModal('')} /></Modal>}
      {modal === 'edit-project' && <Modal title="Edit project" onClose={() => setModal('')}><ProjectForm initial={project} onSubmit={updateProject} onCancel={() => setModal('')} /></Modal>}
    </>
  );
}
