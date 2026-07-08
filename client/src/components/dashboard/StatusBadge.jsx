import React from 'react';

export default function StatusBadge({ status }) {
  const palette = {
    Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    Confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    Scheduled: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    Completed: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${palette[status] || palette.Scheduled}`}>{status}</span>;
}
