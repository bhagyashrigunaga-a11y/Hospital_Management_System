import React from 'react';
import { StatCard, PanelCard } from '../components/Cards';
import { useApiData } from '../hooks/useApiData';

export default function ReceptionistDashboard() {
  const { data: patients, loading: patientsLoading } = useApiData('/patients');
  const { data: appointments, loading: appointmentsLoading } = useApiData('/appointments');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Patients" value={patientsLoading ? '—' : patients?.length || 0} detail="Registered visitors" tone="blue" />
        <StatCard title="Appointments" value={appointmentsLoading ? '—' : appointments?.length || 0} detail="Scheduled today" tone="green" />
      </div>
      <PanelCard title="Reception Desk">
        <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          Receptionist dashboard is ready for check-ins, queue management, and appointment flow.
        </div>
      </PanelCard>
    </div>
  );
}
