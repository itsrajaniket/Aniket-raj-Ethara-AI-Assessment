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
  Filter
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function ProjectTasksPage() {
  const { id } = useParams();
  const { user } = useUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '' });

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/project/${id}`);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await api.get('/projects');
      const p = data.find((proj: any) => proj.id === id);
      setProject(p);
    };
    fetchProject();
    fetchTasks();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowModal(false);
      fetchTasks();
      setNewTask({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '' });
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
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

  return (
    <div className="fade-in">
      <header className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Link href="/dashboard/projects">Projects</Link> / <span>{project.name}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Tasks</h1>
        </div>
        <div className="flex gap-4">
          <div className="glass flex items-center gap-2" style={{ padding: '0.5rem 1rem' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              style={{ background: 'none', border: 'none', padding: 0, width: '200px' }} 
            />
          </div>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </header>

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
                <div key={task.id} className="glass" style={{ padding: '1rem', cursor: 'grab' }}>
                  <div className="flex justify-between items-start mb-2">
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 'bold', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      background: task.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                      color: task.priority === 'HIGH' ? 'var(--danger)' : 'var(--warning)'
                    }}>
                      {task.priority}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {col.id !== 'TODO' && (
                        <button onClick={() => updateStatus(task.id, col.id === 'DONE' ? 'IN_PROGRESS' : 'TODO')} style={{ color: 'var(--text-muted)' }}>←</button>
                      )}
                      {col.id !== 'DONE' && (
                        <button onClick={() => updateStatus(task.id, col.id === 'TODO' ? 'IN_PROGRESS' : 'DONE')} style={{ color: 'var(--text-muted)' }}>→</button>
                      )}
                    </div>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineClamp: 2 }}>
                    {task.description}
                  </p>
                  
                  <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: task.isOverdue ? 'var(--danger)' : 'var(--text-muted)' }}>
                      <Calendar size={14} />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </div>
                    <div className="flex items-center gap-2">
                      {task.attachments?.length > 0 && <Paperclip size={14} color="var(--text-muted)" />}
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--border)', overflow: 'hidden' }}>
                        {task.assignee?.avatarUrl ? (
                          <img src={task.assignee.avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <UserIcon size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Creation Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add New Task</h2>
            <form onSubmit={handleCreateTask} className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
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
              <div className="flex gap-4">
                <select 
                  style={{ flex: 1 }}
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
                <input 
                  type="date" 
                  style={{ flex: 1 }}
                  value={newTask.dueDate}
                  onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="flex gap-4" style={{ marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
