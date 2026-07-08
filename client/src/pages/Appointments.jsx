import React from 'react';
import { PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { PrimaryButton } from '../components/Buttons';
import { useApiData } from '../hooks/useApiData';
import Loader from '../components/Loader';

export default function Appointments() {
  const { data, loading, error } = useApiData('/appointments');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Scheduling</p>
          <h2 className="text-2xl font-semibold">Appointments</h2>
        </div>
        <PrimaryButton>Schedule</PrimaryButton>
      </div>
      <PanelCard title="Today’s Schedule">
        {loading ? <Loader /> : error ? <p className="text-sm text-rose-600">{error}</p> : <DataTable headers={['Patient', 'Doctor', 'Slot', 'Type']} rows={(data || []).map((appointment) => [appointment.patient?.name || '—', appointment.doctor?.name || '—', appointment.time || appointment.date || '—', appointment.type || 'Consultation'])} />}
      </PanelCard>
    </div>
  );
}
