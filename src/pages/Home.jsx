import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TICKER_ITEMS = ['AI Business Generator', 'Market Research Engine', 'Marketing Builder', 'Revenue Intelligence', 'Competitor Analysis', 'Store Builder', 'AI Advisor Chat', 'Brand Identity Tools'];

const FEATURES = [
  { icon: '⚡', title: 'Business Generator', desc: 'From idea to full business plan, products, and downloadable store in 30 seconds.', badge: 'Most Popular', link: '/generator' },
  { icon: '◎', title: 'AI Business Advisor', desc: 'Chat with an AI consultant in advisor, marketing, investment, or mentor mode.', badge: '24/7', link: '/chat' },
  { icon: '◉', title: 'Market Research', desc: 'Real competitor breakdowns, demand scores, pricing analysis and profit potential.', badge: 'Intelligence', link: '/market' },
  { icon: '◈', title: 'Marketing Builder', desc: 'Instagram plans, TikTok strategies, Meta ads, SEO content and email sequences.', badge: 'Growth', link: '/marketing' },
  { icon: '▣', title: 'Project Vault', desc: 'Every generation saved, searchable, downloadable as ZIP. Your business library.', badge: 'Storage', link: '/vault' },
  { icon: '◫', title: 'AI Tools Hub', desc: 'Logo concepts, pitch decks, cold emails, ad copy, startup names and more.', badge: '6+ Tools', link: '/tools' },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Founder, DropShip Pro', text: 'Generated my entire Shopify competitor store, product catalog and marketing plan in under 2 minutes. Unreal.', rating: 5 },
  { name: 'Marcus T.', role: 'Serial Entrepreneur', text: 'The market research alone is worth 10x the subscription. I killed two competitors before launch.', rating: 5 },
  { name: 'Priya M.', role: 'SaaS Founder', text: 'Used the AI advisor daily for 3 months. It helped me pivot and hit $50k MRR.', rating: 5 },
];

const STATS = [
  { value: '12,400+', label: 'Businesses Generated' },
  { value: '$2.4M', label: 'Revenue Enabled' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '45 sec', label: 'Avg. Generation Time' },
];

const PLANS = [
  { name: 'Free', price: '$0', period: '/forever', credits: 50, color: '#6b6b8a', features: ['50 credits/month', 'Business generator', 'Basic AI advisor', 'Market research (3 credits)', '10 vault items'] },
  { name: 'Pro', price: '$29', period: '/month', credits: 500, color: '#f59e0b', popular: true, features: ['500 credits/month', 'All AI tools', 'Full marketing builder', 'Unlimited vault', 'ZIP downloads', 'Priority AI responses'] },
  { name: 'Enterprise', price: '$99', period: '/month', credits: 2000, color: '#3b82f6', features: ['2000 credits/month', 'Everything in Pro', 'Admin panel', 'API access', 'Custom branding', 'Dedicated support'] },
];

export default function Home() {
  const [tickerPos, setTickerPos] = useState(0);
  const tickerText = [...TICKER_ITEMS, ...TICKER_ITEMS].join('  ·  ');

  return (
    <div style={S.page}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.navInner}>
          <div style={S.navLogo}>
            <div style={S.logoMark}>⚡</div>
            <span style={S.logoText}>AIBOS</span>
          </div>
          <div style={S.navLinks}>
            <a href="#features" style={S.navLink}>Features</a>
            <a href="#pricing" style={S.navLink}>Pricing</a>
            <a href="#testimonials" style={S.navLink}>Reviews</a>
            <Link to="/login" style={S.navLink}>Login</Link>
            <Link to="/signup" style={S.navCta}>Start Free →</Link>
          </div>
        </div>
      </nav>

      {/* TICKER */}
      <div style={S.ticker}>
        <div style={S.tickerTrack}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={S.tickerText}>{TICKER_ITEMS.join('  ·  ')}  ·  </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroGrid} />
        <div style={S.heroContent}>
          <div style={S.heroBadge}>
            <span style={S.heroBadgeDot} />
            The World's First AI Business Operating System
          </div>
          <h1 style={S.h1}>
            Build Any Business<br />
            <span style={S.h1Gold}>In 30 Seconds</span>
          </h1>
          <p style={S.heroPara}>
            One platform. AI generates your business plan, store, products, marketing strategy, 
            competitor research, and ad copy — all connected, all instant.
          </p>
          <div style={S.heroCtas}>
            <Link to="/signup" style={S.ctaPrimary}>Launch Your Business →</Link>
            <Link to="/login" style={S.ctaSecondary}>Sign In</Link>
          </div>
          <div style={S.heroStats}>
            {STATS.map(s => (
              <div key={s.label} style={S.statItem}>
                <div style={S.statValue}>{s.value}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo preview */}
        <div style={S.demoBox}>
          <div style={S.demoHeader}>
            <div style={S.demoDots}>
              <span style={{ ...S.demoDot, background: '#ef4444' }} />
              <span style={{ ...S.demoDot, background: '#f59e0b' }} />
              <span style={{ ...S.demoDot, background: '#10b981' }} />
            </div>
            <span style={S.demoTitle}>AIBOS — Business Generator</span>
          </div>
          <div style={S.demoContent}>
            <div style={S.demoInput}>
              <span style={S.demoPromptLabel}>Your idea:</span>
              <span style={S.demoPromptText}>"Luxury pet subscription box for dog owners"</span>
            </div>
            <div style={S.demoOutput}>
              <div style={S.demoLine}><span style={S.demoKey}>Business Name:</span><span style={S.demoVal}>PawLuxe Co.</span></div>
              <div style={S.demoLine}><span style={S.demoKey}>Niche:</span><span style={S.demoVal}>Premium pet lifestyle</span></div>
              <div style={S.demoLine}><span style={S.demoKey}>Revenue Model:</span><span style={S.demoVal}>Subscription $49/month</span></div>
              <div style={S.demoLine}><span style={S.demoKey}>Market Size:</span><span style={S.demoVal}>$8.4B industry ↑22%</span></div>
              <div style={S.demoLine}><span style={S.demoKey}>Products Generated:</span><span style={{ ...S.demoVal, color: '#10b981' }}>10 items ✓</span></div>
              <div style={S.demoLine}><span style={S.demoKey}>Store HTML:</span><span style={{ ...S.demoVal, color: '#10b981' }}>Generated ✓</span></div>
              <div style={S.demoLine}><span style={S.demoKey}>ZIP Ready:</span><span style={{ ...S.demoVal, color: '#10b981' }}>Download ready ✓</span></div>
              <div style={S.demoBar}>
                <div style={S.demoBarFill} />
              </div>
              <div style={S.demoTime}>⚡ Generated in 28 seconds</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.sectionHeader}>
            <div style={S.sectionBadge}>PLATFORM FEATURES</div>
            <h2 style={S.h2}>Everything Is Connected</h2>
            <p style={S.sectionSub}>Not just pages — a unified operating system where every tool feeds into the next.</p>
          </div>
          <div style={S.featGrid}>
            {FEATURES.map((f, i) => (
              <Link to={`/signup`} key={f.title} style={{ ...S.featCard, animationDelay: `${i * 0.08}s` }}>
                <div style={S.featTop}>
                  <div style={S.featIcon}>{f.icon}</div>
                  <span style={S.featBadge}>{f.badge}</span>
                </div>
                <h3 style={S.featTitle}>{f.title}</h3>
                <p style={S.featDesc}>{f.desc}</p>
                <div style={S.featArrow}>→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ ...S.section, background: 'var(--surface)' }}>
        <div style={S.sectionInner}>
          <div style={S.sectionHeader}>
            <div style={S.sectionBadge}>TESTIMONIALS</div>
            <h2 style={S.h2}>Founders Love AIBOS</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={S.testimonialCard}>
                <div style={S.stars}>{'★'.repeat(t.rating)}</div>
                <p style={S.testimonialText}>"{t.text}"</p>
                <div style={S.testimonialAuthor}>
                  <div style={S.testimonialAvatar}>{t.name[0]}</div>
                  <div>
                    <div style={S.testimonialName}>{t.name}</div>
                    <div style={S.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={S.section}>
        <div style={S.sectionInner}>
          <div style={S.sectionHeader}>
            <div style={S.sectionBadge}>PRICING</div>
            <h2 style={S.h2}>Simple, Credit-Based Pricing</h2>
            <p style={S.sectionSub}>Pay per generation. No hidden fees. Upgrade or downgrade anytime.</p>
          </div>
          <div className="grid-3">
            {PLANS.map(plan => (
              <div key={plan.name} style={{ ...S.planCard, ...(plan.popular ? S.planPopular : {}) }}>
                {plan.popular && <div style={S.popularLabel}>MOST POPULAR</div>}
                <div style={{ ...S.planName, color: plan.color }}>{plan.name}</div>
                <div style={S.planPrice}>{plan.price}<span style={S.planPeriod}>{plan.period}</span></div>
                <div style={S.planCredits}>⚡ {plan.credits} credits/month</div>
                <ul style={S.planFeatures}>
                  {plan.features.map(f => <li key={f} style={S.planFeature}><span style={{ color: plan.color }}>✓</span> {f}</li>)}
                </ul>
                <Link to="/signup" style={{ ...S.planBtn, background: plan.popular ? 'var(--gold)' : 'var(--surface3)', color: plan.popular ? '#000' : 'var(--text)' }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={S.ctaFinal}>
        <div style={S.ctaFinalBg} />
        <h2 style={S.ctaFinalTitle}>Ready to Build Your Empire?</h2>
        <p style={S.ctaFinalSub}>Join 12,400+ entrepreneurs who chose AI to build faster.</p>
        <Link to="/signup" style={S.ctaPrimary}>Start Free — No Card Required →</Link>
      </section>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={S.footerLogo}>⚡ AIBOS</div>
        <p style={S.footerText}>© 2024 AI Business Operating System. Built with intelligence.</p>
      </footer>

      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }
        @keyframes demoBarAnim { from { width: 0; } to { width: 100%; } }
        .demoBarFillAnim { animation: demoBarAnim 2s ease-out 0.5s forwards; }
      `}</style>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' },
  nav: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8,8,16,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' },
  navInner: { maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLogo: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  logoMark: { width: '28px', height: '28px', background: 'var(--gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: '900', fontSize: '0.9rem' },
  logoText: { fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.1em' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '1.75rem' },
  navLink: { color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none', transition: 'color 0.15s' },
  navCta: { background: 'var(--gold)', color: '#000', padding: '0.45rem 1.1rem', borderRadius: 'var(--r)', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' },
  ticker: { overflow: 'hidden', background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0.5rem 0' },
  tickerTrack: { display: 'flex', gap: 0, animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap', willChange: 'transform' },
  tickerText: { fontSize: '0.72rem', fontWeight: '600', color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase', paddingRight: '0', whiteSpace: 'nowrap' },
  hero: { position: 'relative', padding: '5rem 2rem 6rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', gap: '3rem', flexWrap: 'wrap', overflow: 'hidden' },
  heroBg: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 30% 40%, rgba(245,158,11,0.06), transparent 70%)', pointerEvents: 'none' },
  heroGrid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5, pointerEvents: 'none' },
  heroContent: { position: 'relative', flex: '1', minWidth: '320px' },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: '700', padding: '0.35rem 0.9rem', borderRadius: 'var(--full)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.75rem' },
  heroBadgeDot: { width: '5px', height: '5px', background: 'var(--gold)', borderRadius: '50%', animation: 'pulse 2s infinite' },
  h1: { fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', fontWeight: '800', lineHeight: '1.05', letterSpacing: '-0.03em', marginBottom: '1.5rem' },
  h1Gold: { color: 'var(--gold)', display: 'block' },
  heroPara: { color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '520px', marginBottom: '2.5rem' },
  heroCtas: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' },
  ctaPrimary: { background: 'var(--gold)', color: '#000', padding: '0.85rem 2rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', transition: 'opacity 0.2s' },
  ctaSecondary: { background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '0.85rem 2rem', borderRadius: 'var(--r)', fontWeight: '600', fontSize: '1rem', textDecoration: 'none' },
  heroStats: { display: 'flex', gap: '2.5rem', flexWrap: 'wrap' },
  statItem: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  statValue: { fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.04em', color: 'var(--gold)' },
  statLabel: { fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  demoBox: { position: 'relative', flex: '0 0 380px', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 'var(--r2)', overflow: 'hidden', boxShadow: '0 0 60px rgba(245,158,11,0.1), 0 40px 80px rgba(0,0,0,0.4)' },
  demoHeader: { background: 'var(--surface2)', borderBottom: '1px solid var(--border)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' },
  demoDots: { display: 'flex', gap: '0.35rem' },
  demoDot: { width: '10px', height: '10px', borderRadius: '50%' },
  demoTitle: { fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.04em' },
  demoContent: { padding: '1.25rem' },
  demoInput: { background: 'var(--surface2)', border: '1px solid var(--gold-border)', borderRadius: 'var(--r)', padding: '0.85rem 1rem', marginBottom: '1rem' },
  demoPromptLabel: { display: 'block', fontSize: '0.65rem', color: 'var(--gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' },
  demoPromptText: { fontSize: '0.875rem', color: 'var(--text)', fontStyle: 'italic' },
  demoOutput: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  demoLine: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' },
  demoKey: { color: 'var(--text-muted)' },
  demoVal: { color: 'var(--text)', fontWeight: '600' },
  demoBar: { height: '4px', background: 'var(--surface3)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' },
  demoBarFill: { height: '100%', background: 'linear-gradient(90deg, var(--gold), #fbbf24)', borderRadius: '2px', width: '100%' },
  demoTime: { fontSize: '0.78rem', color: 'var(--gold)', fontWeight: '600', textAlign: 'center', marginTop: '0.5rem' },
  section: { padding: '5rem 2rem' },
  sectionInner: { maxWidth: '1200px', margin: '0 auto' },
  sectionHeader: { textAlign: 'center', marginBottom: '3.5rem' },
  sectionBadge: { display: 'inline-block', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.14em', color: 'var(--gold)', background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', padding: '0.3rem 0.8rem', borderRadius: 'var(--full)', marginBottom: '1rem' },
  h2: { fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.85rem' },
  sectionSub: { color: 'var(--text-dim)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' },
  featCard: { display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.75rem', textDecoration: 'none', color: 'var(--text)', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' },
  featTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  featIcon: { fontSize: '1.5rem', color: 'var(--gold)' },
  featBadge: { fontSize: '0.65rem', fontWeight: '700', color: 'var(--gold)', background: 'var(--gold-glow)', border: '1px solid var(--gold-border)', padding: '0.2rem 0.55rem', borderRadius: 'var(--full)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  featTitle: { fontSize: '1.1rem', fontWeight: '700' },
  featDesc: { color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.65', flex: 1 },
  featArrow: { color: 'var(--text-muted)', fontSize: '1rem', marginTop: 'auto' },
  testimonialCard: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  stars: { color: 'var(--gold)', fontSize: '0.9rem', letterSpacing: '2px' },
  testimonialText: { color: 'var(--text-dim)', lineHeight: '1.7', fontSize: '0.95rem', flex: 1 },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' },
  testimonialAvatar: { width: '36px', height: '36px', background: 'var(--gold)', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem', flexShrink: 0 },
  testimonialName: { fontSize: '0.875rem', fontWeight: '700' },
  testimonialRole: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  planCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' },
  planPopular: { border: '1px solid var(--gold-border)', boxShadow: '0 0 40px var(--gold-glow)' },
  popularLabel: { position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: '#000', fontSize: '0.65rem', fontWeight: '800', padding: '0.2rem 0.75rem', borderRadius: 'var(--full)', letterSpacing: '0.08em', whiteSpace: 'nowrap' },
  planName: { fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' },
  planPrice: { fontSize: '2.5rem', fontWeight: '800', lineHeight: 1 },
  planPeriod: { fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' },
  planCredits: { fontSize: '0.875rem', color: 'var(--text-dim)', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' },
  planFeatures: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 },
  planFeature: { fontSize: '0.875rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  planBtn: { display: 'block', textAlign: 'center', padding: '0.85rem', borderRadius: 'var(--r)', fontWeight: '700', fontSize: '0.95rem', textDecoration: 'none', marginTop: '0.5rem' },
  ctaFinal: { position: 'relative', padding: '7rem 2rem', textAlign: 'center', overflow: 'hidden' },
  ctaFinalBg: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,158,11,0.08), transparent 70%)', pointerEvents: 'none' },
  ctaFinalTitle: { fontFamily: 'var(--font-body)', fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: '800', marginBottom: '1rem', position: 'relative' },
  ctaFinalSub: { color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: '2.5rem', position: 'relative' },
  footer: { padding: '2.5rem 2rem', borderTop: '1px solid var(--border)', textAlign: 'center' },
  footerLogo: { fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '0.5rem' },
  footerText: { color: 'var(--text-muted)', fontSize: '0.82rem' },
};
