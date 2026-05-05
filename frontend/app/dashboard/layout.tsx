'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Briefcase, CheckSquare, LogOut, User } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading Aura...</p>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Projects', icon: Briefcase, href: '/dashboard/projects' },
    { name: 'Tasks', icon: CheckSquare, href: '/dashboard/tasks' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '280px', margin: '1rem', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px' }}></div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.02em' }}>Aura</h1>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-2"
              style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: '0.5rem',
                transition: 'background 0.2s',
                color: 'var(--text-muted)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <item.icon size={20} />
              <span style={{ fontWeight: '500' }}>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', overflow: 'hidden' }}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} />
                </div>
              )}
            </div>
            <div>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2"
            style={{ color: 'var(--danger)', fontSize: '0.9rem', fontWeight: '600' }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        <div className="container" style={{ padding: '1rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
