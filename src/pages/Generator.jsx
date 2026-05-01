import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateBusiness, getCategories } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const DEFAULT_CATS = [
  { id: 'ecommerce', label: 'Ecommerce Store', icon: '🛍️', credits: 5 },
  { id: 'agency', label: 'Agency', icon: '🏢', credits: 5 },
  { id: 'saas', label: 'SaaS Product', icon: '⚙️', credits: 5 },
  { id: 'local', label: 'Local Business', icon: '📍', credits: 5 },
  { id: 'dropshipping', label: 'Dropshipping', icon: '📦', credits: 5 },
  { id: 'ai-startup', label: 'AI Startup', icon: '🤖', credits: 5 },
];

const EXAMPLES = [
  'Luxury candle subscription box for wellness lovers',
  'AI-powered resume builder for tech professionals',
  'Organic dog food delivery for urban pet owners',
  'Freelance design agency specializing in Web3 brands',
  'SaaS tool for restaurant inventory management',
  'TikTok growth agency for e-commerce brands',
];

export default function Generator() {
  const { user, updateUser } = useAuth();
  const [categories, setCategories] = useState(DEFAULT_CATS);
  const [selectedCat, setSelectedCat] = useState('ecommerce');
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState('');

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.categories)).catch(() => {});
  }, []);

  const generate = async () => {
    if (!idea.trim()) return;
    setLoading(true); setError(''); setResult(null);
    const steps = ['Analyzing idea...', 'Building business plan...', 'Generating products...', 'Creating store...', 'Packaging ZIP...'];
    let si = 0;
    const interval = setInterval(() => { setStep(steps[Math.min(si++, steps.length - 1)]); }, 1800);
    try {
      const res = await generateBusiness(idea.trim(), selectedCat);
      setResult(res.data);
      if (res.data.credits !== undefined) updateUser({ credits: res.data.credits });
    } catch (e) {
      setError(e.response?.data?.code === 'NO_CREDITS' ? 'Not enough credits. Please upgrade.' : e.response?.data?.message || 'Generation failed.');
    } finally { clearInterval(interval); setLoading(false); setStep(''); }
  };

  return (
    <div style={S.page} className="fade-up">
      <div style={S.layout}>
        {/* Left: Input panel */}
        <div style={S.inputPanel}>
          <div style={S.panelHeader}>
            <h2 style={S.panelTitle}>⚡ Business Generator</h2>
            <span className="badge badge-gold">5 credits</span>
          </div>

          <div style={S.field}>
            <label style={S.label}>CATEGORY</label>
            <div style={S.catGrid}>
              {categories.map(c => (
                <button key={c.id} onClick={() => setSelectedCat(c.id)} style={{ ...S.catBtn, ...(selectedCat === c.id ? S.catBtnActive : {}) }}>
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>YOUR BUSINESS IDEA</label>
            <textarea
              className="input"
              value={idea}
              onChange={e => setIdea(e.target.value)}
              placeholder="Describe your business idea in detail..."
              rows={5}
            />
          </div>

          <div style={S.examplesRow}>
            <span style={S.exLabel}>Try an example:</span>
            {EXAMPLES.slice(0,3).map(ex => (
              <button key={ex} onClick={() => setIdea(ex)} style={S.exBtn}>{ex.slice(0,35)}...</button>
            ))}
          </div>

          <button onClick={generate} disabled={loading || !idea.trim()} style={{ ...S.genBtn, opacity: loading || !idea.trim() ? 0.6 : 1 }}>
            {loading ? <><span className="spinner" style={{width:18,height:18,borderTopColor:'#000'}} /> {step || 'Generating...'}</> : '⚡ Generate Business — 5 credits'}
          </button>

          {error && <div style={S.errorBox}>{error} {error.includes('credits') && <Link to="/billing" style={{ color: 'var(--gold)', fontWeight: '700' }}>Upgrade →</Link>}</div>}
        </div>

        {/* Right: Result panel */}
        <div style={S.resultPanel}>
          {loading && (
            <div style={S.loadingState}>
              <div style={S.loadingRing} />
              <p style={S.loadingText}>{step}</p>
              <p style={S.loadingSubtext}>AI is building your business...</p>
              <div style={S.loadingSteps}>
                {['Business Plan', 'Products (8)', 'Store HTML', 'ZIP File'].map((s, i) => (
                  <div key={s} style={S.loadingStep}>
                    <div style={{ ...S.loadingStepDot, background: i < 2 ? 'var(--gold)' : 'var(--surface3)' }} />
                    <span style={{ color: i < 2 ? 'var(--text)' : 'var(--text-muted)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!result && !loading && (
            <div style={S.emptyResult}>
              <div style={S.emptyIcon}>⚡</div>
              <h3 style={S.emptyTitle}>Ready to Generate</h3>
              <p style={S.emptySub}>Describe your idea and click generate. AI will create a complete business plan, 8 products, and a downloadable store.</p>
              <div style={S.emptyFeatures}>
                {['✓ Business plan & strategy', '✓ 8 AI-generated products', '✓ Brand identity & colors', '✓ Competitor analysis', '✓ Revenue roadmap', '✓ Downloadable HTML store'].map(f => (
                  <div key={f} style={S.emptyFeature}>{f}</div>
                ))}
              </div>
            </div>
          )}

          {result && !loading && <BusinessResult result={result} />}
        </div>
      </div>
    </div>
  );
}

function BusinessResult({ result }) {
  const { business, downloadUrl } = result;
  const [activeTab, setActiveTab] = useState('overview');
  const TABS = ['overview', 'products', 'roadmap', 'competitors'];

  return (
    <div style={R.box} className="fade-up">
      {/* Header */}
      <div style={{ ...R.header, borderLeft: `4px solid ${business.themeColor}` }}>
        <div>
          <div style={R.bizName}>{business.name}</div>
          <div style={R.bizTagline}>{business.tagline}</div>
        </div>
        {downloadUrl && (
          <a href={downloadUrl} target="_blank" rel="noreferrer" style={R.downloadBtn}>↓ Download ZIP</a>
        )}
      </div>

      {/* Tabs */}
      <div style={R.tabs}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ ...R.tab, ...(activeTab === t ? R.tabActive : {}) }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={R.content}>
        {activeTab === 'overview' && (
          <div style={R.overviewGrid}>
            {[
              ['Niche', business.niche],
              ['Target Market', business.targetMarket],
              ['Business Model', business.model],
              ['Revenue Streams', business.revenue],
              ['USP', business.usp],
              ['Style', business.style],
            ].map(([k, v]) => (
              <div key={k} style={R.metaRow}>
                <span style={R.metaKey}>{k}</span>
                <span style={R.metaVal}>{v}</span>
              </div>
            ))}
            {business.risks?.length > 0 && (
              <div style={R.metaRow}>
                <span style={R.metaKey}>Risks</span>
                <span style={R.metaVal}>{business.risks.join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div style={R.productsGrid}>
            {(business.products || []).map((p, i) => (
              <div key={i} style={R.productCard}>
                <div style={R.productEmoji}>{p.emoji}</div>
                <div style={R.productName}>{p.name}</div>
                <div style={R.productDesc}>{p.description}</div>
                <div style={{ ...R.productPrice, color: business.themeColor }}>${Number(p.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div style={R.roadmapList}>
            {(business.roadmap || []).map((step, i) => (
              <div key={i} style={R.roadmapItem}>
                <div style={{ ...R.roadmapDot, background: business.themeColor }} />
                <div style={R.roadmapLine} />
                <div style={R.roadmapText}>{step}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'competitors' && (
          <div style={R.competitorList}>
            {(business.competitors || []).map((c, i) => (
              <div key={i} style={R.competitorItem}>
                <div style={R.compNum}>{i + 1}</div>
                <div style={R.compName}>{c}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div style={R.actionBar}>
        <Link to="/marketing" state={{ business: business.name }} style={R.actionBtn}>◈ Build Marketing Plan</Link>
        <Link to="/market" state={{ niche: business.niche }} style={R.actionBtn}>◉ Research Market</Link>
        <Link to="/vault" style={R.actionBtn}>▣ View in Vault</Link>
      </div>
    </div>
  );
}

const S = {
  page: { maxWidth: '1200px' },
  layout: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem', alignItems: 'start' },
  inputPanel: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '80px' },
  panelHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle: { fontSize: '1rem', fontWeight: '700' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' },
  catGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' },
  catBtn: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-dim)', padding: '0.6rem 0.75rem', borderRadius: 'var(--r)', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)', transition: 'all 0.15s' },
  catBtnActive: { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--text)' },
  examplesRow: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  exLabel: { fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  exBtn: { background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', padding: '0.2rem 0', fontFamily: 'var(--font-body)', transition: 'color 0.15s' },
  genBtn: { background: 'var(--gold)', color: '#000', padding: '0.9rem 1.5rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s' },
  errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: 'var(--r)', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  resultPanel: { minHeight: '500px' },
  loadingState: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' },
  loadingRing: { width: '56px', height: '56px', border: '3px solid var(--surface3)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  loadingText: { fontSize: '1rem', fontWeight: '600', color: 'var(--gold)' },
  loadingSubtext: { color: 'var(--text-muted)', fontSize: '0.875rem' },
  loadingSteps: { display: 'flex', gap: '1.5rem', marginTop: '0.5rem' },
  loadingStep: { display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' },
  loadingStepDot: { width: '8px', height: '8px', borderRadius: '50%' },
  emptyResult: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' },
  emptyIcon: { fontSize: '3rem', color: 'var(--gold)' },
  emptyTitle: { fontSize: '1.3rem', fontWeight: '700' },
  emptySub: { color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', lineHeight: '1.65' },
  emptyFeatures: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.5rem', textAlign: 'left', width: '100%', maxWidth: '360px' },
  emptyFeature: { fontSize: '0.8rem', color: 'var(--text-dim)' },
};

const R = {
  box: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  header: { padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', gap: '1rem' },
  bizName: { fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.3rem' },
  bizTagline: { color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' },
  downloadBtn: { background: 'var(--gold)', color: '#000', padding: '0.6rem 1.25rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none', flexShrink: 0 },
  tabs: { display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 1.5rem' },
  tab: { background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', borderBottom: '2px solid transparent', fontFamily: 'var(--font-body)', transition: 'all 0.15s', textTransform: 'capitalize' },
  tabActive: { color: 'var(--gold)', borderBottomColor: 'var(--gold)' },
  content: { padding: '1.5rem', flex: 1 },
  overviewGrid: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  metaRow: { display: 'flex', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' },
  metaKey: { width: '140px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 },
  metaVal: { fontSize: '0.875rem', color: 'var(--text)', lineHeight: '1.5', flex: 1 },
  productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' },
  productCard: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  productEmoji: { fontSize: '1.8rem' },
  productName: { fontSize: '0.875rem', fontWeight: '700' },
  productDesc: { fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5', flex: 1 },
  productPrice: { fontSize: '1.1rem', fontWeight: '800' },
  roadmapList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  roadmapItem: { display: 'flex', alignItems: 'flex-start', gap: '1rem' },
  roadmapDot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0, marginTop: '3px' },
  roadmapLine: { display: 'none' },
  roadmapText: { fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' },
  competitorList: { display: 'flex', flexDirection: 'column', gap: '0.65rem' },
  competitorItem: { display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '0.85rem 1rem' },
  compNum: { width: '24px', height: '24px', background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800', flexShrink: 0 },
  compName: { fontSize: '0.875rem', fontWeight: '600' },
  actionBar: { borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', background: 'var(--surface2)', flexWrap: 'wrap' },
  actionBtn: { background: 'var(--surface3)', border: '1px solid var(--border)', color: 'var(--text-dim)', padding: '0.5rem 1rem', borderRadius: 'var(--r)', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'none', transition: 'all 0.15s' },
};
