import React from 'react';
import { PanelCard, StatCard } from '../components/Cards';

export default function Profile() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Role" value="Administrator" detail="Hospital operations" tone="blue" />
        <StatCard title="Shift" value="Full Day" detail="Coverage active" tone="green" />
        <StatCard title="Last Login" value="08:45" detail="Today" tone="amber" />
      </div>
      <PanelCard title="Account Details">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
            <p className="mt-2 font-semibold">Dr. Maya Patel</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
            <p className="mt-2 font-semibold">maya@hospitalos.com</p>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
