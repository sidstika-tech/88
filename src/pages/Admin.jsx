import React, { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, adjustCredits } from '../services/api.js';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [creditInput, setCreditInput] = useState({});

  useEffect(() => {
    Promise.all([
      getAdminStats().then(r => setStats(r.data.stats)),
      getAdminUsers().then(r => setUsers(r.data.users)),
    ]).finally(() => setLoading(false));
  }, []);

  const handleAdjustCredits = async (userId, amount) => {
    try {
      await adjustCredits(userId, Number(amount));
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, credits: u.credits + Number(amount) } : u));
      setCreditInput(prev => ({ ...prev, [userId]: '' }));
    } catch (e) { alert('Failed to adjust credits'); }
  };

  const PLAN_COLORS = { free: '#6b7280', pro: '#f59e0b', enterprise: '#3b82f6' };

  return (
    <div style={S.page} className="fade-up">
      <div style={S.header}>
        <h1 style={S.title}>⬡ Admin Panel</h1>
        <span className="badge badge-red">Admin Only</span>
      </div>

      <div style={S.tabs}>
        {['overview', 'users'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={S.loadingRow}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '80px', flex: 1 }} />)}
        </div>
      ) : tab === 'overview' ? (
        <div style={S.overview}>
          <div style={S.statsRow}>
            {[
              { label: 'Total Users', value: stats?.totalUsers, color: '#f59e0b' },
              { label: 'Paid Users', value: stats?.proUsers, color: '#10b981' },
              { label: 'Generations', value: stats?.totalGens, color: '#3b82f6' },
              { label: 'Credits Used', value: stats?.creditsUsed, color: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '0.35rem' }}>{s.value ?? '—'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="section-title">RECENT USERS</div>
            <div style={S.userMiniList}>
              {users.slice(0, 8).map(u => (
                <div key={u._id} style={S.userMiniRow}>
                  <div style={S.userMiniAvatar}>{(u.name || u.email)[0].toUpperCase()}</div>
                  <div style={S.userMiniInfo}>
                    <div style={S.userMiniName}>{u.name || u.email.split('@')[0]}</div>
                    <div style={S.userMiniEmail}>{u.email}</div>
                  </div>
                  <span style={{ ...S.planChip, color: PLAN_COLORS[u.plan] }}>{u.plan}</span>
                  <span style={S.creditChip}>⚡ {u.credits}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="card">
            <div className="section-title">ALL USERS ({users.length})</div>
            <div style={S.userTable}>
              <div style={S.tableHeader}>
                <span style={S.th}>User</span>
                <span style={S.th}>Plan</span>
                <span style={S.th}>Credits</span>
                <span style={S.th}>Used</span>
                <span style={S.th}>Joined</span>
                <span style={S.th}>Adjust Credits</span>
              </div>
              {users.map(u => (
                <div key={u._id} style={S.tableRow}>
                  <div style={S.tdUser}>
                    <div style={S.tdAvatar}>{(u.name || u.email)[0].toUpperCase()}</div>
                    <div>
                      <div style={S.tdName}>{u.name || u.email.split('@')[0]}</div>
                      <div style={S.tdEmail}>{u.email}</div>
                    </div>
                  </div>
                  <span style={{ ...S.td, color: PLAN_COLORS[u.plan], fontWeight: '700', textTransform: 'uppercase', fontSize: '0.72rem' }}>{u.plan}</span>
                  <span style={{ ...S.td, color: 'var(--gold)', fontWeight: '700' }}>{u.credits}</span>
                  <span style={S.td}>{u.creditsUsed || 0}</span>
                  <span style={{ ...S.td, fontSize: '0.75rem' }}>{new Date(u.createdAt).toLocaleDateString()}</span>
                  <div style={S.adjustRow}>
                    <input
                      className="input"
                      type="number"
                      value={creditInput[u._id] || ''}
                      onChange={e => setCreditInput(prev => ({ ...prev, [u._id]: e.target.value }))}
                      placeholder="±50"
                      style={{ width: '70px', padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                    />
                    <button onClick={() => handleAdjustCredits(u._id, creditInput[u._id] || 0)}
                      disabled={!creditInput[u._id]}
                      style={{ ...S.adjustBtn, opacity: !creditInput[u._id] ? 0.5 : 1 }}>
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem' },
  title: { fontSize: '1.4rem', fontWeight: '800' },
  tabs: { display: 'flex', gap: '0.5rem' },
  tab: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '0.5rem 1.25rem', borderRadius: 'var(--r)', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' },
  tabActive: { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold)' },
  loadingRow: { display: 'flex', gap: '1rem' },
  overview: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' },
  userMiniList: { display: 'flex', flexDirection: 'column', gap: '0' },
  userMiniRow: { display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' },
  userMiniAvatar: { width: '28px', height: '28px', background: 'var(--gold)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800', flexShrink: 0 },
  userMiniInfo: { flex: 1, minWidth: 0 },
  userMiniName: { fontSize: '0.82rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userMiniEmail: { fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  planChip: { fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 },
  creditChip: { fontSize: '0.78rem', color: 'var(--gold)', fontWeight: '700', flexShrink: 0 },
  userTable: { display: 'flex', flexDirection: 'column', gap: '0', overflowX: 'auto' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 0.7fr 0.7fr 0.7fr 1fr 1.2fr', gap: '1rem', padding: '0.65rem 0.75rem', background: 'var(--surface2)', borderRadius: 'var(--r)', marginBottom: '0.35rem' },
  th: { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 0.7fr 0.7fr 0.7fr 1fr 1.2fr', gap: '1rem', padding: '0.75rem', borderBottom: '1px solid var(--border)', alignItems: 'center' },
  tdUser: { display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 },
  tdAvatar: { width: '26px', height: '26px', background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: '800', flexShrink: 0 },
  tdName: { fontSize: '0.82rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  tdEmail: { fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  td: { fontSize: '0.82rem', color: 'var(--text-dim)' },
  adjustRow: { display: 'flex', gap: '0.4rem', alignItems: 'center' },
  adjustBtn: { background: 'var(--gold)', color: '#000', padding: '0.35rem 0.65rem', borderRadius: 'var(--r)', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)', transition: 'opacity 0.15s' },
};
