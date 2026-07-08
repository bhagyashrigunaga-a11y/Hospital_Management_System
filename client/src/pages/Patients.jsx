import React from 'react';
import { PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { PrimaryButton } from '../components/Buttons';
import { useApiData } from '../hooks/useApiData';
import Loader from '../components/Loader';

export default function Patients() {
  const { data, loading, error } = useApiData('/patients');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Records</p>
          <h2 className="text-2xl font-semibold">Patients</h2>
        </div>
        <PrimaryButton>New Patient</PrimaryButton>
      </div>
      <PanelCard title="Patient Directory">
        {loading ? <Loader /> : error ? <p className="text-sm text-rose-600">{error}</p> : <DataTable headers={['Name', 'Condition', 'Room', 'Status']} rows={(data || []).map((patient) => [patient.name || '—', patient.condition || '—', patient.room || '—', patient.status || 'Stable'])} />}
      </PanelCard>
    </div>
  );
}
