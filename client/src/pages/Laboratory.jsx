import React from 'react';
import { PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { useApiData } from '../hooks/useApiData';
import Loader from '../components/Loader';

export default function Laboratory() {
  const { data, loading, error } = useApiData('/laboratory');

  return (
    <div className="space-y-6">
      <PanelCard title="Lab Queue">
        {loading ? <Loader /> : error ? <p className="text-sm text-rose-600">{error}</p> : <DataTable headers={['Sample', 'Patient', 'Test', 'Result']} rows={(data || []).map((test) => [test.sampleId || '—', test.patient?.name || '—', test.testName || '—', test.result || 'Pending'])} />}
      </PanelCard>
    </div>
  );
}
