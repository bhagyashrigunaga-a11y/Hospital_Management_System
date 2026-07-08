import React from 'react';
import { StatCard, PanelCard } from '../components/Cards';

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Appointments" value="2" detail="Upcoming visits" tone="blue" />
        <StatCard title="Prescriptions" value="1" detail="Active medication" tone="green" />
      </div>
      <PanelCard title="Patient Portal">
        <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          Patient dashboard is ready for personal care records and appointments.
        </div>
      </PanelCard>
    </div>
  );
}
