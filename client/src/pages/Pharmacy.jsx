import React from 'react';
import { PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { useApiData } from '../hooks/useApiData';
import Loader from '../components/Loader';

export default function Pharmacy() {
  const { data, loading, error } = useApiData('/medicines');

  return (
    <div className="space-y-6">
      <PanelCard title="Medication Inventory">
        {loading ? <Loader /> : error ? <p className="text-sm text-rose-600">{error}</p> : <DataTable headers={['Medicine', 'Stock', 'Threshold', 'Status']} rows={(data || []).map((medicine) => [medicine.name || '—', medicine.stock || '—', medicine.threshold || '—', medicine.status || 'Healthy'])} />}
      </PanelCard>
    </div>
  );
}
