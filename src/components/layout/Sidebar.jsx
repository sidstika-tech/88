import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV = [
  { group: 'CORE', items: [
    { to: '/dashboard', icon: '◈', label: 'Dashboard' },
    { to: '/chat', icon: '◎', label: 'AI Advisor' },
  ]},
  { group: 'BUILD', items: [
    { to: '/generator', icon: '⚡', label: 'Business Generator' },
    { to: '/market', icon: '◉', label: 'Market Research' },
    { to: '/marketing', icon: '◈', label: 'Marketing Builder' },
  ]},
  { group: 'MANAGE', items: [
    { to: '/vault', icon: '▣', label: 'Project Vault' },
    { to: '/tools', icon: '◫', label: 'AI Tools Hub' },
  ]},
  { group: 'ACCOUNT', items: [
    { to: '/billing', icon: '◐', label: 'Billing' },
    { to: '/settings', icon: '◑', label: 'Settings' },
  ]},
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const planColors = { free: '#6b6b8a', pro: '#f59e0b', enterprise: '#3b82f6' };

  return (
    <aside style={S.sidebar}>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoMark}>⚡</div>
        <div>
          <div style={S.logoText}>AIBOS</div>
          <div style={S.logoSub}>Business OS</div>
        </div>
      </div>

      {/* Credits display */}
      <div style={S.creditsBox}>
        <div style={S.creditsTop}>
          <span style={S.creditsLabel}>Credits</span>
          <span style={{ ...S.planBadge, color: planColors[user?.plan] || '#888' }}>{user?.plan?.toUpperCase()}</span>
        </div>
        <div style={S.creditsValue}>{user?.credits || 0}</div>
        <div style={S.creditsBar}>
          <div style={{ ...S.creditsBarFill, width: `${Math.min(100, ((user?.credits || 0) / (user?.plan === 'pro' ? 500 : user?.plan === 'enterprise' ? 2000 : 50)) * 100)}%` }} />
        </div>
      </div>

      {/* Navigation */}
      <nav style={S.nav}>
        {NAV.map(group => (
          <div key={group.group} style={S.navGroup}>
            <div style={S.groupLabel}>{group.group}</div>
            {group.items.map(item => (
              <NavLink key={item.to} to={item.to} style={({ isActive }) => ({ ...S.navItem, ...(isActive ? S.navActive : {}) })}>
                <span style={S.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
        {user?.isAdmin && (
          <div style={S.navGroup}>
            <div style={S.groupLabel}>ADMIN</div>
            <NavLink to="/admin" style={({ isActive }) => ({ ...S.navItem, ...(isActive ? S.navActive : {}) })}>
              <span style={S.navIcon}>⬡</span><span>Admin Panel</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div style={S.userFooter}>
        <div style={S.userInfo}>
          <div style={S.userAvatar}>{(user?.name || user?.email || 'U')[0].toUpperCase()}</div>
          <div>
            <div style={S.userName}>{user?.name || user?.email?.split('@')[0]}</div>
            <div style={S.userEmail}>{user?.email}</div>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} style={S.logoutBtn} title="Sign out">⎋</button>
      </div>
    </aside>
  );
}

const S = {
  sidebar: { width: 'var(--sidebar-w)', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', zIndex: 50, overflow: 'hidden' },
  logo: { padding: '1.25rem 1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border)' },
  logoMark: { width: '32px', height: '32px', background: 'var(--gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '1rem', fontWeight: '900', flexShrink: 0 },
  logoText: { fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.12em', color: 'var(--text)', lineHeight: 1 },
  logoSub: { fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.06em', marginTop: '2px' },
  creditsBox: { margin: '1rem', background: 'var(--surface2)', border: '1px solid var(--gold-border)', borderRadius: 'var(--r)', padding: '0.85rem 1rem' },
  creditsTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' },
  creditsLabel: { fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' },
  planBadge: { fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.06em' },
  creditsValue: { fontSize: '1.4rem', fontWeight: '700', color: 'var(--gold)', lineHeight: 1, marginBottom: '0.5rem' },
  creditsBar: { height: '3px', background: 'var(--surface3)', borderRadius: '2px', overflow: 'hidden' },
  creditsBarFill: { height: '100%', background: 'linear-gradient(90deg, var(--gold), #fbbf24)', borderRadius: '2px', transition: 'width 0.5s ease', minWidth: '4px' },
  nav: { flex: 1, overflowY: 'auto', padding: '0.5rem 0.75rem' },
  navGroup: { marginBottom: '1.25rem' },
  groupLabel: { fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.14em', color: 'var(--text-muted)', padding: '0 0.5rem', marginBottom: '0.35rem' },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem', borderRadius: 'var(--r)', color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.15s', marginBottom: '0.15rem', textDecoration: 'none' },
  navActive: { background: 'var(--gold-glow)', color: 'var(--gold)', border: '1px solid var(--gold-border)' },
  navIcon: { width: '16px', textAlign: 'center', flexShrink: 0, fontSize: '0.9rem' },
  userFooter: { padding: '0.85rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' },
  userInfo: { flex: 1, display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 },
  userAvatar: { width: '28px', height: '28px', background: 'var(--gold)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 },
  userName: { fontSize: '0.8rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userEmail: { fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  logoutBtn: { background: 'transparent', color: 'var(--text-muted)', fontSize: '1rem', padding: '0.25rem', borderRadius: '6px', transition: 'color 0.15s', flexShrink: 0 },
};
