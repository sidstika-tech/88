import React, { useState, useEffect } from 'react';
import { getVault, deleteVaultItem } from '../services/api.js';
import { Link } from 'react-router-dom';

const TYPE_CONFIG = {
  business: { icon: '⚡', color: '#f59e0b', label: 'Business' },
  research: { icon: '◉', color: '#3b82f6', label: 'Research' },
  marketing: { icon: '◈', color: '#8b5cf6', label: 'Marketing' },
  tool: { icon: '◫', color: '#ec4899', label: 'Tool' },
  chat: { icon: '◎', color: '#10b981', label: 'Chat' },
  store: { icon: '🏪', color: '#f59e0b', label: 'Store' },
};

const FILTERS = ['all', 'business', 'research', 'marketing', 'tool'];

export default function Vault() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { fetchVault(); }, [filter, page]);

  const fetchVault = async () => {
    setLoading(true);
    try {
      const res = await getVault(filter, page);
      setItems(res.data.items);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await deleteVaultItem(id);
    setItems(prev => prev.filter(i => i._id !== id));
    setTotal(t => t - 1);
  };

  return (
    <div style={S.page} className="fade-up">
      <div style={S.header}>
        <div>
          <h2 style={S.title}>Project Vault</h2>
          <p style={S.sub}>{total} saved {total === 1 ? 'item' : 'items'}</p>
        </div>
        <Link to="/generator" style={S.newBtn}>⚡ New Generation</Link>
      </div>

      {/* Filters */}
      <div style={S.filters}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => { setFilter(f); setPage(1); }}
            style={{ ...S.filterBtn, ...(filter === f ? S.filterActive : {}) }}>
            {f === 'all' ? 'All' : TYPE_CONFIG[f]?.icon + ' ' + TYPE_CONFIG[f]?.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={S.loadingGrid}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: 'var(--r2)' }} />)}
        </div>
      ) : items.length === 0 ? (
        <div style={S.empty}>
          <div style={S.emptyIcon}>▣</div>
          <h3 style={S.emptyTitle}>Vault is empty</h3>
          <p style={S.emptySub}>Start generating to save work here.</p>
          <Link to="/generator" style={S.emptyBtn}>Generate Something →</Link>
        </div>
      ) : (
        <>
          <div style={S.grid}>
            {items.map(item => {
              const tc = TYPE_CONFIG[item.type] || TYPE_CONFIG.business;
              const isOpen = expanded === item._id;
              return (
                <div key={item._id} style={{ ...S.card, ...(isOpen ? S.cardOpen : {}) }}>
                  <div style={S.cardHeader}>
                    <div style={{ ...S.typeIcon, color: tc.color }}>{tc.icon}</div>
                    <div style={S.cardMeta}>
                      <div style={S.cardTitle}>{item.title}</div>
                      <div style={S.cardSub}>{tc.label} · {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                    <div style={S.cardBadge}>-{item.creditsUsed} cr</div>
                  </div>

                  <div style={S.cardActions}>
                    <button onClick={() => setExpanded(isOpen ? null : item._id)} style={S.actionBtn}>
                      {isOpen ? '▲ Collapse' : '▼ Preview'}
                    </button>
                    {item.downloadUrl && (
                      <a href={item.downloadUrl} target="_blank" rel="noreferrer" style={S.dlBtn}>↓ ZIP</a>
                    )}
                    <button onClick={() => handleDelete(item._id)} style={S.deleteBtn}>✕</button>
                  </div>

                  {isOpen && (
                    <div style={S.preview} className="fade-in">
                      {item.type === 'business' && item.output && (
                        <div style={S.previewContent}>
                          <div style={S.previewRow}><span style={S.pk}>Name:</span><span style={S.pv}>{item.output.name}</span></div>
                          <div style={S.previewRow}><span style={S.pk}>Niche:</span><span style={S.pv}>{item.output.niche}</span></div>
                          <div style={S.previewRow}><span style={S.pk}>Model:</span><span style={S.pv}>{item.output.model}</span></div>
                          <div style={S.previewRow}><span style={S.pk}>Products:</span><span style={S.pv}>{item.output.products?.length || 0} items</span></div>
                        </div>
                      )}
                      {item.type === 'research' && item.output && (
                        <div style={S.previewContent}>
                          <div style={S.previewRow}><span style={S.pk}>Market Size:</span><span style={S.pv}>{item.output.marketSize}</span></div>
                          <div style={S.previewRow}><span style={S.pk}>Demand Score:</span><span style={S.pv}>{item.output.demandScore}/100</span></div>
                          <div style={S.previewRow}><span style={S.pk}>Competition:</span><span style={S.pv}>{item.output.competitionLevel}</span></div>
                        </div>
                      )}
                      {(item.type === 'tool' || item.type === 'marketing') && (
                        <div style={S.previewRaw}>
                          <pre style={S.previewJSON}>{JSON.stringify(item.output, null, 2).slice(0, 600)}...</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {pages > 1 && (
            <div style={S.pagination}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={S.pageBtn}>← Prev</button>
              <span style={S.pageInfo}>Page {page} of {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={S.pageBtn}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.2rem' },
  sub: { color: 'var(--text-muted)', fontSize: '0.875rem' },
  newBtn: { background: 'var(--gold)', color: '#000', padding: '0.6rem 1.25rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none' },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  filterBtn: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '0.4rem 0.9rem', borderRadius: 'var(--full)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' },
  filterActive: { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold)' },
  loadingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', padding: '4rem 2rem', background: 'var(--surface)', borderRadius: 'var(--r2)', border: '1px solid var(--border)', textAlign: 'center' },
  emptyIcon: { fontSize: '3rem', color: 'var(--text-muted)' },
  emptyTitle: { fontSize: '1.2rem', fontWeight: '700' },
  emptySub: { color: 'var(--text-muted)', fontSize: '0.875rem' },
  emptyBtn: { background: 'var(--gold)', color: '#000', padding: '0.6rem 1.25rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none', marginTop: '0.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', transition: 'border-color 0.15s' },
  cardOpen: { border: '1px solid var(--gold-border)' },
  cardHeader: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem' },
  typeIcon: { fontSize: '1.3rem', flexShrink: 0, marginTop: '1px' },
  cardMeta: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: '0.9rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.15rem' },
  cardSub: { fontSize: '0.72rem', color: 'var(--text-muted)' },
  cardBadge: { fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 },
  cardActions: { display: 'flex', gap: '0.5rem' },
  actionBtn: { flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-dim)', padding: '0.4rem 0.75rem', borderRadius: 'var(--r)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)' },
  dlBtn: { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '0.4rem 0.75rem', borderRadius: 'var(--r)', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' },
  deleteBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.4rem 0.65rem', borderRadius: 'var(--r)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-body)' },
  preview: { borderTop: '1px solid var(--border)', paddingTop: '0.85rem' },
  previewContent: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  previewRow: { display: 'flex', gap: '0.5rem' },
  pk: { fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', width: '70px', flexShrink: 0 },
  pv: { fontSize: '0.78rem', color: 'var(--text-dim)' },
  previewRaw: { maxHeight: '160px', overflow: 'auto' },
  previewJSON: { fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: '1.5' },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' },
  pageBtn: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-dim)', padding: '0.5rem 1rem', borderRadius: 'var(--r)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'var(--font-body)' },
  pageInfo: { fontSize: '0.82rem', color: 'var(--text-muted)' },
};
