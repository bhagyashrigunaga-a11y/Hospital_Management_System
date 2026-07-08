import React from 'react';
import { StatCard, PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Patients Today" value="128" detail="+12% from yesterday" tone="blue" />
        <StatCard title="Appointments" value="42" detail="8 confirmed today" tone="green" />
        <StatCard title="Revenue" value="$84.2k" detail="Monthly outlook" tone="amber" />
        <StatCard title="Pending Reviews" value="17" detail="3 critical tasks" tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PanelCard title="Care Operations Snapshot" action={<span className="text-sm text-slate-500">Live preview</span>}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Emergency</p>
              <p className="mt-2 text-2xl font-semibold">4</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">ICU</p>
              <p className="mt-2 text-2xl font-semibold">6</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Discharges</p>
              <p className="mt-2 text-2xl font-semibold">9</p>
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Upcoming Schedule" action={<span className="text-sm text-blue-600">Today</span>}>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">09:00 — Dr. Amelia checks 3 patients</li>
            <li className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">11:30 — Lab samples collection</li>
            <li className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">15:00 — Billing review meeting</li>
          </ul>
        </PanelCard>
      </div>

      <PanelCard title="Recent Appointments">
        <DataTable
          headers={['Patient', 'Doctor', 'Time', 'Status']}
          rows={[
            ['Ava Thompson', 'Dr. Rao', '09:30', 'Confirmed'],
            ['Noah Lewis', 'Dr. Kim', '11:00', 'Pending'],
            ['Mia Gomez', 'Dr. Singh', '13:15', 'Completed'],
          ]}
        />
      </PanelCard>
    </div>
  );
}
