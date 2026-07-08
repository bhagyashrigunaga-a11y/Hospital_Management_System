import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/Buttons';
import { Input, Select } from '../components/Forms';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Doctor' });
  const { register, loading } = useAuth();
  const { push } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await register(form);
      if (result?.success) {
        push('Account created successfully', 'success');
        navigate('/dashboard');
      }
    } catch (error) {
      push(error.response?.data?.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Create account</p>
      <h2 className="mt-3 text-3xl font-semibold">Join the HospitalOS experience</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Set up your profile and start exploring the modern care console.</p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. Maya Patel" required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="maya@hospitalos.com" required />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a password" required />
        <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="Doctor">Doctor</option>
          <option value="Administrator">Administrator</option>
          <option value="Nurse">Nurse</option>
          <option value="Receptionist">Receptionist</option>
        </Select>
        <PrimaryButton type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</PrimaryButton>
      </form>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Already have an account? <Link to="/login" className="font-semibold text-blue-600">Sign in</Link>
      </p>
    </div>
  );
}
