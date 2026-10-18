import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check, CircleCheck, Clock3, FolderKanban, Plus, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { api, getApiError } from '../services/api.js';
import { useAuth } from '../state/auth.jsx';
import { useLocale } from '../state/locale.jsx';
import Modal from '../components/Modal.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge.jsx';

const formatDate = (date, locale, t) => date ? new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(new Date(`${date.slice(0, 10)}T12:00:00`)) : t('noDueDate');
const greeting = (locale, t) => {
  const hour = new Date().getHours();
  return hour < 12 ? t('morning') : hour < 18 ? t('afternoon') : t('evening');
};

function MetricCard({ icon: Icon, label, value, note, tone, trend }) {
  return <article className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={18} /></div><span className="metric-label">{label}</span><div className="metric-value">{value}</div><div className="metric-note">{trend && <span className="metric-trend"><ArrowUpRight size={13} /> On track</span>}{note}</div></article>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, dateLocale } = useLocale();
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
      setError(getApiError(cause, t));
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
      throw getApiError(cause, t);
    }
  }

  return (
    <>
      <div className="welcome-row"><div><div className="eyebrow greeting-eyebrow"><Sparkles size={14} /> {t('yourWorkspace')}</div><h1>{greeting(dateLocale, t)}{dateLocale === 'ar' ? '، ' : ', '}{firstName}<span className="wave">.</span></h1><p>{t('dashboardIntro')}</p></div><div className="welcome-date"><CalendarDays size={15} />{new Intl.DateTimeFormat(dateLocale, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</div></div>
      {error && <div className="page-error">{error}<button onClick={loadDashboard}>{t('retry')}</button></div>}
      <section className="metrics-grid">
        <MetricCard icon={FolderKanban} label={t('totalProjects')} value={dashboard?.metrics.totalProjects ?? '—'} note={t('acrossWorkspace')} tone="metric-green" />
        <MetricCard icon={Clock3} label={t('activeTasks')} value={dashboard?.metrics.activeTasks ?? '—'} note={t('readyAttention')} tone="metric-amber" />
        <MetricCard icon={CircleCheck} label={t('completedItems')} value={dashboard?.metrics.completedItems ?? '—'} note={t('projectsAndTasks')} tone="metric-blue" trend />
        <MetricCard icon={CalendarDays} label={t('upcomingDeadlines')} value={dashboard?.metrics.upcomingDeadlines ?? '—'} note={t('next7Days')} tone="metric-purple" />
      </section>
      <section className="content-grid">
        <div className="panel projects-panel">
          <div className="panel-heading"><div><span className="eyebrow">{t('yourWork')}</span><h2>{t('projects')} <span className="heading-count">{projects.length}</span></h2></div><button className="button button-soft button-small" onClick={() => setModal(true)}><Plus size={15} /> {t('newProject')}</button></div>
          <div className="project-toolbar"><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('findProject')} /></label><div className="filter-group"><SlidersHorizontal size={15} /><select aria-label={t('filterProjectStatus')} value={status} onChange={(event) => setStatus(event.target.value)}><option value="">{t('allStatuses')}</option><option value="NOT_STARTED">{t('notStarted')}</option><option value="IN_PROGRESS">{t('inProgress')}</option><option value="COMPLETED">{t('completed')}</option></select><select aria-label={t('filterProjectPriority')} value={priority} onChange={(event) => setPriority(event.target.value)}><option value="">{t('allPriorities')}</option><option value="HIGH">{t('highPriority')}</option><option value="MEDIUM">{t('mediumPriority')}</option><option value="LOW">{t('lowPriority')}</option></select><select aria-label={t('sortProjects')} value={sort} onChange={(event) => setSort(event.target.value)}><option value="createdAt">{t('recentlyAdded')}</option><option value="dueDate">{t('dueDate')}</option><option value="title">{t('name')}</option></select></div></div>
          {loading ? <div className="panel-loading"><span className="spinner" /></div> : projects.length ? <div className="project-list">{projects.map((project, index) => <Link className="project-row" to={`/projects/${project.id}`} key={project.id}><div className={`project-symbol project-symbol-${index % 4}`}><FolderKanban size={18} /></div><div className="project-main"><div className="project-title-line"><strong>{project.title}</strong><StatusBadge status={project.status} /></div><p>{project.description || t('noDescription')}</p><div className="project-meta"><span><CalendarDays size={13} /> {formatDate(project.dueDate, dateLocale, t)}</span><span><Check size={13} /> {project._count.tasks} {t('tasks')}</span><PriorityBadge priority={project.priority} /></div></div><ArrowRight className="project-arrow" size={17} /></Link>)}</div> : <div className="empty-state"><div className="empty-icon"><FolderKanban size={22} /></div><h3>{search || status || priority ? t('noMatchingProjects') : t('freshStart')}</h3><p>{search || status || priority ? t('adjustFilters') : t('createFirstProject')}</p>{!(search || status || priority) && <button className="button button-primary button-small" onClick={() => setModal(true)}><Plus size={15} /> {t('createProject')}</button>}</div>}
          <div className="panel-footer"><span>{t('showing')} {projects.length} {projects.length === 1 ? t('project') : t('projectsPlural')}</span><span className="live-indicator"><i /> {t('upToDate')}</span></div>
        </div>
        <aside className="right-column">
          <section className="panel deadlines-panel"><div className="panel-heading compact-heading"><div><span className="eyebrow">{t('stayAhead')}</span><h2>{t('comingUp')}</h2></div><CalendarDays size={17} className="heading-icon" /></div>{deadlines.length ? <div className="deadline-list">{deadlines.map((item) => <div className="deadline-row" key={`${item.entity}-${item.id}`}><div className={`deadline-marker ${item.entity === 'TASK' ? 'marker-task' : 'marker-project'}`}><span /></div><div className="deadline-content"><strong>{item.title}</strong><small>{item.entity === 'TASK' ? item.project.title : t('projectType')} · {formatDate(item.dueDate, dateLocale, t)}</small></div><ArrowDownRight size={15} className="deadline-arrow" /></div>)}</div> : <div className="mini-empty"><div className="mini-empty-icon"><CalendarDays size={17} /></div><strong>{t('clearSkies')}</strong><span>{t('noDeadlines')}</span></div>}<div className="deadlines-foot"><span>{t('nextSevenDays')}</span><span>{deadlines.length} {deadlines.length === 1 ? t('item') : t('items')}</span></div></section>
          <section className="moment-card"><div className="moment-glow" /><span className="moment-icon"><Sparkles size={16} /></span><span className="eyebrow">{t('reminder')}</span><h3>{t('progressPractice')}</h3><p>{t('encouragement')}</p><div className="moment-signoff">{t('youveGotThis')} <span>✳</span></div></section>
        </aside>
      </section>
      {dashboard?.activities?.length > 0 && <section className="activity-panel panel"><div className="panel-heading"><div><span className="eyebrow">{t('latest')}</span><h2>{t('recentActivity')}</h2></div><div className="activity-pulse"><span /> {t('liveUpdates')}</div></div><div className="activity-list">{dashboard.activities.slice(0, 5).map((item) => <div className="activity-row" key={item.id}><div className={`activity-avatar activity-${item.entity.toLowerCase()}`}>{item.entity === 'TASK' ? <Check size={14} /> : <FolderKanban size={14} />}</div><div><strong>{item.summary}</strong><small>{new Intl.DateTimeFormat(dateLocale, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(item.createdAt))}</small></div></div>)}</div></section>}
      {modal && <Modal title={t('createProjectTitle')} onClose={() => setModal(false)}><ProjectForm onSubmit={createProject} onCancel={() => setModal(false)} /></Modal>}
    </>
  );
}
