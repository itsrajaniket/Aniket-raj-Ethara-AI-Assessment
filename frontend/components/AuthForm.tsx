'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { GoogleLogin } from '@react-oauth/google';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = type === 'login' ? '/auth/login' : '/auth/signup';
      const { data } = await api.post(endpoint, formData);
      login(data.token, data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const { data } = await api.post('/auth/google', { idToken: credentialResponse.credential });
      login(data.token, data.user);
    } catch (err: any) {
      setError('Google login failed');
    }
  };

  return (
    <div className="glass fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>
        {type === 'login' ? 'Welcome Back' : 'Join Aura'}
      </h2>
      
      <form onSubmit={handleSubmit} className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
        {type === 'signup' && (
          <div className="flex" style={{ flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        )}
        <div className="flex" style={{ flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="flex" style={{ flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</p>}

        <button 
          className="btn btn-primary" 
          type="submit" 
          disabled={isLoading}
          style={{ marginTop: '0.5rem' }}
        >
          {isLoading ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ height: '1px', flex: 1, background: 'var(--border)' }}></div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
        <div style={{ height: '1px', flex: 1, background: 'var(--border)' }}></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin onSuccess={handleGoogleSuccess} theme="filled_black" />
      </div>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        {type === 'login' ? "Don't have an account? " : "Already have an account? "}
        <a 
          href={type === 'login' ? '/signup' : '/login'} 
          style={{ color: 'var(--primary)', fontWeight: '600' }}
        >
          {type === 'login' ? 'Sign up' : 'Sign in'}
        </a>
      </p>
    </div>
  );
}
