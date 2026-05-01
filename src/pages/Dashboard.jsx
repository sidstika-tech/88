import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const QUICK_ACTIONS = [
  { icon: '⚡', label: 'Generate Business', sub: '5 credits', to: '/generator', color: '#f59e0b' },
  { icon: '◎', label: 'Ask AI Advisor', sub: '1 credit/msg', to: '/chat', color: '#10b981' },
  { icon: '◉', label: 'Market Research', sub: '3 credits', to: '/market', color: '#3b82f6' },
  { icon: '◈', label: 'Build Marketing', sub: '4 credits', to: '/marketing', color: '#8b5cf6' },
  { icon: '◫', label: 'AI Tools', sub: '1-2 credits', to: '/tools', color: '#ec4899' },
  { icon: '▣', label: 'Open Vault', sub: 'All saved work', to: '/vault', color: '#6b7280' },
];

const TYPE_ICONS = { business: '⚡', research: '◉', marketing: '◈', tool: '◫', chat: '◎', store: '🏪' };
const TYPE_COLORS = { business: '#f59e0b', research: '#3b82f6', marketing: '#8b5cf6', tool: '#ec4899', chat: '#10b981', store: '#f59e0b' };

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then(r => setSummary(r.data.summary)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const creditPct = Math.min(100, ((user?.credits || 0) / (user?.plan === 'pro' ? 500 : user?.plan === 'enterprise' ? 2000 : 50)) * 100);

  return (
    <div style={S.page} className="fade-up">
      {/* Welcome strip */}
      <div style={S.welcomeBar}>
        <div>
          <h1 style={S.welcomeTitle}>Good day, {user?.name || user?.email?.split('@')[0]} 👋</h1>
          <p style={S.welcomeSub}>Your AI Business Operating System is ready.</p>
        </div>
        <div style={S.creditDisplay}>
          <div style={S.creditNum}>{user?.credits}</div>
          <div style={S.creditInfo}>
            <span style={S.creditLabel}>credits remaining</span>
            <div style={S.creditBar}><div style={{ ...S.creditFill, width: `${creditPct}%` }} /></div>
          </div>
          <Link to="/billing" style={S.topUpBtn}>Top Up</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <section style={S.section}>
        <div className="section-title">QUICK ACTIONS</div>
        <div style={S.actionsGrid}>
          {QUICK_ACTIONS.map(a => (
            <Link key={a.to} to={a.to} style={S.actionCard}>
              <div style={{ ...S.actionIcon, color: a.color }}>{a.icon}</div>
              <div style={S.actionLabel}>{a.label}</div>
              <div style={S.actionSub}>{a.sub}</div>
              <div style={{ ...S.actionDot, background: a.color }} />
            </Link>
          ))}
        </div>
      </section>

      {/* Stats row */}
      <section style={S.section}>
        <div className="section-title">USAGE OVERVIEW</div>
        {loading ? (
          <div style={S.statsGrid}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '80px' }} />)}
          </div>
        ) : (
          <div style={S.statsGrid}>
            <div className="card">
              <div style={S.statNum}>{summary?.total || 0}</div>
              <div style={S.statLabel}>Total Generations</div>
            </div>
            <div className="card">
              <div style={{ ...S.statNum, color: 'var(--gold)' }}>{user?.creditsUsed || 0}</div>
              <div style={S.statLabel}>Credits Used</div>
            </div>
            <div className="card">
              <div style={{ ...S.statNum, color: '#10b981' }}>{summary?.byType?.find(t => t._id === 'business')?.count || 0}</div>
              <div style={S.statLabel}>Businesses Built</div>
            </div>
            <div className="card">
              <div style={{ ...S.statNum, color: '#3b82f6' }}>{summary?.byType?.find(t => t._id === 'research')?.count || 0}</div>
              <div style={S.statLabel}>Markets Researched</div>
            </div>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section style={S.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="section-title" style={{ marginBottom: 0 }}>RECENT ACTIVITY</div>
          <Link to="/vault" style={S.viewAll}>View all →</Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '56px' }} />)}
          </div>
        ) : summary?.recent?.length === 0 ? (
          <div style={S.emptyState}>
            <span>⚡</span>
            <p>No generations yet. Start by generating your first business!</p>
            <Link to="/generator" style={S.emptyBtn}>Generate Business →</Link>
          </div>
        ) : (
          <div style={S.recentList}>
            {(summary?.recent || []).map(item => (
              <div key={item._id} style={S.recentItem}>
                <div style={{ ...S.recentIcon, color: TYPE_COLORS[item.type] || '#888' }}>{TYPE_ICONS[item.type] || '◈'}</div>
                <div style={S.recentInfo}>
                  <div style={S.recentTitle}>{item.title}</div>
                  <div style={S.recentMeta}>{item.type} · {new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={S.recentCredits}>-{item.creditsUsed} cr</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Platform Map */}
      <section style={S.section}>
        <div className="section-title">PLATFORM FLOW</div>
        <div style={S.flowCard}>
          <div style={S.flowItem}>
            <div style={S.flowIcon}>◎</div>
            <div style={S.flowLabel}>Chat</div>
            <div style={S.flowArrow}>→</div>
          </div>
          <div style={S.flowItem}>
            <div style={S.flowIcon}>⚡</div>
            <div style={S.flowLabel}>Generator</div>
            <div style={S.flowArrow}>→</div>
          </div>
          <div style={S.flowItem}>
            <div style={S.flowIcon}>▣</div>
            <div style={S.flowLabel}>Vault</div>
            <div style={S.flowArrow}>→</div>
          </div>
          <div style={S.flowItem}>
            <div style={S.flowIcon}>◈</div>
            <div style={S.flowLabel}>Marketing</div>
            <div style={S.flowArrow}>→</div>
          </div>
          <div style={S.flowItem}>
            <div style={S.flowIcon}>◉</div>
            <div style={S.flowLabel}>Research</div>
          </div>
        </div>
        <p style={S.flowDesc}>Everything is connected. Every tool feeds into the next. Your work is always saved.</p>
      </section>
    </div>
  );
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px' },
  welcomeBar: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' },
  welcomeTitle: { fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.2rem' },
  welcomeSub: { color: 'var(--text-muted)', fontSize: '0.875rem' },
  creditDisplay: { display: 'flex', alignItems: 'center', gap: '1rem' },
  creditNum: { fontSize: '2.5rem', fontWeight: '800', color: 'var(--gold)', lineHeight: 1 },
  creditInfo: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  creditLabel: { fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  creditBar: { width: '100px', height: '3px', background: 'var(--surface3)', borderRadius: '2px' },
  creditFill: { height: '100%', background: 'var(--gold)', borderRadius: '2px', transition: 'width 0.5s' },
  topUpBtn: { background: 'var(--gold)', color: '#000', padding: '0.45rem 1rem', borderRadius: 'var(--r)', fontSize: '0.82rem', fontWeight: '700', textDecoration: 'none', flexShrink: 0 },
  section: {},
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.85rem' },
  actionCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.25rem', textDecoration: 'none', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.3rem', position: 'relative', transition: 'border-color 0.15s, transform 0.15s', overflow: 'hidden' },
  actionIcon: { fontSize: '1.4rem', marginBottom: '0.25rem' },
  actionLabel: { fontSize: '0.875rem', fontWeight: '700' },
  actionSub: { fontSize: '0.72rem', color: 'var(--text-muted)' },
  actionDot: { position: 'absolute', top: '0.85rem', right: '0.85rem', width: '6px', height: '6px', borderRadius: '50%' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' },
  statNum: { fontSize: '2rem', fontWeight: '800', lineHeight: 1, marginBottom: '0.3rem' },
  statLabel: { fontSize: '0.78rem', color: 'var(--text-muted)' },
  recentList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  recentItem: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' },
  recentIcon: { fontSize: '1.1rem', flexShrink: 0 },
  recentInfo: { flex: 1, minWidth: 0 },
  recentTitle: { fontSize: '0.875rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  recentMeta: { fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem', textTransform: 'capitalize' },
  recentCredits: { fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 },
  viewAll: { fontSize: '0.8rem', color: 'var(--gold)', textDecoration: 'none', fontWeight: '600' },
  emptyState: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center', fontSize: '2rem', color: 'var(--text-muted)' },
  emptyBtn: { background: 'var(--gold)', color: '#000', padding: '0.65rem 1.5rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none', marginTop: '0.5rem' },
  flowCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', marginBottom: '0.75rem' },
  flowItem: { display: 'flex', alignItems: 'center', gap: '1rem' },
  flowIcon: { fontSize: '1.5rem', color: 'var(--gold)' },
  flowLabel: { fontSize: '0.82rem', fontWeight: '600' },
  flowArrow: { color: 'var(--text-muted)', margin: '0 0.75rem', fontSize: '1rem' },
  flowDesc: { fontSize: '0.82rem', color: 'var(--text-muted)' },
};
