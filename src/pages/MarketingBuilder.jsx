import React, { useState } from 'react';
import { generateMarketing } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const PLATFORMS = [
  { id: 'all', label: 'Full Strategy', icon: '◈' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'ads', label: 'Paid Ads', icon: '📣' },
  { id: 'seo', label: 'SEO & Blog', icon: '🔍' },
  { id: 'email', label: 'Email', icon: '📧' },
];

export default function MarketingBuilder() {
  const { updateUser } = useAuth();
  const [business, setBusiness] = useState('');
  const [platform, setPlatform] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('instagram');

  const generate = async () => {
    if (!business.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await generateMarketing(business.trim(), platform);
      setResult(res.data.data);
      if (res.data.credits !== undefined) updateUser({ credits: res.data.credits });
    } catch (e) {
      setError(e.response?.data?.message || 'Generation failed.');
    } finally { setLoading(false); }
  };

  const RESULT_TABS = ['instagram', 'tiktok', 'ads', 'seo', 'email'];

  return (
    <div style={S.page} className="fade-up">
      {/* Input */}
      <div style={S.inputCard}>
        <div style={S.inputHeader}>
          <h2 style={S.inputTitle}>◈ Marketing Builder</h2>
          <span className="badge badge-gold">4 credits</span>
        </div>
        <div style={S.inputRow}>
          <input className="input" value={business} onChange={e => setBusiness(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder="Enter your business name or product..." style={{ flex: 1 }} />
          <div style={S.platformSelect}>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                style={{ ...S.platBtn, ...(platform === p.id ? S.platBtnActive : {}) }}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={generate} disabled={loading || !business.trim()}
          style={{ ...S.genBtn, opacity: loading || !business.trim() ? 0.6 : 1 }}>
          {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderTopColor: '#000' }} /> Building Strategy...</> : '◈ Generate Marketing Strategy — 4 credits'}
        </button>
        {error && <div style={S.error}>{error}</div>}
      </div>

      {loading && (
        <div style={S.loadingBox}>
          <span className="spinner spinner-lg" />
          <p>Building your complete marketing strategy...</p>
          <div style={S.loadingItems}>
            {['Instagram Content Plan', 'TikTok Strategy', 'Ad Copy', 'SEO Blog Plan', 'Email Sequence'].map((item, i) => (
              <div key={item} style={S.loadingItem}><span className="spinner" style={{ width: 12, height: 12 }} />{item}</div>
            ))}
          </div>
        </div>
      )}

      {result && !loading && (
        <div style={S.results} className="fade-up">
          <div style={S.tabs}>
            {RESULT_TABS.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ ...S.tab, ...(activeTab === t ? S.tabActive : {}) }}>
                {PLATFORMS.find(p => p.id === t)?.icon} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div style={S.tabContent}>
            {activeTab === 'instagram' && result.instagram && (
              <div style={S.section}>
                <div style={S.stratBox}>
                  <div className="section-title">STRATEGY</div>
                  <p style={S.stratText}>{result.instagram.strategy}</p>
                  <div style={S.metaRow}>
                    <span style={S.metaKey}>Posting Schedule:</span>
                    <span style={S.metaVal}>{result.instagram.postingSchedule}</span>
                  </div>
                </div>
                <div className="section-title" style={{ marginTop: '1.5rem' }}>CONTENT PILLARS</div>
                <div style={S.pillarsRow}>
                  {(result.instagram.contentPillars || []).map((p, i) => (
                    <div key={i} style={S.pillar}>{p}</div>
                  ))}
                </div>
                <div className="section-title" style={{ marginTop: '1.5rem' }}>POST IDEAS</div>
                <div style={S.postGrid}>
                  {(result.instagram.postIdeas || []).map((p, i) => (
                    <div key={i} style={S.postCard}>
                      <div style={S.postType}>{p.type}</div>
                      <div style={S.postHook}>🪝 {p.hook}</div>
                      <div style={S.postCaption}>{p.caption}</div>
                      <div style={S.postHashtags}>{(p.hashtags || []).map(h => `#${h}`).join(' ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tiktok' && result.tiktok && (
              <div style={S.section}>
                <div style={S.stratBox}>
                  <div className="section-title">TIKTOK STRATEGY</div>
                  <p style={S.stratText}>{result.tiktok.strategy}</p>
                </div>
                <div className="section-title" style={{ marginTop: '1.5rem' }}>TRENDING ANGLES</div>
                <div style={S.pillarsRow}>
                  {(result.tiktok.trends || []).map((t, i) => <div key={i} style={S.pillar}>{t}</div>)}
                </div>
                <div className="section-title" style={{ marginTop: '1.5rem' }}>VIDEO IDEAS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {(result.tiktok.videoIdeas || []).map((v, i) => (
                    <div key={i} style={S.videoCard}>
                      <div style={S.videoNum}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={S.videoTitle}>{v.title}</div>
                        <div style={S.videoHook}>Hook: "{v.hook}"</div>
                        <div style={S.videoMeta}>{v.duration} · CTA: {v.cta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ads' && result.ads && (
              <div style={S.section}>
                <div className="section-title">META / FACEBOOK AD</div>
                <div style={S.adCard}>
                  <div style={S.adPlatform}>Facebook / Instagram Ad</div>
                  <div style={S.adHeadline}>{result.ads.metaAd?.headline}</div>
                  <div style={S.adBody}>{result.ads.metaAd?.primaryText}</div>
                  <div style={S.adRow}>
                    <span style={S.adCta}>CTA: {result.ads.metaAd?.cta}</span>
                    <span style={S.adAudience}>👥 {result.ads.metaAd?.audience}</span>
                  </div>
                </div>
                <div className="section-title" style={{ marginTop: '1.5rem' }}>GOOGLE AD</div>
                <div style={S.adCard}>
                  <div style={S.adPlatform}>Google Search Ad</div>
                  <div style={S.adHeadline}>{result.ads.googleAd?.headline}</div>
                  <div style={S.adBody}>{result.ads.googleAd?.description}</div>
                  <div style={S.tagsRow}>
                    {(result.ads.googleAd?.keywords || []).map(k => <span key={k} style={S.kw}>{k}</span>)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && result.seo && (
              <div style={S.section}>
                <div style={S.stratBox}>
                  <div className="section-title">SEO STRATEGY</div>
                  <p style={S.stratText}>{result.seo.strategy}</p>
                  <div style={S.metaRow}>
                    <span style={S.metaKey}>Pillar Content:</span>
                    <span style={S.metaVal}>{result.seo.pillarContent}</span>
                  </div>
                </div>
                <div className="section-title" style={{ marginTop: '1.5rem' }}>BLOG TOPICS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(result.seo.blogTopics || []).map((b, i) => (
                    <div key={i} style={S.blogRow}>
                      <div style={S.blogTitle}>{b.title}</div>
                      <div style={S.blogMeta}>
                        <span style={S.blogKw}>🔑 {b.keyword}</span>
                        <span style={S.blogIntent}>{b.intent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'email' && result.email && (
              <div style={S.section}>
                <div style={S.stratBox}>
                  <div className="section-title">EMAIL STRATEGY</div>
                  <p style={S.stratText}>{result.email.strategy}</p>
                </div>
                <div className="section-title" style={{ marginTop: '1.5rem' }}>EMAIL SEQUENCE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {(result.email.sequence || []).map((e, i) => (
                    <div key={i} style={S.emailCard}>
                      <div style={S.emailDay}>Day {e.day}</div>
                      <div style={{ flex: 1 }}>
                        <div style={S.emailSubject}>📧 {e.subject}</div>
                        <div style={S.emailPreview}>{e.preview}</div>
                        <div style={S.emailGoal}>Goal: {e.goal}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={S.actionBar}>
            <Link to="/generator" style={S.actionBtn}>⚡ Generate Store</Link>
            <Link to="/vault" style={S.actionBtn}>▣ View in Vault</Link>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1000px' },
  inputCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  inputHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  inputTitle: { fontSize: '1rem', fontWeight: '700' },
  inputRow: { display: 'flex', gap: '0.85rem', flexWrap: 'wrap' },
  platformSelect: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  platBtn: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '0.5rem 0.85rem', borderRadius: 'var(--r)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.3rem' },
  platBtnActive: { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold)' },
  genBtn: { background: 'var(--gold)', color: '#000', padding: '0.9rem 1.5rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.65rem 1rem', borderRadius: 'var(--r)', fontSize: '0.85rem' },
  loadingBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--r2)', border: '1px solid var(--border)', textAlign: 'center' },
  loadingItems: { display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center', marginTop: '0.5rem' },
  loadingItem: { display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--full)', padding: '0.3rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' },
  results: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', overflow: 'hidden' },
  tabs: { display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', overflowX: 'auto' },
  tab: { background: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: 'var(--text-muted)', padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' },
  tabActive: { color: 'var(--gold)', borderBottomColor: 'var(--gold)' },
  tabContent: { padding: '1.5rem' },
  section: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  stratBox: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  stratText: { color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.7' },
  metaRow: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start' },
  metaKey: { fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', flexShrink: 0 },
  metaVal: { fontSize: '0.85rem', color: 'var(--text-dim)' },
  pillarsRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  pillar: { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: '600', padding: '0.3rem 0.75rem', borderRadius: 'var(--full)' },
  postGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginTop: '0.5rem' },
  postCard: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  postType: { fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)' },
  postHook: { fontSize: '0.82rem', fontWeight: '700', color: 'var(--text)' },
  postCaption: { fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.5', flex: 1 },
  postHashtags: { fontSize: '0.72rem', color: '#3b82f6', lineHeight: '1.5' },
  videoCard: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' },
  videoNum: { width: '28px', height: '28px', background: 'var(--gold)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 },
  videoTitle: { fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.3rem' },
  videoHook: { fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic', marginBottom: '0.3rem' },
  videoMeta: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  adCard: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  adPlatform: { fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)' },
  adHeadline: { fontSize: '1.1rem', fontWeight: '800', color: '#3b82f6' },
  adBody: { fontSize: '0.875rem', color: 'var(--text-dim)', lineHeight: '1.6' },
  adRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  adCta: { fontSize: '0.78rem', fontWeight: '700', color: '#10b981' },
  adAudience: { fontSize: '0.78rem', color: 'var(--text-muted)' },
  tagsRow: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem' },
  kw: { background: 'var(--surface3)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: 'var(--full)' },
  blogRow: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '0.85rem 1rem' },
  blogTitle: { fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.35rem' },
  blogMeta: { display: 'flex', gap: '1rem' },
  blogKw: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  blogIntent: { fontSize: '0.75rem', color: '#8b5cf6', fontWeight: '600' },
  emailCard: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' },
  emailDay: { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold)', fontSize: '0.72rem', fontWeight: '800', padding: '0.2rem 0.5rem', borderRadius: 'var(--r)', flexShrink: 0, whiteSpace: 'nowrap' },
  emailSubject: { fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.25rem' },
  emailPreview: { fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.25rem' },
  emailGoal: { fontSize: '0.75rem', color: '#10b981', fontWeight: '600' },
  actionBar: { borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', background: 'var(--surface2)' },
  actionBtn: { background: 'var(--surface3)', border: '1px solid var(--border)', color: 'var(--text-dim)', padding: '0.5rem 1rem', borderRadius: 'var(--r)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none' },
};
