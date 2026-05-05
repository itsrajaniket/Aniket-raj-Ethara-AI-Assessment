'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';

interface Stats {
  statusCounts: { TODO: number; IN_PROGRESS: number; DONE: number };
  overdueCount: number;
  overdueTasks: any[];
  assignedTasks: any[];
  projectProgress: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Welcome back, {user?.fullName}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your projects today.</p>
      </header>

      {/* Quick Stats */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass stat-card">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 color="var(--success)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Tasks</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.statusCounts.TODO + stats.statusCounts.IN_PROGRESS + stats.statusCounts.DONE}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stats.statusCounts.DONE} Completed</p>
        </div>

        <div className="glass stat-card">
          <div className="flex items-center justify-between mb-4">
            <Clock color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>In Progress</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.statusCounts.IN_PROGRESS}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Working now</p>
        </div>

        <div className="glass stat-card">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle color="var(--danger)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overdue</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.overdueCount}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Action required</p>
        </div>

        <div className="glass stat-card">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp color="var(--warning)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned to Me</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.assignedTasks.length}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pending tasks</p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Project Progress */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Project Progress</h3>
          <div className="flex" style={{ flexDirection: 'column', gap: '1.5rem' }}>
            {stats.projectProgress.map((p: any) => (
              <div key={p.id}>
                <div className="flex justify-between mb-2">
                  <span style={{ fontWeight: '500' }}>{p.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.progress}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${p.progress}%`, 
                    background: 'var(--primary)',
                    borderRadius: '4px',
                    transition: 'width 1s ease-in-out'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>My Tasks</h3>
          <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
            {stats.assignedTasks.length > 0 ? stats.assignedTasks.map((task: any) => (
              <div key={task.id} className="flex items-center gap-4" style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ 
                  width: '4px', 
                  height: '40px', 
                  background: task.priority === 'HIGH' ? 'var(--danger)' : task.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)',
                  borderRadius: '2px'
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{task.title}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{task.project.name}</p>
                </div>
                <Calendar size={16} color="var(--text-muted)" />
              </div>
            )) : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No pending tasks.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
