import React from 'react';

export default function MetricCard({ title, value, change, icon, tone = 'blue' }) {
  const toneClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-emerald-500 to-green-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
    purple: 'from-violet-500 to-fuchsia-500',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClasses[tone]} text-xl text-white`}>
          {icon}
        </div>
      </div>
      {change ? <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{change}</p> : null}
    </div>
  );
}
