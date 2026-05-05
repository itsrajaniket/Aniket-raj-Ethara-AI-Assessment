'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { Plus, MoreVertical, Calendar, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', deadline: '' });

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      fetchProjects();
      setNewProject({ name: '', description: '', deadline: '' });
    } catch (err) {
      alert('Only admins can create projects');
    }
  };

  return (
    <div className="fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track your active projects.</p>
        </div>
        {(user?.publicMetadata?.role === 'ADMIN' || user?.primaryEmailAddress?.emailAddress === 'admin@example.com') && (
          <button className="btn btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            New Project
          </button>
        )}
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {projects.map((project) => (
          <div key={project.id} className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div className="flex justify-between items-start mb-4">
              <h3 style={{ fontSize: '1.25rem' }}>{project.name}</h3>
              <button style={{ color: 'var(--text-muted)' }}><MoreVertical size={20} /></button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
              {project.description || 'No description provided.'}
            </p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Calendar size={14} />
                {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
              </div>
              <div className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Users size={14} />
                {project.members?.length || 0} Members
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div style={{ display: 'flex' }}>
                {project.members?.slice(0, 3).map((m: any, i: number) => (
                  <div key={m.id} style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    background: 'var(--border)', 
                    marginLeft: i > 0 ? '-8px' : '0',
                    border: '2px solid var(--card)',
                    overflow: 'hidden'
                  }}>
                    {m.user.avatarUrl && <img src={m.user.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                ))}
                {project.members?.length > 3 && (
                  <div style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    background: 'var(--border)', 
                    marginLeft: '-8px',
                    border: '2px solid var(--card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem'
                  }}>+{project.members.length - 3}</div>
                )}
              </div>
              <Link href={`/dashboard/projects/${project.id}`} className="btn btn-outline flex items-center gap-2" style={{ fontSize: '0.85rem' }}>
                View Tasks
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Project</h2>
            <form onSubmit={handleCreate} className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Project Name" 
                required 
                value={newProject.name}
                onChange={e => setNewProject({...newProject, name: e.target.value})}
              />
              <textarea 
                placeholder="Description" 
                style={{ minHeight: '100px' }}
                value={newProject.description}
                onChange={e => setNewProject({...newProject, description: e.target.value})}
              />
              <input 
                type="date" 
                value={newProject.deadline}
                onChange={e => setNewProject({...newProject, deadline: e.target.value})}
              />
              <div className="flex gap-4" style={{ marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
