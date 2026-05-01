import React, { useState, useEffect } from 'react';
import { getTrending, doResearch } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export default function MarketResearch() {
  const { updateUser } = useAuth();
  const [trending, setTrending] = useState([]);
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { getTrending().then(r => setTrending(r.data.trending)).catch(() => {}); }, []);

  const research = async () => {
    if (!niche.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await doResearch(niche.trim());
      setResult(res.data.data);
      if (res.data.credits !== undefined) updateUser({ credits: res.data.credits });
    } catch (e) {
      setError(e.response?.data?.message || 'Research failed. Please try again.');
    } finally { setLoading(false); }
  };

  const scoreColor = (v) => v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={S.page} className="fade-up">
      {/* Trending */}
      <section style={S.trendingSection}>
        <div className="section-title">🔥 TRENDING NICHES</div>
        <div style={S.trendGrid}>
          {trending.map(t => (
            <button key={t.niche} onClick={() => setNiche(t.niche)} style={S.trendCard}>
              <div style={S.trendHeader}>
                <span style={S.trendNiche}>{t.niche}</span>
                <span style={{ ...S.trendGrowth, color: '#10b981' }}>{t.growth}</span>
              </div>
              <div style={S.trendBars}>
                <div style={S.trendBarRow}>
                  <span style={S.trendBarLabel}>Demand</span>
                  <div style={S.trendBarOuter}><div style={{ ...S.trendBarInner, width: `${t.demandScore}%`, background: scoreColor(t.demandScore) }} /></div>
                  <span style={{ ...S.trendBarNum, color: scoreColor(t.demandScore) }}>{t.demandScore}</span>
                </div>
                <div style={S.trendBarRow}>
                  <span style={S.trendBarLabel}>Profit</span>
                  <div style={S.trendBarOuter}><div style={{ ...S.trendBarInner, width: `${t.profitScore}%`, background: scoreColor(t.profitScore) }} /></div>
                  <span style={{ ...S.trendBarNum, color: scoreColor(t.profitScore) }}>{t.profitScore}</span>
                </div>
              </div>
              <span style={{ ...S.compBadge, color: t.competition === 'Low' ? '#10b981' : t.competition === 'Medium' ? '#f59e0b' : '#ef4444' }}>
                {t.competition} Competition
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Research input */}
      <section style={S.inputSection}>
        <div style={S.inputCard}>
          <div style={S.inputHeader}>
            <h2 style={S.inputTitle}>Deep Market Research</h2>
            <span className="badge badge-gold">3 credits</span>
          </div>
          <div style={S.inputRow}>
            <input className="input" value={niche} onChange={e => setNiche(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && research()}
              placeholder="Enter a niche, market, or product category..." style={{ flex: 1 }} />
            <button onClick={research} disabled={loading || !niche.trim()} style={{ ...S.researchBtn, opacity: loading || !niche.trim() ? 0.6 : 1 }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderTopColor: '#000' }} /> Analyzing...</> : '◉ Research'}
            </button>
          </div>
          {error && <div style={S.error}>{error}</div>}
        </div>
      </section>

      {/* Results */}
      {loading && (
        <div style={S.loadingBox}>
          <span className="spinner spinner-lg" />
          <p>AI is analyzing the market...</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Scanning competitors, pricing, demand signals...</p>
        </div>
      )}

      {result && !loading && (
        <div style={S.results} className="fade-up">
          {/* Score cards */}
          <div style={S.scoreRow}>
            <div style={S.scoreCard}>
              <div style={{ ...S.scoreNum, color: scoreColor(result.demandScore) }}>{result.demandScore}</div>
              <div style={S.scoreLabel}>Demand Score</div>
              <div style={S.scoreBar}><div style={{ ...S.scoreBarFill, width: `${result.demandScore}%`, background: scoreColor(result.demandScore) }} /></div>
            </div>
            <div style={S.scoreCard}>
              <div style={{ ...S.scoreNum, color: scoreColor(result.profitScore) }}>{result.profitScore}</div>
              <div style={S.scoreLabel}>Profit Score</div>
              <div style={S.scoreBar}><div style={{ ...S.scoreBarFill, width: `${result.profitScore}%`, background: scoreColor(result.profitScore) }} /></div>
            </div>
            <div style={S.scoreCard}>
              <div style={S.scoreMeta}>{result.marketSize}</div>
              <div style={S.scoreLabel}>Market Size</div>
            </div>
            <div style={S.scoreCard}>
              <div style={{ ...S.scoreMeta, color: '#10b981' }}>{result.growthRate}</div>
              <div style={S.scoreLabel}>Growth Rate</div>
            </div>
          </div>

          {/* Overview */}
          <div className="card">
            <div className="section-title">MARKET OVERVIEW</div>
            <p style={S.overviewText}>{result.overview}</p>
            <div style={S.tagsRow}>
              {(result.keywords || []).map(k => <span key={k} style={S.tag}>{k}</span>)}
            </div>
          </div>

          <div style={S.twoCol}>
            {/* Trends */}
            <div className="card">
              <div className="section-title">TOP TRENDS</div>
              {(result.topTrends || []).map((t, i) => (
                <div key={i} style={S.listItem}>
                  <span style={S.listNum}>{i + 1}</span>
                  <span style={S.listText}>{t}</span>
                </div>
              ))}
            </div>
            {/* Opportunities */}
            <div className="card">
              <div className="section-title">OPPORTUNITIES</div>
              {(result.opportunities || []).map((o, i) => (
                <div key={i} style={S.listItem}>
                  <span style={{ ...S.listNum, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>✓</span>
                  <span style={S.listText}>{o}</span>
                </div>
              ))}
              <div className="section-title" style={{ marginTop: '1rem' }}>THREATS</div>
              {(result.threats || []).map((t, i) => (
                <div key={i} style={S.listItem}>
                  <span style={{ ...S.listNum, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>!</span>
                  <span style={S.listText}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <div className="section-title">PRICING LANDSCAPE</div>
            <div style={S.priceRow}>
              {Object.entries(result.priceRanges || {}).map(([tier, price]) => (
                <div key={tier} style={S.priceCard}>
                  <div style={S.priceTier}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</div>
                  <div style={S.priceVal}>{price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitors */}
          <div className="card">
            <div className="section-title">COMPETITOR BREAKDOWN</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {(result.competitors || []).map((c, i) => (
                <div key={i} style={S.compCard}>
                  <div style={S.compRank}>#{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={S.compName}>{c.name}</div>
                    <div style={S.compDesc}>{c.description}</div>
                    <div style={S.compRow}>
                      <span style={S.compPricing}>💰 {c.pricing}</span>
                      <span style={S.compWeak}>⚠ {c.weakness}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA to generator */}
          <div style={S.ctaBar}>
            <p style={S.ctaText}>Ready to build in this market?</p>
            <Link to="/generator" style={S.ctaBtn}>⚡ Generate Business →</Link>
            <Link to="/marketing" style={S.ctaBtn2}>◈ Build Marketing Plan</Link>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1100px' },
  trendingSection: {},
  trendGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  trendCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.25rem', cursor: 'pointer', textAlign: 'left', color: 'var(--text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', gap: '0.85rem', transition: 'border-color 0.15s', width: '100%' },
  trendHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  trendNiche: { fontSize: '0.9rem', fontWeight: '700' },
  trendGrowth: { fontSize: '0.8rem', fontWeight: '700' },
  trendBars: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  trendBarRow: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  trendBarLabel: { fontSize: '0.7rem', color: 'var(--text-muted)', width: '45px', flexShrink: 0 },
  trendBarOuter: { flex: 1, height: '4px', background: 'var(--surface3)', borderRadius: '2px', overflow: 'hidden' },
  trendBarInner: { height: '100%', borderRadius: '2px', transition: 'width 0.5s ease' },
  trendBarNum: { fontSize: '0.75rem', fontWeight: '700', width: '24px', textAlign: 'right' },
  compBadge: { fontSize: '0.7rem', fontWeight: '600' },
  inputSection: {},
  inputCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  inputHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  inputTitle: { fontSize: '1rem', fontWeight: '700' },
  inputRow: { display: 'flex', gap: '0.85rem' },
  researchBtn: { background: 'var(--gold)', color: '#000', padding: '0.75rem 1.5rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', transition: 'opacity 0.2s' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.65rem 1rem', borderRadius: 'var(--r)', fontSize: '0.85rem' },
  loadingBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--r2)', border: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'center' },
  results: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  scoreRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' },
  scoreCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  scoreNum: { fontSize: '2.5rem', fontWeight: '800', lineHeight: 1 },
  scoreMeta: { fontSize: '1.4rem', fontWeight: '800', lineHeight: 1 },
  scoreLabel: { fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  scoreBar: { height: '3px', background: 'var(--surface3)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.5rem' },
  scoreBarFill: { height: '100%', borderRadius: '2px' },
  overviewText: { color: 'var(--text-dim)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '1rem' },
  tagsRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  tag: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--full)' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  listItem: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' },
  listNum: { width: '22px', height: '22px', background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800', flexShrink: 0 },
  listText: { fontSize: '0.875rem', color: 'var(--text-dim)', lineHeight: '1.5' },
  priceRow: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  priceCard: { flex: 1, minWidth: '120px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1.25rem', textAlign: 'center' },
  priceTier: { fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' },
  priceVal: { fontSize: '1.6rem', fontWeight: '800', color: 'var(--gold)' },
  compCard: { display: 'flex', gap: '1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1rem' },
  compRank: { width: '28px', height: '28px', background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0, color: 'var(--text-muted)' },
  compName: { fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.2rem' },
  compDesc: { fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: '1.5' },
  compRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  compPricing: { fontSize: '0.78rem', color: 'var(--text-dim)' },
  compWeak: { fontSize: '0.78rem', color: '#f59e0b' },
  ctaBar: { background: 'var(--surface)', border: '1px solid var(--gold-border)', borderRadius: 'var(--r2)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  ctaText: { flex: 1, fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dim)' },
  ctaBtn: { background: 'var(--gold)', color: '#000', padding: '0.6rem 1.25rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' },
  ctaBtn2: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-dim)', padding: '0.6rem 1.25rem', borderRadius: 'var(--r)', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none' },
};
