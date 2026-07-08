import React from 'react';
import { StatCard, PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { useApiData } from '../hooks/useApiData';

export default function AdminDashboard() {
  const { data: doctors, loading: doctorsLoading } = useApiData('/doctors');
  const { data: patients, loading: patientsLoading } = useApiData('/patients');
  const { data: appointments, loading: appointmentsLoading } = useApiData('/appointments');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Doctors" value={doctorsLoading ? '—' : doctors?.length || 0} detail="Registered specialists" tone="blue" />
        <StatCard title="Patients" value={patientsLoading ? '—' : patients?.length || 0} detail="Active records" tone="green" />
        <StatCard title="Appointments" value={appointmentsLoading ? '—' : appointments?.length || 0} detail="Scheduled visits" tone="amber" />
      </div>
      <PanelCard title="System Overview">
        <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          Admin dashboard connected to backend data endpoints.
        </div>
      </PanelCard>
      <PanelCard title="Recent Appointments">
        <DataTable
          headers={['Patient', 'Doctor', 'Date', 'Status']}
          rows={appointments.slice(0, 5).map((entry) => [entry.patient?.name || '—', entry.doctor?.name || '—', entry.date || '—', entry.status || 'Scheduled'])}
        />
      </PanelCard>
    </div>
  );
}
