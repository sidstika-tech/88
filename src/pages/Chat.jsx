import React, { useState, useRef, useEffect } from 'react';
import { sendChat } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const MODES = [
  { id: 'advisor', label: 'Business Advisor', icon: '◈', desc: 'Strategic business guidance' },
  { id: 'marketing', label: 'Marketing Expert', icon: '◉', desc: 'Growth & campaign strategy' },
  { id: 'investment', label: 'VC Investor', icon: '◐', desc: 'Funding & valuation insights' },
  { id: 'mentor', label: 'Startup Mentor', icon: '◎', desc: 'Founder wisdom & tough love' },
];

const STARTERS = {
  advisor: ['How do I validate my business idea?', 'What\'s a good pricing strategy for SaaS?', 'How do I find my first 10 customers?'],
  marketing: ['Create a 30-day Instagram strategy for my store', 'Write me a viral TikTok hook formula', 'How do I run Meta ads on $500/month?'],
  investment: ['What metrics do VCs care about most?', 'How do I prepare a seed round pitch?', 'What\'s a realistic pre-seed valuation?'],
  mentor: ['I\'m thinking of pivoting — what should I consider?', 'How do I deal with a co-founder conflict?', 'When should I quit my job to go full-time?'],
};

export default function Chat() {
  const { user, updateUser } = useAuth();
  const [mode, setMode] = useState('advisor');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await sendChat(msg, history, mode);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      if (res.data.credits !== undefined) updateUser({ credits: res.data.credits });
    } catch (e) {
      const errMsg = e.response?.data?.code === 'NO_CREDITS'
        ? '⚠️ You\'re out of credits. Please upgrade your plan.'
        : 'Connection error. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally { setLoading(false); inputRef.current?.focus(); }
  };

  const currentMode = MODES.find(m => m.id === mode);

  return (
    <div style={S.shell}>
      {/* Mode selector sidebar */}
      <div style={S.modePanel}>
        <div className="section-title">AI MODE</div>
        {MODES.map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setMessages([]); }} style={{ ...S.modeBtn, ...(mode === m.id ? S.modeBtnActive : {}) }}>
            <span style={S.modeBtnIcon}>{m.icon}</span>
            <div>
              <div style={S.modeBtnLabel}>{m.label}</div>
              <div style={S.modeBtnDesc}>{m.desc}</div>
            </div>
          </button>
        ))}
        <hr className="divider" />
        <div className="section-title">CONVERSATION</div>
        <button onClick={() => setMessages([])} style={S.clearBtn}>Clear chat ✕</button>
        <div style={S.creditNote}>
          <span style={S.creditIcon}>⚡</span>
          <span style={S.creditText}>{user?.credits} credits left · 1 per message</span>
        </div>
      </div>

      {/* Chat area */}
      <div style={S.chatPanel}>
        {/* Header */}
        <div style={S.chatHeader}>
          <div style={S.headerIcon}>{currentMode.icon}</div>
          <div>
            <div style={S.headerTitle}>{currentMode.label}</div>
            <div style={S.headerSub}>{currentMode.desc}</div>
          </div>
          <div style={S.onlineDot} />
        </div>

        {/* Messages */}
        <div style={S.messages}>
          {messages.length === 0 && (
            <div style={S.emptyChat}>
              <div style={S.emptyChatIcon}>{currentMode.icon}</div>
              <h3 style={S.emptyChatTitle}>I'm your {currentMode.label}</h3>
              <p style={S.emptyChatSub}>Ask me anything about your business. I'll give you sharp, actionable advice.</p>
              <div style={S.starters}>
                {STARTERS[mode].map(s => (
                  <button key={s} onClick={() => send(s)} style={S.starter}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ ...S.msgRow, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && <div style={S.aiAvatar}>{currentMode.icon}</div>}
              <div style={{ ...S.bubble, ...(msg.role === 'user' ? S.userBubble : S.aiBubble) }}>
                {msg.content}
              </div>
              {msg.role === 'user' && <div style={S.userAvatar}>{(user?.name || 'U')[0].toUpperCase()}</div>}
            </div>
          ))}
          {loading && (
            <div style={{ ...S.msgRow, justifyContent: 'flex-start' }}>
              <div style={S.aiAvatar}>{currentMode.icon}</div>
              <div style={{ ...S.aiBubble, ...S.bubble }}>
                <div style={S.typingDots}>
                  <span style={{ ...S.dot, animationDelay: '0s' }} />
                  <span style={{ ...S.dot, animationDelay: '0.2s' }} />
                  <span style={{ ...S.dot, animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={S.inputArea}>
          <div style={S.inputRow}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={`Ask your ${currentMode.label}...`}
              rows={2}
              style={S.textarea}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading} style={{ ...S.sendBtn, opacity: !input.trim() || loading ? 0.4 : 1 }}>
              {loading ? <span className="spinner" /> : '↑'}
            </button>
          </div>
          <p style={S.inputHint}>Enter to send · Shift+Enter for new line · 1 credit per message</p>
        </div>
      </div>

      <style>{`
        @keyframes dotBounce { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-5px);opacity:1} }
      `}</style>
    </div>
  );
}

const S = {
  shell: { display: 'flex', height: 'calc(100vh - var(--nav-h))', marginTop: 'calc(-2rem)', marginLeft: '-2rem', marginRight: '-2rem', overflow: 'hidden' },
  modePanel: { width: '240px', flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' },
  modeBtn: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--r)', background: 'transparent', border: '1px solid transparent', color: 'var(--text-dim)', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'var(--font-body)' },
  modeBtnActive: { background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--text)' },
  modeBtnIcon: { fontSize: '1.1rem', color: 'var(--gold)', marginTop: '1px', flexShrink: 0 },
  modeBtnLabel: { fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.1rem' },
  modeBtnDesc: { fontSize: '0.7rem', color: 'var(--text-muted)' },
  clearBtn: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '0.5rem 0.75rem', borderRadius: 'var(--r)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%' },
  creditNote: { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 0.75rem', background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', borderRadius: 'var(--r)' },
  creditIcon: { fontSize: '0.8rem' },
  creditText: { fontSize: '0.72rem', color: 'var(--gold)', fontWeight: '600' },
  chatPanel: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  chatHeader: { padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 },
  headerIcon: { fontSize: '1.4rem', color: 'var(--gold)' },
  headerTitle: { fontSize: '0.95rem', fontWeight: '700' },
  headerSub: { fontSize: '0.72rem', color: 'var(--text-muted)' },
  onlineDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginLeft: 'auto', boxShadow: '0 0 8px rgba(16,185,129,0.5)', animation: 'pulse 2s infinite' },
  messages: { flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  emptyChat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 2rem', gap: '1rem' },
  emptyChatIcon: { fontSize: '3rem', color: 'var(--gold)' },
  emptyChatTitle: { fontSize: '1.3rem', fontWeight: '700' },
  emptyChatSub: { color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', lineHeight: '1.6' },
  starters: { display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '480px', marginTop: '0.5rem' },
  starter: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-dim)', padding: '0.65rem 1rem', borderRadius: 'var(--r)', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', transition: 'all 0.15s' },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: '0.65rem' },
  bubble: { maxWidth: '72%', padding: '0.85rem 1.1rem', borderRadius: '16px', fontSize: '0.92rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  userBubble: { background: 'var(--gold)', color: '#000', borderBottomRightRadius: '4px', fontWeight: '500' },
  aiBubble: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', borderBottomLeftRadius: '4px' },
  aiAvatar: { width: '30px', height: '30px', background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0, color: 'var(--gold)' },
  userAvatar: { width: '30px', height: '30px', background: 'var(--gold)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '800', flexShrink: 0 },
  typingDots: { display: 'flex', gap: '0.35rem', alignItems: 'center', padding: '0.1rem 0' },
  dot: { width: '7px', height: '7px', borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block', animation: 'dotBounce 1.2s infinite ease-in-out' },
  inputArea: { padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)', flexShrink: 0 },
  inputRow: { display: 'flex', gap: '0.75rem', alignItems: 'flex-end' },
  textarea: { flex: 1, background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 'var(--r)', color: 'var(--text)', fontSize: '0.92rem', padding: '0.75rem 1rem', resize: 'none', fontFamily: 'var(--font-body)', lineHeight: '1.5' },
  sendBtn: { width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold)', color: '#000', border: 'none', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.15s' },
  inputHint: { fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' },
};
