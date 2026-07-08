import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 HospitalOS. Centralized healthcare operations.</p>
        <p>Frontend foundation only — APIs will be connected later.</p>
      </div>
    </footer>
  );
}
