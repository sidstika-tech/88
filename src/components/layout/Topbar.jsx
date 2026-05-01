import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'Your business command center' },
  '/chat': { title: 'AI Advisor', sub: 'Your personal business consultant' },
  '/generator': { title: 'Business Generator', sub: 'Generate complete businesses with AI' },
  '/market': { title: 'Market Research', sub: 'Intelligence & competitive analysis' },
  '/marketing': { title: 'Marketing Builder', sub: 'Campaigns, content & growth strategies' },
  '/vault': { title: 'Project Vault', sub: 'All your saved generations' },
  '/tools': { title: 'AI Tools Hub', sub: 'Specialized business tools' },
  '/billing': { title: 'Billing', sub: 'Plans, credits & subscriptions' },
  '/settings': { title: 'Settings', sub: 'Account preferences' },
  '/admin': { title: 'Admin Panel', sub: 'System management' },
};

export default function Topbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] || { title: 'AIBOS', sub: '' };

  return (
    <header style={S.bar}>
      <div>
        <h1 style={S.title}>{page.title}</h1>
        {page.sub && <p style={S.sub}>{page.sub}</p>}
      </div>
      <div style={S.right}>
        <Link to="/vault" style={S.quickBtn} title="Vault">▣</Link>
        <Link to="/chat" style={{ ...S.quickBtn, ...S.quickChatBtn }}>Ask AI ◎</Link>
        <div style={S.creditPill}>
          <span style={S.creditIcon}>⚡</span>
          <span style={S.creditNum}>{user?.credits ?? 0}</span>
          <span style={S.creditLabel}>credits</span>
        </div>
      </div>
    </header>
  );
}

const S = {
  bar: { height: 'var(--nav-h)', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.75rem', position: 'sticky', top: 0, zIndex: 40 },
  title: { fontSize: '1rem', fontWeight: '700', letterSpacing: '-0.01em' },
  sub: { fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' },
  right: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  quickBtn: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-dim)', padding: '0.4rem 0.75rem', borderRadius: 'var(--r)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', fontFamily: 'var(--font-body)', cursor: 'pointer' },
  quickChatBtn: { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold)', fontWeight: '600' },
  creditPill: { display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '0.4rem 0.85rem' },
  creditIcon: { fontSize: '0.8rem' },
  creditNum: { fontSize: '0.9rem', fontWeight: '700', color: 'var(--gold)' },
  creditLabel: { fontSize: '0.72rem', color: 'var(--text-muted)' },
};
