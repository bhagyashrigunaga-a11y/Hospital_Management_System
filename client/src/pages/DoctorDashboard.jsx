import React from 'react';
import { StatCard, PanelCard } from '../components/Cards';
import { useApiData } from '../hooks/useApiData';

export default function DoctorDashboard() {
  const { data: appointments, loading } = useApiData('/appointments');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Today" value="3" detail="Patient visits" tone="blue" />
        <StatCard title="Appointments" value={loading ? '—' : appointments?.length || 0} detail="Managed schedule" tone="green" />
      </div>
      <PanelCard title="Doctor Workspace">
        <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          Doctor dashboard is ready for backend-driven consultation data.
        </div>
      </PanelCard>
    </div>
  );
}
