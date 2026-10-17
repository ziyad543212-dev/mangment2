import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CircleHelp, Command, LayoutDashboard, LogOut, Menu, Plus, X } from 'lucide-react';
import { useAuth } from '../state/auth.jsx';

export default function WorkspaceLayout() {
  const { user, signout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSignout() {
    await signout();
    navigate('/signin');
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup"><span className="brand-mark"><Command size={17} strokeWidth={2.6} /></span><span>daymark</span></div>
        <div className="workspace-select"><div className="workspace-avatar">{user?.name?.[0]?.toUpperCase()}</div><div className="workspace-meta"><strong>{user?.name}'s space</strong><small>Personal workspace</small></div><span className="chevron">⌄</span></div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav">
          <NavLink to="/" end onClick={() => setMenuOpen(false)}><LayoutDashboard size={17} /> Overview</NavLink>
          <NavLink to="/" onClick={() => setMenuOpen(false)}><span className="project-nav-dot" /> Projects <span className="nav-count">⌘ 1</span></NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-link"><CircleHelp size={17} /><span>Help center</span></div>
          <button className="profile-row" onClick={handleSignout}><div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div><div className="profile-info"><strong>{user?.name}</strong><small>{user?.email}</small></div><LogOut size={16} /></button>
        </div>
      </aside>
      {menuOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>Overview</strong></div>
          <div className="topbar-actions"><span className="today-label">{new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</span><button className="button button-primary button-small" onClick={() => navigate('/?newProject=1')}><Plus size={15} /> New project</button></div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
