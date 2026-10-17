import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Command, Eye, EyeOff, Layers3, LockKeyhole, Sparkles } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth.jsx';
import { getApiError } from '../services/api.js';

export default function AuthPage({ mode }) {
  const signupMode = mode === 'signup';
  const { user, loading, signin, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  if (!loading && user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (signupMode) await signup(form);
      else await signin({ email: form.email, password: form.password });
      navigate(location.state?.from || '/', { replace: true });
    } catch (cause) {
      setError(getApiError(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="brand-lockup auth-brand"><span className="brand-mark"><Command size={17} strokeWidth={2.6} /></span><span>daymark</span></div>
        <div className="auth-art">
          <span className="art-orbit orbit-one" /><span className="art-orbit orbit-two" /><span className="art-spark"><Sparkles size={19} /></span>
          <div className="art-card art-card-back"><div className="art-line short" /><div className="art-line" /><div className="art-mini-row"><i /><i /><i /></div></div>
          <div className="art-card art-card-front"><div className="art-card-head"><span className="art-icon"><Layers3 size={16} /></span><span className="art-dots">···</span></div><div className="art-title">A little progress,<br />every day.</div><div className="art-progress"><span /></div><div className="art-foot"><span>Project progress</span><strong>72%</strong></div></div>
        </div>
        <div className="auth-panel-copy"><p className="auth-kicker">MAKE ROOM FOR YOUR BEST WORK</p><h1>Bring your ideas<br />into focus.</h1><p>A thoughtful space for your projects, priorities, and all the little steps in between.</p></div>
        <div className="auth-panel-footer"><span>© 2026 Daymark</span><span>Made for meaningful work</span></div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-mobile-brand brand-lockup"><span className="brand-mark"><Command size={17} strokeWidth={2.6} /></span><span>daymark</span></div>
        <div className="auth-form-wrap">
          <Link to="/" className="auth-back"><ArrowLeft size={15} /> Back to home</Link>
          <div className="auth-heading"><div className="auth-heading-icon"><LockKeyhole size={18} /></div><span className="eyebrow">{signupMode ? 'START SOMETHING GOOD' : 'WELCOME BACK'}</span><h2>{signupMode ? 'Create your workspace' : 'Good to see you again'}</h2><p>{signupMode ? 'A focused place to plan, track, and finish your work.' : 'Sign in to pick up right where you left off.'}</p></div>
          {error && <div className="form-error">{error}</div>}
          <form className="auth-form" onSubmit={submit}>
            {signupMode && <label className="field"><span>Your name</span><input autoComplete="name" autoFocus required maxLength={80} placeholder="Alex Morgan" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
            <label className="field"><span>Email address</span><input autoFocus={!signupMode} type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            <label className="field"><span>Password</span><div className="password-wrap"><input type={showPassword ? 'text' : 'password'} autoComplete={signupMode ? 'new-password' : 'current-password'} required minLength={signupMode ? 10 : 1} maxLength={72} placeholder={signupMode ? 'At least 10 characters' : 'Enter your password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{signupMode && <small className="field-hint"><Check size={13} /> Use at least 10 characters</small>}</label>
            <button className="button button-primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : signupMode ? 'Create account' : 'Sign in'}{!busy && <ArrowRight size={16} />}</button>
          </form>
          <div className="auth-switch">{signupMode ? 'Already have an account?' : 'New to Daymark?'} <Link to={signupMode ? '/signin' : '/signup'}>{signupMode ? 'Sign in' : 'Create an account'}</Link></div>
          <p className="auth-terms">Your workspace is private to you. We’ll never share your data.</p>
        </div>
      </section>
    </main>
  );
}
