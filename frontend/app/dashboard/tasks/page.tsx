'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

export default function AllTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const { user } = useUser();

  const fetchAllTasks = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setTasks(data.assignedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  return (
    <div className="fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>Viewing all your assigned tasks across projects.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass flex items-center gap-2" style={{ padding: '0.5rem 1rem' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Filter by title..." 
              style={{ background: 'none', border: 'none', padding: 0, width: '200px' }} 
            />
          </div>
          <select 
            className="glass" 
            style={{ padding: '0.5rem 1rem' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </header>

      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '1.25rem' }}>Task</th>
              <th style={{ padding: '1.25rem' }}>Project</th>
              <th style={{ padding: '1.25rem' }}>Status</th>
              <th style={{ padding: '1.25rem' }}>Priority</th>
              <th style={{ padding: '1.25rem' }}>Due Date</th>
              <th style={{ padding: '1.25rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? filteredTasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem' }}>
                  <p style={{ fontWeight: '600' }}>{task.title}</p>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <Link href={`/dashboard/projects/${task.project.id}`} style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>
                    {task.project.name}
                  </Link>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    fontSize: '0.8rem',
                    background: task.status === 'DONE' ? 'rgba(34, 197, 94, 0.1)' : task.status === 'IN_PROGRESS' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    color: task.status === 'DONE' ? 'var(--success)' : task.status === 'IN_PROGRESS' ? 'var(--primary)' : 'var(--text-muted)',
                    padding: '4px 10px',
                    borderRadius: '100px'
                  }}>
                    {task.status === 'DONE' ? <CheckCircle2 size={14} /> : task.status === 'IN_PROGRESS' ? <Clock size={14} /> : <AlertCircle size={14} />}
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '1.25rem' }}>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    color: task.priority === 'HIGH' ? 'var(--danger)' : task.priority === 'MEDIUM' ? 'var(--warning)' : 'var(--success)'
                  }}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </div>
                </td>
                <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                  <button style={{ color: 'var(--text-muted)' }}><MoreVertical size={18} /></button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No tasks found matching your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
