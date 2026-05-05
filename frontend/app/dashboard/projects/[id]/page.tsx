'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { 
  Plus, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Paperclip,
  User as UserIcon,
  Search,
  Filter,
  Users as UsersIcon,
  X
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function ProjectTasksPage() {
  const { id } = useParams();
  const { user } = useUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '', assigneeId: '' });
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const fetchProjectData = async () => {
    try {
      const { data: projects } = await api.get('/projects');
      const p = projects.find((proj: any) => proj.id === id);
      setProject(p);
      
      const { data: taskData } = await api.get(`/tasks/project/${id}`);
      setTasks(taskData);
    } catch (err) {
      console.error('Failed to fetch project data');
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      fetchProjectData();
      setNewTask({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '', assigneeId: '' });
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: newMemberEmail, role: 'MEMBER' });
      setShowMemberModal(false);
      fetchProjectData();
      setNewMemberEmail('');
    } catch (err) {
      alert('User not found or already a member');
    }
  };

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectData();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const columns = [
    { id: 'TODO', name: 'To Do', icon: Clock, color: 'var(--text-muted)' },
    { id: 'IN_PROGRESS', name: 'In Progress', icon: AlertCircle, color: 'var(--primary)' },
    { id: 'DONE', name: 'Done', icon: CheckCircle2, color: 'var(--success)' },
  ];

  if (!project) return <p>Loading...</p>;

  const isAdmin = (user?.publicMetadata?.role === 'ADMIN' || user?.primaryEmailAddress?.emailAddress === 'admin@example.com');

  return (
    <div className="fade-in">
      <header className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Link href="/dashboard/projects">Projects</Link> / <span>{project.name}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Board</h1>
        </div>
        <div className="flex gap-4">
          <button 
            className="btn btn-outline flex items-center gap-2" 
            onClick={() => setShowMemberModal(true)}
            style={{ position: 'relative' }}
          >
            <UsersIcon size={18} />
            Team ({project.members?.length || 0})
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => setShowTaskModal(true)}>
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </header>

      {/* Task Board */}
      <div className="flex gap-6" style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        {columns.map((col) => (
          <div key={col.id} style={{ minWidth: '350px', flex: 1 }}>
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <col.icon size={18} color={col.color} />
                <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{col.name}</h3>
                <span style={{ 
                  background: 'var(--border)', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
            </div>

            <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
              {tasks.filter(t => t.status === col.id).map((task) => (
                <div key={task.id} className="glass" style={{ padding: '1.25rem' }}>
                  <div className="flex justify-between items-start mb-3">
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 'bold', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      background: task.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                      color: task.priority === 'HIGH' ? 'var(--danger)' : 'var(--warning)'
                    }}>
                      {task.priority}
                    </span>
                    <div className="flex gap-2">
                      {col.id !== 'TODO' && (
                        <button onClick={() => updateStatus(task.id, col.id === 'DONE' ? 'IN_PROGRESS' : 'TODO')} className="btn-icon">←</button>
                      )}
                      {col.id !== 'DONE' && (
                        <button onClick={() => updateStatus(task.id, col.id === 'TODO' ? 'IN_PROGRESS' : 'DONE')} className="btn-icon">→</button>
                      )}
                    </div>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineClamp: 3 }}>
                    {task.description}
                  </p>
                  
                  <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: task.isOverdue ? 'var(--danger)' : 'var(--text-muted)' }}>
                      <Calendar size={14} />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </div>
                    <div title={task.assignee?.name || 'Unassigned'}>
                      {task.assignee?.avatarUrl ? (
                        <img src={task.assignee.avatarUrl} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <UserIcon size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="glass modal-content">
            <h2 style={{ marginBottom: '1.5rem' }}>Add New Task</h2>
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Task Title" 
                required 
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
              />
              <textarea 
                placeholder="Description" 
                style={{ minHeight: '100px' }}
                value={newTask.description}
                onChange={e => setNewTask({...newTask, description: e.target.value})}
              />
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select 
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
                <input 
                  type="date" 
                  value={newTask.dueDate}
                  onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assign To Member</label>
                <select 
                  value={newTask.assigneeId}
                  onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}
                  required
                >
                  <option value="">Select Assignee</option>
                  {project.members?.map((m: any) => (
                    <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button type="button" className="btn btn-outline flex-1" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Management Modal */}
      {showMemberModal && (
        <div className="modal-overlay">
          <div className="glass modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2>Project Team</h2>
              <button onClick={() => setShowMemberModal(false)}><X size={20} /></button>
            </div>

            {/* Member List */}
            <div className="flex flex-col gap-4 mb-8">
              {project.members?.map((m: any) => (
                <div key={m.user.id} className="flex justify-between items-center p-3 glass" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                      {m.user.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{m.user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.role}</p>
                    </div>
                  </div>
                  {isAdmin && m.user.id !== user?.id && (
                    <button style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>Remove</button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Member Form */}
            {isAdmin && (
              <form onSubmit={handleAddMember} className="flex flex-col gap-4 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Add Member</p>
                <input 
                  type="email" 
                  placeholder="Collaborator email address" 
                  required 
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Invite Member</button>
              </form>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          padding: 2.5rem;
          width: 100%;
          max-width: 500px;
        }
        .btn-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
          color: var(--text-muted);
          font-size: 1rem;
        }
        .btn-icon:hover {
          background: var(--primary);
          color: white;
        }
        .flex-1 { flex: 1; }
        .flex-col { flex-direction: column; }
      `}</style>
    </div>
  );
}
