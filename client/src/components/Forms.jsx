import React from 'react';

export function Input({ label, ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      <span className="mb-2 block">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
      />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      <span className="mb-2 block">{label}</span>
      <select
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
      >
        {children}
      </select>
    </label>
  );
}
