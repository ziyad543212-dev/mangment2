import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Command, Eye, EyeOff, Layers3, LockKeyhole, Sparkles } from 'lucide-react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth.jsx';
import { useLocale } from '../state/locale.jsx';
import { getApiError } from '../services/api.js';
import LanguageToggle from '../components/LanguageToggle.jsx';

export default function AuthPage({ mode }) {
  const signupMode = mode === 'signup';
  const { user, loading, signin, signup } = useAuth();
  const { t } = useLocale();
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
      setError(getApiError(cause, t));
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
          <div className="art-card art-card-front"><div className="art-card-head"><span className="art-icon"><Layers3 size={16} /></span><span className="art-dots">···</span></div><div className="art-title">{t('everyDay')}</div><div className="art-progress"><span /></div><div className="art-foot"><span>{t('projectProgress')}</span><strong>72%</strong></div></div>
        </div>
        <div className="auth-panel-copy"><p className="auth-kicker">{t('makeRoom')}</p><h1>{t('bringIdeas')}<br />{t('intoFocus')}</h1><p>{t('brandIntro')}</p></div>
        <div className="auth-panel-footer"><span>© 2026 Daymark</span><span>{t('madeMeaningful')}</span></div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-top-actions"><div className="auth-mobile-brand brand-lockup"><span className="brand-mark"><Command size={17} strokeWidth={2.6} /></span><span>daymark</span></div><LanguageToggle /></div>
        <div className="auth-form-wrap">
          <Link to="/signin" className="auth-back"><ArrowLeft size={15} /> {t('backHome')}</Link>
          <div className="auth-heading"><div className="auth-heading-icon"><LockKeyhole size={18} /></div><span className="eyebrow">{signupMode ? t('startSomethingGood') : t('welcomeBack')}</span><h2>{signupMode ? t('createWorkspace') : t('signInGreeting')}</h2><p>{signupMode ? t('signupIntro') : t('signinIntro')}</p></div>
          {error && <div className="form-error">{error}</div>}
          <form className="auth-form" onSubmit={submit}>
            {signupMode && <label className="field"><span>{t('yourName')}</span><input autoComplete="name" autoFocus required maxLength={80} placeholder={t('alexMorgan')} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
            <label className="field"><span>{t('emailAddress')}</span><input autoFocus={!signupMode} type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
            <label className="field"><span>{t('password')}</span><div className="password-wrap"><input type={showPassword ? 'text' : 'password'} autoComplete={signupMode ? 'new-password' : 'current-password'} required minLength={signupMode ? 10 : 1} maxLength={72} placeholder={signupMode ? t('passwordHint') : t('enterPassword')} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" className="password-toggle" aria-label={showPassword ? t('hidePassword') : t('showPassword')} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{signupMode && <small className="field-hint"><Check size={13} /> {t('useTenCharacters')}</small>}</label>
            <button className="button button-primary auth-submit" disabled={busy}>{busy ? t('pleaseWait') : signupMode ? t('createAccount') : t('signIn')}{!busy && <ArrowRight size={16} />}</button>
          </form>
          <div className="auth-switch">{signupMode ? t('alreadyAccount') : t('newToDaymark')} <Link to={signupMode ? '/signin' : '/signup'}>{signupMode ? t('signIn') : t('signUp')}</Link></div>
          <p className="auth-terms">{t('privateWorkspace')}</p>
        </div>
      </section>
    </main>
  );
}
