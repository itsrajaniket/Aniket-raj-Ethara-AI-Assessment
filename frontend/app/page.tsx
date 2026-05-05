'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Layout, 
  Star, 
  Sparkles, 
  Check, 
  ChevronDown, 
  Users, 
  Globe, 
  Lock 
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, isLoaded, router]);

  if (isLoaded && isSignedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to dashboard...</p>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState('kanban');

  const testimonials = [
    { name: 'Sarah Chen', role: 'Product Lead @ Velo', text: 'Aura changed how we track tasks. The UI is actually a joy to use daily.' },
    { name: 'Marcus Wright', role: 'Founder, SolarEdge', text: 'Cleanest project management tool I’ve ever seen. No clutter, just focus.' },
    { name: 'Elena Rodriguez', role: 'CTO @ Nexus', text: 'The RBAC system is robust. Perfect for managing our external contractors.' }
  ];

  return (
    <div style={{ background: '#020617', color: '#f8fafc', overflowX: 'hidden', minHeight: '100vh' }}>
      {/* Background Decor & Noise */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.4 }}>
        <div style={{ 
          position: 'absolute', top: '5%', left: '10%', width: '50vw', height: '50vw', 
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', 
          filter: 'blur(120px)', borderRadius: '50%' 
        }} className="float" />
        <div style={{ 
          position: 'absolute', bottom: '10%', right: '5%', width: '40vw', height: '40vw', 
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)', 
          filter: 'blur(100px)', borderRadius: '50%', animationDelay: '-3s' 
        }} className="float" />
      </div>

      {/* Navigation */}
      <nav className="container flex justify-between items-center" style={{ height: '100px', position: 'relative', zIndex: 10 }}>
        <div className="flex items-center gap-3">
          <div style={{ 
            width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.05em' }} className="text-gradient">Aura</span>
        </div>
        <div className="flex gap-10 items-center hide-mobile">
          <Link href="#features" className="nav-link">Features</Link>
          <Link href="#pricing" className="nav-link">Pricing</Link>
          <Link href={isSignedIn ? "/dashboard" : "/login"}>
            <button className="btn btn-primary glow-hover" style={{ padding: '0.6rem 1.5rem', borderRadius: '100px' }}>
              {isSignedIn ? 'Dashboard' : 'Sign In'}
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container" style={{ 
        paddingTop: '6rem', 
        paddingBottom: '8rem', 
        textAlign: 'center', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <div className="fade-in">
          <div className="badge">
            <Star size={14} color="var(--warning)" fill="var(--warning)" />
            <span>Top Rated Task Management 2026</span>
          </div>

          <h1 className="hero-title text-gradient">
            Work with <span style={{ color: 'var(--primary)', textShadow: '0 0 40px rgba(99,102,241,0.3)' }}>Atmosphere.</span>
          </h1>
          
          <p className="hero-subtitle">
            Experience the clarity of a focused workspace. Aura eliminates the noise of traditional project tools, leaving only what matters.
          </p>

          <div className="flex justify-center gap-6">
            <Link href={isSignedIn ? "/dashboard" : "/signup"}>
              <button className="btn btn-primary flex items-center gap-2 glow-hover" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                Join the Beta <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>

        {/* Floating Mockup with Active Interaction */}
        <div className="fade-in" style={{ marginTop: '7rem', perspective: '1200px' }}>
          <div className="mockup-container glow-hover">
            <div className="mockup-header">
              <div className="dots"><div /><div /><div /></div>
              <div className="mockup-tabs">
                <button onClick={() => setActiveTab('kanban')} className={activeTab === 'kanban' ? 'active' : ''}>Kanban</button>
                <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Stats</button>
              </div>
            </div>
            <div className="mockup-body">
              {activeTab === 'kanban' ? (
                <div className="mockup-kanban">
                  {[1,2,3].map(i => (
                    <div key={i} className="mockup-col">
                      <div className="mockup-line" style={{ width: '40%', marginBottom: '1.5rem' }}></div>
                      {[1,2].map(j => (
                        <div key={j} className="mockup-card">
                          <div className="mockup-line" style={{ width: '100%', marginBottom: '0.5rem' }}></div>
                          <div className="mockup-line" style={{ width: '60%' }}></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mockup-stats">
                  <div className="mockup-chart" />
                  <div className="mockup-grid">
                    {[1,2,3,4].map(i => <div key={i} className="mockup-card" style={{ height: '100px' }} />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ padding: '4rem 0', opacity: 0.6 }}>
        <div className="container flex justify-center gap-12 flex-wrap items-center grayscale">
          <div className="flex items-center gap-2"><Globe size={24} /> <span>GLOBAL TECH</span></div>
          <div className="flex items-center gap-2"><Users size={24} /> <span>NEXUS CORP</span></div>
          <div className="flex items-center gap-2"><Shield size={24} /> <span>SECURE FLOW</span></div>
          <div className="flex items-center gap-2"><Star size={24} /> <span>PLATINUM INC</span></div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '10rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="section-title text-gradient">Purpose-built for teams.</h2>
            <p style={{ color: 'var(--text-muted)' }}>Focus on shipping, not managing management tools.</p>
          </div>

          <div className="grid-3">
            <div className="feature-card glass glow-hover">
              <Lock className="icon" />
              <h3>Role-Based Access</h3>
              <p>Granular control over who sees what. Define Admins, Members, and Clients with ease.</p>
            </div>
            <div className="feature-card glass glow-hover">
              <Layout className="icon" />
              <h3>Fluid Kanban</h3>
              <p>A workspace that breathes. Drag, drop, and organize tasks with natural physics.</p>
            </div>
            <div className="feature-card glass glow-hover">
              <Zap className="icon" />
              <h3>Real-time Sync</h3>
              <p>Zero delay updates. Your whole team sees the same state, exactly when it changes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '10rem 0', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="glass" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="var(--warning)" color="var(--warning)" />)}
                </div>
                <p style={{ fontStyle: 'italic', marginBottom: '2rem', lineHeight: '1.6' }}>"{t.text}"</p>
                <div>
                  <p style={{ fontWeight: 'bold' }}>{t.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '10rem 0' }}>
        <div className="container text-center">
          <h2 className="section-title text-gradient" style={{ marginBottom: '4rem' }}>Simple, transparent pricing.</h2>
          <div className="grid-3" style={{ alignItems: 'flex-start' }}>
            <div className="pricing-card glass">
              <p className="plan">Starter</p>
              <h3 className="price">$0<span>/mo</span></h3>
              <ul className="features-list">
                <li><Check size={16} /> Up to 3 projects</li>
                <li><Check size={16} /> 5 team members</li>
                <li><Check size={16} /> Basic Kanban</li>
              </ul>
              <button className="btn btn-outline full-width">Get Started</button>
            </div>
            <div className="pricing-card glass active-plan">
              <div className="popular-badge">Popular</div>
              <p className="plan">Pro</p>
              <h3 className="price">$19<span>/mo</span></h3>
              <ul className="features-list">
                <li><Check size={16} /> Unlimited projects</li>
                <li><Check size={16} /> 20 team members</li>
                <li><Check size={16} /> Advanced stats</li>
                <li><Check size={16} /> Custom roles</li>
              </ul>
              <button className="btn btn-primary full-width">Join Pro</button>
            </div>
            <div className="pricing-card glass">
              <p className="plan">Enterprise</p>
              <h3 className="price">Custom</h3>
              <ul className="features-list">
                <li><Check size={16} /> Unlimited everything</li>
                <li><Check size={16} /> Dedicated support</li>
                <li><Check size={16} /> SSO Integration</li>
              </ul>
              <button className="btn btn-outline full-width">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '10rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="text-center section-title text-gradient" style={{ marginBottom: '4rem' }}>Frequently Asked</h2>
          {[
            { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption and secure database providers.' },
            { q: 'Can I invite clients?', a: 'Absolutely. Use our Member role to give them restricted view access.' },
            { q: 'Do you offer a free trial?', a: 'We have a forever-free plan for individuals and small teams.' }
          ].map((item, i) => (
            <div key={i} className="faq-item glass">
              <div className="flex justify-between items-center" style={{ cursor: 'pointer' }}>
                <p style={{ fontWeight: '600' }}>{item.q}</p>
                <ChevronDown size={20} color="var(--text-muted)" />
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '6rem 0', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container flex justify-between items-center flex-wrap gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '8px' }}></div>
              <span style={{ fontWeight: '900', fontSize: '1.2rem' }}>Aura</span>
            </div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '300px', fontSize: '0.9rem' }}>The premium choice for teams who care about clarity.</p>
          </div>
          <div className="flex gap-12">
            <div className="footer-col">
              <p className="footer-title">Product</p>
              <Link href="#">Changelog</Link>
              <Link href="#">Documentation</Link>
            </div>
            <div className="footer-col">
              <p className="footer-title">Company</p>
              <Link href="#">About</Link>
              <Link href="#">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.03);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 2rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .hero-title {
          font-size: clamp(3.5rem, 10vw, 6.5rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 2rem;
          letter-spacing: -0.05em;
        }
        .hero-subtitle {
          font-size: 1.4rem;
          color: var(--text-muted);
          max-width: 700px;
          margin: 0 auto 4rem;
          line-height: 1.6;
        }
        .section-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.04em;
        }
        .mockup-container {
          max-width: 1100px;
          margin: 0 auto;
          transform: rotateX(5deg);
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.7), 0 0 40px rgba(99,102,241,0.1);
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background: #0f172a;
        }
        .mockup-header {
          height: 60px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          padding: 0 2rem;
        }
        .dots { display: flex; gap: 8px; flex: 1; }
        .dots div { width: 10px; height: 10px; borderRadius: 50%; background: rgba(255,255,255,0.1); }
        .mockup-tabs { display: flex; gap: 1rem; }
        .mockup-tabs button { color: var(--text-muted); font-size: 0.9rem; font-weight: 600; padding: 4px 12px; }
        .mockup-tabs button.active { color: white; background: rgba(255,255,255,0.05); borderRadius: 6px; }
        .mockup-body { padding: 3rem; height: 500px; text-align: left; }
        .mockup-kanban { display: grid; gridTemplateColumns: 1fr 1fr 1fr; gap: 2rem; height: 100%; }
        .mockup-col { display: flex; flexDirection: column; }
        .mockup-line { height: 10px; background: rgba(255,255,255,0.05); borderRadius: 100px; }
        .mockup-card { background: rgba(255,255,255,0.02); borderRadius: 12px; padding: 1rem; marginBottom: 1rem; border: 1px solid rgba(255,255,255,0.03); height: 100px; }
        
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; }
        .feature-card { padding: 4rem 3rem; }
        .icon { size: 40px; color: var(--primary); margin-bottom: 2rem; }
        
        .pricing-card { padding: 4rem 3rem; text-align: left; position: relative; }
        .active-plan { border-color: var(--primary); background: linear-gradient(rgba(99,102,241,0.05), transparent); }
        .popular-badge { position: absolute; top: 1.5rem; right: 1.5rem; background: var(--primary); font-size: 0.7rem; font-weight: bold; padding: 4px 12px; borderRadius: 100px; }
        .plan { color: var(--text-muted); font-weight: 600; margin-bottom: 1rem; }
        .price { font-size: 3.5rem; font-weight: 900; margin-bottom: 2rem; }
        .price span { font-size: 1rem; color: var(--text-muted); }
        .features-list { list-style: none; margin-bottom: 3rem; }
        .features-list li { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; color: var(--text-muted); }
        .full-width { width: 100%; }
        
        .faq-item { padding: 2rem; margin-bottom: 1rem; transition: background 0.2s; }
        .faq-item:hover { background: rgba(255,255,255,0.03); }
        
        .footer-col { display: flex; flexDirection: column; gap: 1rem; }
        .footer-title { fontWeight: bold; marginBottom: 0.5rem; color: white; }
        .footer-col a { color: var(--text-muted); fontSize: 0.9rem; transition: color 0.2s; }
        .footer-col a:hover { color: white; }
        
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          .hero-title { font-size: 3.5rem; }
        }
      `}</style>
    </div>
  );
}
