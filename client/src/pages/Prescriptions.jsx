import React from 'react';
import { PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { useApiData } from '../hooks/useApiData';
import Loader from '../components/Loader';

export default function Prescriptions() {
  const { data, loading, error } = useApiData('/prescriptions');

  return (
    <div className="space-y-6">
      <PanelCard title="Medication Orders">
        {loading ? <Loader /> : error ? <p className="text-sm text-rose-600">{error}</p> : <DataTable headers={['Patient', 'Medication', 'Dosage', 'Status']} rows={(data || []).map((prescription) => [prescription.patient?.name || '—', prescription.medication || '—', prescription.dosage || '—', prescription.status || 'Active'])} />}
      </PanelCard>
    </div>
  );
}
