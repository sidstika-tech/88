import React, { useState, useEffect } from 'react';
import { getTools, runTool } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const DEFAULT_TOOLS = [
  { id: 'logo', name: 'Logo Concept Generator', icon: '🎨', desc: 'AI logo concepts & brand identity', credits: 2 },
  { id: 'name', name: 'Startup Name Generator', icon: '💡', desc: 'Unique, brandable business names', credits: 1 },
  { id: 'pitch', name: 'Pitch Deck Builder', icon: '📊', desc: 'Investor-ready elevator pitch', credits: 2 },
  { id: 'email', name: 'Cold Email Writer', icon: '📧', desc: 'High-converting cold outreach', credits: 1 },
  { id: 'contract', name: 'Contract Generator', icon: '📋', desc: 'Basic service agreements', credits: 2 },
  { id: 'adcopy', name: 'Ad Copy Generator', icon: '📣', desc: 'Meta, Google & social ads', credits: 2 },
];

export default function Tools() {
  const { updateUser } = useAuth();
  const [tools, setTools] = useState(DEFAULT_TOOLS);
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { getTools().then(r => setTools(r.data.tools)).catch(() => {}); }, []);

  const run = async () => {
    if (!selected || !input.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await runTool(selected.id, input.trim());
      setResult(res.data.output);
      if (res.data.credits !== undefined) updateUser({ credits: res.data.credits });
    } catch (e) {
      setError(e.response?.data?.message || 'Tool failed.');
    } finally { setLoading(false); }
  };

  const selectTool = (tool) => { setSelected(tool); setResult(null); setError(''); setInput(''); };

  return (
    <div style={S.page} className="fade-up">
      <div style={S.layout}>
        {/* Tool selector */}
        <div style={S.toolsList}>
          <div className="section-title">AI TOOLS</div>
          {tools.map(tool => (
            <button key={tool.id} onClick={() => selectTool(tool)}
              style={{ ...S.toolBtn, ...(selected?.id === tool.id ? S.toolBtnActive : {}) }}>
              <span style={S.toolIcon}>{tool.icon}</span>
              <div style={S.toolInfo}>
                <div style={S.toolName}>{tool.name}</div>
                <div style={S.toolDesc}>{tool.desc}</div>
              </div>
              <span style={S.toolCredits}>{tool.credits} cr</span>
            </button>
          ))}
        </div>

        {/* Tool workspace */}
        <div style={S.workspace}>
          {!selected ? (
            <div style={S.selectPrompt}>
              <div style={S.selectIcon}>◫</div>
              <h3 style={S.selectTitle}>Select a Tool</h3>
              <p style={S.selectSub}>Choose an AI tool from the left to get started.</p>
              <div style={S.toolPreviewGrid}>
                {tools.map(t => (
                  <button key={t.id} onClick={() => selectTool(t)} style={S.previewCard}>
                    <span style={S.previewIcon}>{t.icon}</span>
                    <span style={S.previewName}>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={S.activeWorkspace}>
              <div style={S.wsHeader}>
                <span style={S.wsIcon}>{selected.icon}</span>
                <div>
                  <div style={S.wsTitle}>{selected.name}</div>
                  <div style={S.wsSub}>{selected.desc}</div>
                </div>
                <span className="badge badge-gold">{selected.credits} credits</span>
              </div>

              <div style={S.wsInput}>
                <label style={S.wsLabel}>
                  {selected.id === 'logo' && 'Business or brand name'}
                  {selected.id === 'name' && 'Describe your business idea'}
                  {selected.id === 'pitch' && 'Your product/startup in one sentence'}
                  {selected.id === 'email' && 'Who are you reaching out to and why?'}
                  {selected.id === 'contract' && 'Service type and basic terms'}
                  {selected.id === 'adcopy' && 'Product/service to advertise'}
                </label>
                <textarea className="input" value={input} onChange={e => setInput(e.target.value)}
                  placeholder={`Describe what you need for ${selected.name.toLowerCase()}...`} rows={4} />
              </div>

              {error && <div style={S.error}>{error}</div>}

              <button onClick={run} disabled={loading || !input.trim()}
                style={{ ...S.runBtn, opacity: loading || !input.trim() ? 0.6 : 1 }}>
                {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderTopColor: '#000' }} /> Running...</> : `${selected.icon} Run ${selected.name} — ${selected.credits} credits`}
              </button>

              {result && !loading && <ToolResult toolId={selected.id} result={result} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolResult({ toolId, result }) {
  const renderValue = (val, depth = 0) => {
    if (typeof val === 'string') return <span style={R.strVal}>{val}</span>;
    if (typeof val === 'number') return <span style={R.numVal}>{val}</span>;
    if (Array.isArray(val)) return (
      <div style={{ ...R.arrayWrap, paddingLeft: depth > 0 ? '1rem' : 0 }}>
        {val.map((item, i) => (
          <div key={i} style={R.arrayItem}>
            <span style={R.arrDot}>·</span>
            {typeof item === 'object' ? renderObject(item, depth + 1) : renderValue(item)}
          </div>
        ))}
      </div>
    );
    if (typeof val === 'object' && val !== null) return renderObject(val, depth);
    return <span style={R.strVal}>{String(val)}</span>;
  };

  const renderObject = (obj, depth = 0) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingLeft: depth > 0 ? '1rem' : 0 }}>
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} style={R.row}>
          <span style={R.key}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
          <div style={R.val}>{renderValue(v, depth + 1)}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={R.box} className="fade-in">
      <div style={R.header}>
        <span style={R.headerTitle}>✓ Result</span>
        <button onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))} style={R.copyBtn}>
          Copy JSON
        </button>
      </div>
      <div style={R.content}>{renderObject(result)}</div>
    </div>
  );
}

const S = {
  page: { maxWidth: '1100px' },
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' },
  toolsList: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'sticky', top: '80px' },
  toolBtn: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem', borderRadius: 'var(--r)', background: 'transparent', border: '1px solid transparent', color: 'var(--text-dim)', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'var(--font-body)', transition: 'all 0.15s' },
  toolBtnActive: { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--text)' },
  toolIcon: { fontSize: '1.2rem', flexShrink: 0 },
  toolInfo: { flex: 1, minWidth: 0 },
  toolName: { fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.15rem', lineHeight: '1.3' },
  toolDesc: { fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4' },
  toolCredits: { fontSize: '0.68rem', fontWeight: '700', color: 'var(--gold)', background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', padding: '0.15rem 0.4rem', borderRadius: 'var(--full)', flexShrink: 0 },
  workspace: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', minHeight: '500px' },
  selectPrompt: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', gap: '1rem', textAlign: 'center' },
  selectIcon: { fontSize: '3rem', color: 'var(--text-muted)' },
  selectTitle: { fontSize: '1.3rem', fontWeight: '700' },
  selectSub: { color: 'var(--text-muted)', fontSize: '0.9rem' },
  toolPreviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', width: '100%', maxWidth: '480px', marginTop: '0.5rem' },
  previewCard: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1rem', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', transition: 'border-color 0.15s' },
  previewIcon: { fontSize: '1.4rem' },
  previewName: { fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.3' },
  activeWorkspace: { padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  wsHeader: { display: 'flex', alignItems: 'flex-start', gap: '0.85rem' },
  wsIcon: { fontSize: '1.5rem', flexShrink: 0 },
  wsTitle: { fontSize: '1rem', fontWeight: '700', marginBottom: '0.15rem' },
  wsSub: { fontSize: '0.8rem', color: 'var(--text-muted)' },
  wsInput: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  wsLabel: { fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.65rem 1rem', borderRadius: 'var(--r)', fontSize: '0.85rem' },
  runBtn: { background: 'var(--gold)', color: '#000', padding: '0.9rem 1.5rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s' },
};

const R = {
  box: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--surface3)' },
  headerTitle: { fontSize: '0.82rem', fontWeight: '700', color: '#10b981' },
  copyBtn: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '0.3rem 0.65rem', borderRadius: 'var(--r)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--font-body)' },
  content: { padding: '1.25rem', maxHeight: '480px', overflowY: 'auto' },
  row: { display: 'flex', gap: '0.85rem', alignItems: 'flex-start', paddingBottom: '0.6rem', borderBottom: '1px solid var(--border)' },
  key: { width: '140px', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, paddingTop: '2px' },
  val: { flex: 1, fontSize: '0.85rem' },
  strVal: { color: 'var(--text-dim)', lineHeight: '1.6' },
  numVal: { color: 'var(--gold)', fontWeight: '700' },
  arrayWrap: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  arrayItem: { display: 'flex', gap: '0.5rem', alignItems: 'flex-start' },
  arrDot: { color: 'var(--gold)', flexShrink: 0, lineHeight: '1.6' },
};
