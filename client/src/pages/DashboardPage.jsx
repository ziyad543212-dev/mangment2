import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check, CircleCheck, Clock3, FolderKanban, Plus, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { api, getApiError } from '../services/api.js';
import { useAuth } from '../state/auth.jsx';
import Modal from '../components/Modal.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge.jsx';

const formatDate = (date) => date ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${date.slice(0, 10)}T12:00:00`)) : 'No due date';
const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
};

function MetricCard({ icon: Icon, label, value, note, tone, trend }) {
  return <article className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={18} /></div><span className="metric-label">{label}</span><div className="metric-value">{value}</div><div className="metric-note">{trend && <span className="metric-trend"><ArrowUpRight size={13} /> On track</span>}{note}</div></article>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [modal, setModal] = useState(false);

  async function loadDashboard() {
    setError('');
    try {
      const [dashResponse, projectsResponse] = await Promise.all([
        api.get('/dashboard'),
        api.get('/projects', { params: { search: search || undefined, status: status || undefined, priority: priority || undefined, sort, order: sort === 'title' ? 'asc' : 'desc' } })
      ]);
      setDashboard(dashResponse.data);
      setProjects(projectsResponse.data.projects);
    } catch (cause) {
      setError(getApiError(cause));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, [search, status, priority, sort]);
  useEffect(() => {
    if (searchParams.get('newProject') === '1') {
      setModal(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const firstName = user?.name?.split(' ')[0];
  const deadlines = useMemo(() => dashboard?.deadlines?.slice(0, 4) || [], [dashboard]);

  async function createProject(data) {
    try {
      await api.post('/projects', data);
      setModal(false);
      await loadDashboard();
    } catch (cause) {
      throw getApiError(cause);
    }
  }

  return (
    <>
      <div className="welcome-row"><div><div className="eyebrow greeting-eyebrow"><Sparkles size={14} /> YOUR WORKSPACE</div><h1>{greeting()}, {firstName}<span className="wave">.</span></h1><p>Here’s what’s happening with your work today.</p></div><div className="welcome-date"><CalendarDays size={15} />{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</div></div>
      {error && <div className="page-error">{error}<button onClick={loadDashboard}>Retry</button></div>}
      <section className="metrics-grid">
        <MetricCard icon={FolderKanban} label="Total projects" value={dashboard?.metrics.totalProjects ?? '—'} note="Across your workspace" tone="metric-green" />
        <MetricCard icon={Clock3} label="Active tasks" value={dashboard?.metrics.activeTasks ?? '—'} note="Ready for your attention" tone="metric-amber" />
        <MetricCard icon={CircleCheck} label="Completed items" value={dashboard?.metrics.completedItems ?? '—'} note="Projects and tasks" tone="metric-blue" trend />
        <MetricCard icon={CalendarDays} label="Upcoming deadlines" value={dashboard?.metrics.upcomingDeadlines ?? '—'} note="In the next 7 days" tone="metric-purple" />
      </section>
      <section className="content-grid">
        <div className="panel projects-panel">
          <div className="panel-heading"><div><span className="eyebrow">YOUR WORK</span><h2>Projects <span className="heading-count">{projects.length}</span></h2></div><button className="button button-soft button-small" onClick={() => setModal(true)}><Plus size={15} /> New project</button></div>
          <div className="project-toolbar"><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a project…" /></label><div className="filter-group"><SlidersHorizontal size={15} /><select aria-label="Filter project status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option value="NOT_STARTED">Not started</option><option value="IN_PROGRESS">In progress</option><option value="COMPLETED">Completed</option></select><select aria-label="Filter project priority" value={priority} onChange={(event) => setPriority(event.target.value)}><option value="">All priorities</option><option value="HIGH">High priority</option><option value="MEDIUM">Medium priority</option><option value="LOW">Low priority</option></select><select aria-label="Sort projects" value={sort} onChange={(event) => setSort(event.target.value)}><option value="createdAt">Recently added</option><option value="dueDate">Due date</option><option value="title">Name</option></select></div></div>
          {loading ? <div className="panel-loading"><span className="spinner" /></div> : projects.length ? <div className="project-list">{projects.map((project, index) => <Link className="project-row" to={`/projects/${project.id}`} key={project.id}><div className={`project-symbol project-symbol-${index % 4}`}><FolderKanban size={18} /></div><div className="project-main"><div className="project-title-line"><strong>{project.title}</strong><StatusBadge status={project.status} /></div><p>{project.description || 'No description yet'}</p><div className="project-meta"><span><CalendarDays size={13} /> {formatDate(project.dueDate)}</span><span><Check size={13} /> {project._count.tasks} tasks</span><PriorityBadge priority={project.priority} /></div></div><ArrowRight className="project-arrow" size={17} /></Link>)}</div> : <div className="empty-state"><div className="empty-icon"><FolderKanban size={22} /></div><h3>{search || status || priority ? 'No projects match those filters' : 'A fresh start'}</h3><p>{search || status || priority ? 'Try adjusting your search or filters.' : 'Create your first project and bring your next big idea to life.'}</p>{!(search || status || priority) && <button className="button button-primary button-small" onClick={() => setModal(true)}><Plus size={15} /> Create a project</button>}</div>}
          <div className="panel-footer"><span>Showing {projects.length} {projects.length === 1 ? 'project' : 'projects'}</span><span className="live-indicator"><i /> Up to date</span></div>
        </div>
        <aside className="right-column">
          <section className="panel deadlines-panel"><div className="panel-heading compact-heading"><div><span className="eyebrow">STAY AHEAD</span><h2>Coming up</h2></div><CalendarDays size={17} className="heading-icon" /></div>{deadlines.length ? <div className="deadline-list">{deadlines.map((item) => <div className="deadline-row" key={`${item.entity}-${item.id}`}><div className={`deadline-marker ${item.entity === 'TASK' ? 'marker-task' : 'marker-project'}`}><span /></div><div className="deadline-content"><strong>{item.title}</strong><small>{item.entity === 'TASK' ? item.project.title : 'Project'} · {formatDate(item.dueDate)}</small></div><ArrowDownRight size={15} className="deadline-arrow" /></div>)}</div> : <div className="mini-empty"><div className="mini-empty-icon"><CalendarDays size={17} /></div><strong>Clear skies ahead</strong><span>No deadlines in the next 7 days.</span></div>}<div className="deadlines-foot"><span>Next 7 days</span><span>{deadlines.length} {deadlines.length === 1 ? 'item' : 'items'}</span></div></section>
          <section className="moment-card"><div className="moment-glow" /><span className="moment-icon"><Sparkles size={16} /></span><span className="eyebrow">A SMALL REMINDER</span><h3>Progress is a practice.</h3><p>Every task you move forward is worth celebrating. Keep going at your own pace.</p><div className="moment-signoff">You’ve got this <span>✳</span></div></section>
        </aside>
      </section>
      {dashboard?.activities?.length > 0 && <section className="activity-panel panel"><div className="panel-heading"><div><span className="eyebrow">THE LATEST</span><h2>Recent activity</h2></div><div className="activity-pulse"><span /> Live updates</div></div><div className="activity-list">{dashboard.activities.slice(0, 5).map((item) => <div className="activity-row" key={item.id}><div className={`activity-avatar activity-${item.entity.toLowerCase()}`}>{item.entity === 'TASK' ? <Check size={14} /> : <FolderKanban size={14} />}</div><div><strong>{item.summary}</strong><small>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(item.createdAt))}</small></div></div>)}</div></section>}
      {modal && <Modal title="Create a project" onClose={() => setModal(false)}><ProjectForm onSubmit={createProject} onCancel={() => setModal(false)} /></Modal>}
    </>
  );
}
