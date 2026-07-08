import React from 'react';
import { PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { useApiData } from '../hooks/useApiData';
import Loader from '../components/Loader';

export default function Inventory() {
  const { data, loading, error } = useApiData('/medicines');

  return (
    <div className="space-y-6">
      <PanelCard title="Inventory Overview">
        {loading ? <Loader /> : error ? <p className="text-sm text-rose-600">{error}</p> : <DataTable headers={['Item', 'Category', 'Qty', 'Location']} rows={(data || []).map((medicine) => [medicine.name || '—', medicine.category || 'Medication', medicine.stock || '—', medicine.location || '—'])} />}
      </PanelCard>
    </div>
  );
}
