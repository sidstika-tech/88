import React, { useState } from 'react';
import { updateProfile } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState('dark');

  const saveProfile = async () => {
    setSaving(true); setSaved(false);
    try {
      await updateProfile({ name });
      updateUser({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { alert('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={S.page} className="fade-up">
      {/* Profile */}
      <section style={S.section}>
        <div className="section-title">PROFILE</div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '500px' }}>
          <div style={S.avatarRow}>
            <div style={S.avatar}>{(user?.name || user?.email || 'U')[0].toUpperCase()}</div>
            <div>
              <div style={S.avatarName}>{user?.name || user?.email?.split('@')[0]}</div>
              <div style={S.avatarEmail}>{user?.email}</div>
              <span className="badge badge-gold" style={{ marginTop: '0.35rem' }}>{user?.plan?.toUpperCase()}</span>
            </div>
          </div>
          <div style={S.field}>
            <label style={S.label}>Display Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div style={S.field}>
            <label style={S.label}>Email Address</label>
            <input className="input" value={user?.email || ''} disabled style={{ opacity: 0.5 }} />
            <span style={S.hint}>Email cannot be changed</span>
          </div>
          <button onClick={saveProfile} disabled={saving} style={{ ...S.saveBtn, opacity: saving ? 0.6 : 1 }}>
            {saving ? <><span className="spinner" style={{ width: 16, height: 16, borderTopColor: '#000' }} /> Saving...</> : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </section>

      {/* Account info */}
      <section style={S.section}>
        <div className="section-title">ACCOUNT DETAILS</div>
        <div className="card" style={{ maxWidth: '500px' }}>
          <div style={S.infoGrid}>
            {[
              ['Plan', user?.plan?.toUpperCase()],
              ['Credits Remaining', `${user?.credits} ⚡`],
              ['Credits Used', user?.creditsUsed || 0],
              ['Member Since', user ? new Date().toLocaleDateString() : '—'],
              ['Admin Access', user?.isAdmin ? 'Yes' : 'No'],
            ].map(([k, v]) => (
              <div key={k} style={S.infoRow}>
                <span style={S.infoKey}>{k}</span>
                <span style={S.infoVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section style={S.section}>
        <div className="section-title">APPEARANCE</div>
        <div className="card" style={{ maxWidth: '500px' }}>
          <div style={S.field}>
            <label style={S.label}>Theme</label>
            <div style={S.themeRow}>
              {['dark', 'light'].map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  style={{ ...S.themeBtn, ...(theme === t ? S.themeBtnActive : {}) }}>
                  {t === 'dark' ? '🌑 Dark' : '☀️ Light'}
                </button>
              ))}
            </div>
            <span style={S.hint}>Light mode coming soon</span>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section style={S.section}>
        <div className="section-title">DANGER ZONE</div>
        <div style={{ ...S.dangerCard, maxWidth: '500px' }}>
          <div>
            <div style={S.dangerTitle}>Sign Out</div>
            <div style={S.dangerSub}>Sign out of your account on this device.</div>
          </div>
          <button onClick={logout} style={S.dangerBtn}>Sign Out</button>
        </div>
      </section>
    </div>
  );
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '700px' },
  section: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  avatarRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  avatar: { width: '52px', height: '52px', background: 'var(--gold)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: '800', flexShrink: 0 },
  avatarName: { fontSize: '1rem', fontWeight: '700' },
  avatarEmail: { fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' },
  hint: { fontSize: '0.72rem', color: 'var(--text-muted)' },
  saveBtn: { background: 'var(--gold)', color: '#000', padding: '0.8rem 1.5rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.9rem', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', alignSelf: 'flex-start', transition: 'opacity 0.2s' },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '0' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' },
  infoKey: { fontSize: '0.82rem', color: 'var(--text-muted)' },
  infoVal: { fontSize: '0.875rem', fontWeight: '600' },
  themeRow: { display: 'flex', gap: '0.65rem' },
  themeBtn: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '0.6rem 1.25rem', borderRadius: 'var(--r)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' },
  themeBtnActive: { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold)' },
  dangerCard: { background: 'var(--surface)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--r2)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' },
  dangerTitle: { fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.2rem' },
  dangerSub: { fontSize: '0.8rem', color: 'var(--text-muted)' },
  dangerBtn: { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '0.6rem 1.25rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)', flexShrink: 0 },
};
