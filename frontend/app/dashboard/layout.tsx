'use client';

import React, { useEffect } from 'react';
import { useAuth, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Briefcase, CheckSquare, User as UserIcon } from 'lucide-react';
import { injectTokenFetcher } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    if (isSignedIn) {
      console.log('Initializing API with Clerk fetcher...');
      injectTokenFetcher(getToken);
      setIsReady(true);
    }
  }, [isSignedIn, getToken]);

  if (!isLoaded || !isSignedIn || !isReady) {
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/login" />
              <div>
                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.fullName}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>
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
