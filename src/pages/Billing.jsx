import React, { useState, useEffect } from 'react';
import { getPlans, upgradePlan } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const PLAN_COLORS = { free: '#6b7280', pro: '#f59e0b', enterprise: '#3b82f6' };
const CREDIT_COSTS = [
  { action: 'AI Chat Message', cost: 1, icon: '◎' },
  { action: 'Market Research', cost: 3, icon: '◉' },
  { action: 'Marketing Builder', cost: 4, icon: '◈' },
  { action: 'Business Generator', cost: 5, icon: '⚡' },
  { action: 'Logo Concept', cost: 2, icon: '🎨' },
  { action: 'Startup Names', cost: 1, icon: '💡' },
  { action: 'Pitch Builder', cost: 2, icon: '📊' },
  { action: 'Cold Email', cost: 1, icon: '📧' },
];

export default function Billing() {
  const { user, updateUser } = useAuth();
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(false);
  const [upgrading, setUpgrading] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { getPlans().then(r => setPlans(r.data.plans)).catch(() => {}); }, []);

  const handleUpgrade = async (planId) => {
    if (planId === user?.plan) return;
    setUpgrading(planId); setSuccess('');
    try {
      const res = await upgradePlan(planId);
      updateUser({ plan: res.data.user.plan, credits: res.data.user.credits });
      setSuccess(`✓ Successfully upgraded to ${planId} plan!`);
    } catch (e) { alert(e.response?.data?.message || 'Upgrade failed'); }
    finally { setUpgrading(''); }
  };

  return (
    <div style={S.page} className="fade-up">
      {/* Current plan banner */}
      <div style={{ ...S.currentBanner, borderColor: PLAN_COLORS[user?.plan] }}>
        <div>
          <div style={S.currentLabel}>CURRENT PLAN</div>
          <div style={{ ...S.currentPlan, color: PLAN_COLORS[user?.plan] }}>{user?.plan?.toUpperCase()}</div>
        </div>
        <div style={S.creditStat}>
          <div style={S.creditBig}>{user?.credits}</div>
          <div style={S.creditSmall}>credits remaining</div>
        </div>
        <div style={S.usageStat}>
          <div style={S.usageBig}>{user?.creditsUsed || 0}</div>
          <div style={S.usageSmall}>credits used total</div>
        </div>
      </div>

      {success && <div style={S.successMsg}>{success}</div>}

      {/* Plans */}
      <div>
        <div className="section-title">UPGRADE PLAN</div>
        <div style={S.plansGrid}>
          {Object.entries(plans).map(([planId, plan]) => {
            const isCurrent = user?.plan === planId;
            const color = PLAN_COLORS[planId];
            return (
              <div key={planId} style={{ ...S.planCard, borderColor: isCurrent ? color : 'var(--border)', boxShadow: isCurrent ? `0 0 30px ${color}22` : 'none' }}>
                {isCurrent && <div style={{ ...S.currentBadge, background: color }}>CURRENT</div>}
                <div style={{ ...S.planName, color }}>{plan.name}</div>
                <div style={S.planPrice}>
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  {plan.price > 0 && <span style={S.planPeriod}>/month</span>}
                </div>
                <div style={S.planCredits}>⚡ {plan.credits} credits/month</div>
                <hr className="divider" />
                <ul style={S.featureList}>
                  {plan.features.map(f => (
                    <li key={f} style={S.featureItem}>
                      <span style={{ color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(planId)}
                  disabled={isCurrent || upgrading === planId}
                  style={{ ...S.upgradeBtn, background: isCurrent ? 'var(--surface3)' : color, color: isCurrent ? 'var(--text-muted)' : planId === 'pro' || planId === 'free' ? '#000' : '#fff', cursor: isCurrent ? 'default' : 'pointer', opacity: upgrading === planId ? 0.6 : 1 }}>
                  {upgrading === planId ? <><span className="spinner" style={{ width: 16, height: 16, borderTopColor: planId === 'enterprise' ? '#fff' : '#000' }} /> Upgrading...</>
                    : isCurrent ? 'Current Plan' : planId === 'free' ? 'Downgrade' : 'Upgrade Now'}
                </button>
                {plan.price > 0 && <p style={S.stripeNote}>🔒 Powered by Stripe · Cancel anytime</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Credit cost table */}
      <div>
        <div className="section-title">CREDIT COSTS</div>
        <div style={S.costsGrid}>
          {CREDIT_COSTS.map(c => (
            <div key={c.action} style={S.costRow}>
              <span style={S.costIcon}>{c.icon}</span>
              <span style={S.costAction}>{c.action}</span>
              <span style={S.costValue}>⚡ {c.cost} credit{c.cost > 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <div className="section-title">BILLING FAQ</div>
        <div style={S.faqList}>
          {[
            ['Do credits roll over?', 'Credits reset each month. Unused credits do not carry over.'],
            ['Can I cancel anytime?', 'Yes. Cancel anytime from this page. You keep access until end of billing period.'],
            ['What payment methods?', 'Credit/debit cards via Stripe. Enterprise can request invoicing.'],
            ['Is there a free trial?', 'Yes — every new account gets 50 free credits. No card required.'],
          ].map(([q, a]) => (
            <div key={q} style={S.faqItem}>
              <div style={S.faqQ}>{q}</div>
              <div style={S.faqA}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' },
  currentBanner: { background: 'var(--surface)', border: '2px solid', borderRadius: 'var(--r2)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' },
  currentLabel: { fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.3rem' },
  currentPlan: { fontSize: '1.6rem', fontWeight: '800', letterSpacing: '0.06em' },
  creditStat: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  creditBig: { fontSize: '2rem', fontWeight: '800', color: 'var(--gold)', lineHeight: 1 },
  creditSmall: { fontSize: '0.72rem', color: 'var(--text-muted)' },
  usageStat: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  usageBig: { fontSize: '2rem', fontWeight: '800', lineHeight: 1 },
  usageSmall: { fontSize: '0.72rem', color: 'var(--text-muted)' },
  successMsg: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', padding: '0.85rem 1.25rem', borderRadius: 'var(--r)', fontWeight: '600', fontSize: '0.9rem' },
  plansGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' },
  planCard: { background: 'var(--surface)', border: '1px solid', borderRadius: 'var(--r2)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative', transition: 'box-shadow 0.2s' },
  currentBadge: { position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', color: '#000', fontSize: '0.62rem', fontWeight: '800', padding: '0.2rem 0.75rem', borderRadius: 'var(--full)', letterSpacing: '0.08em', whiteSpace: 'nowrap' },
  planName: { fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' },
  planPrice: { fontSize: '2.2rem', fontWeight: '800', lineHeight: 1 },
  planPeriod: { fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' },
  planCredits: { fontSize: '0.875rem', color: 'var(--text-dim)' },
  featureList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
  featureItem: { fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', gap: '0.5rem', lineHeight: '1.4' },
  upgradeBtn: { padding: '0.85rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.9rem', border: 'none', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s' },
  stripeNote: { fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' },
  costsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.5rem' },
  costRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '0.75rem 1rem' },
  costIcon: { fontSize: '1rem', flexShrink: 0 },
  costAction: { flex: 1, fontSize: '0.85rem', fontWeight: '500' },
  costValue: { fontSize: '0.78rem', color: 'var(--gold)', fontWeight: '700', flexShrink: 0 },
  faqList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  faqItem: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1rem 1.25rem' },
  faqQ: { fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.35rem' },
  faqA: { fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' },
};
