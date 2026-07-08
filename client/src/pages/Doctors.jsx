import React from 'react';
import { PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { PrimaryButton } from '../components/Buttons';
import { useApiData } from '../hooks/useApiData';
import Loader from '../components/Loader';

export default function Doctors() {
  const { data, loading, error } = useApiData('/doctors');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Staff</p>
          <h2 className="text-2xl font-semibold">Doctors</h2>
        </div>
        <PrimaryButton>Add Doctor</PrimaryButton>
      </div>
      <PanelCard title="Clinical Team">
        {loading ? <Loader /> : error ? <p className="text-sm text-rose-600">{error}</p> : <DataTable headers={['Name', 'Specialty', 'Shift', 'Status']} rows={(data || []).map((doctor) => [doctor.name || '—', doctor.specialty || '—', doctor.shift || '—', doctor.status || 'Available'])} />}
      </PanelCard>
    </div>
  );
}
