import React from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../components/Buttons';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">404</p>
      <h2 className="mt-3 text-4xl font-semibold">Page not found</h2>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">The page you are looking for does not exist or has not been created in this frontend foundation yet.</p>
      <Link to="/dashboard" className="mt-6 inline-flex">
        <PrimaryButton>Return to dashboard</PrimaryButton>
      </Link>
    </div>
  );
}
