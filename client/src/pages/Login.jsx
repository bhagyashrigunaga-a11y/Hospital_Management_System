import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { Input } from '../components/Forms';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();
  const { push } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await login({ email: form.email, password: form.password });
      if (result?.success) {
        push('Signed in successfully', 'success');
        const role = result.user?.role?.toLowerCase();
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'doctor') navigate('/doctor-dashboard');
        else if (role === 'patient') navigate('/patient-dashboard');
        else if (role === 'receptionist') navigate('/receptionist-dashboard');
        else navigate('/dashboard');
      }
    } catch (error) {
      push(error.response?.data?.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-700 p-8 text-white sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">HospitalOS</p>
          <h2 className="mt-4 text-3xl font-semibold">Welcome back to your care command center.</h2>
          <p className="mt-4 max-w-md text-sm text-blue-100">Manage patients, appointments, billing, and clinical workflows from one polished workspace.</p>
          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm font-medium">Demo access</p>
            <p className="mt-2 text-sm text-blue-100">Use any email to enter the UI. No backend connection yet.</p>
          </div>
        </div>
        <div className="p-8 sm:p-10">
          <h3 className="text-2xl font-semibold">Sign in</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Access the hospital management dashboard.</p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@hospitalos.com" required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
            <div className="flex items-center justify-between gap-3 pt-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">
                <input type="checkbox" className="mr-2 rounded border-slate-300" />
                Remember me
              </label>
              <Link to="/register" className="text-sm font-semibold text-blue-600">Create account</Link>
            </div>
            <PrimaryButton type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</PrimaryButton>
            <SecondaryButton type="button" onClick={() => navigate('/dashboard')} className="w-full">Preview dashboard</SecondaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}
