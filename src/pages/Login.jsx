import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi, signup as signupApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function AuthForm({ mode }) {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const nav = useNavigate();

  const handle = async () => {
    setErr(''); setLoading(true);
    try {
      let res;
      if (mode === 'login') res = await loginApi(form.email, form.password);
      else res = await signupApi(form.email, form.password, form.name);
      setAuth(res.data.user, res.data.token);
      nav('/dashboard');
    } catch (e) {
      setErr(e.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.bg} />
      <div style={S.card}>
        <Link to="/" style={S.backLink}>← Back to home</Link>
        <div style={S.logo}>⚡ AIBOS</div>
        <h1 style={S.title}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p style={S.sub}>{mode === 'login' ? 'Sign in to your Business OS' : 'Start building your AI business empire'}</p>
        {err && <div style={S.err}>{err}</div>}
        <div style={S.form}>
          {mode === 'signup' && (
            <div style={S.field}>
              <label style={S.label}>Name</label>
              <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" />
            </div>
          )}
          <div style={S.field}>
            <label style={S.label}>Email</label>
            <input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} onKeyDown={e => e.key==='Enter' && handle()} placeholder="you@company.com" />
          </div>
          <div style={S.field}>
            <label style={S.label}>Password</label>
            <input className="input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} onKeyDown={e => e.key==='Enter' && handle()} placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'} />
          </div>
          <button onClick={handle} disabled={loading || !form.email || !form.password} style={{ ...S.btn, opacity: loading || !form.email || !form.password ? 0.6 : 1 }}>
            {loading ? <><span className="spinner" style={{width:16,height:16}} /> Processing...</> : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </div>
        <p style={S.foot}>
          {mode === 'login' ? <>Don't have an account? <Link to="/signup" style={S.link}>Sign up free</Link></> : <>Already have an account? <Link to="/login" style={S.link}>Sign in</Link></>}
        </p>
        {mode === 'signup' && <p style={S.perks}>🎁 50 free credits on signup · No credit card required</p>}
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' },
  bg: { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(245,158,11,0.06), transparent)', pointerEvents: 'none' },
  card: { width: '100%', maxWidth: '420px', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--r3)', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' },
  backLink: { color: 'var(--text-muted)', fontSize: '0.82rem', textDecoration: 'none' },
  logo: { fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.12em', color: 'var(--gold)' },
  title: { fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em' },
  sub: { color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '-0.5rem' },
  err: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: 'var(--r)', fontSize: '0.875rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  btn: { background: 'var(--gold)', color: '#000', padding: '0.9rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'var(--font-body)', transition: 'opacity 0.2s' },
  foot: { textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' },
  link: { color: 'var(--gold)', fontWeight: '600', textDecoration: 'none' },
  perks: { textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', borderRadius: 'var(--r)', padding: '0.65rem' },
};

export function Login() { return <AuthForm mode="login" />; }
export function Signup() { return <AuthForm mode="signup" />; }
export default Login;
