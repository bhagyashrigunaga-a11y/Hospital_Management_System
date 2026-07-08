import React from 'react';
import { PanelCard, StatCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { useApiData } from '../hooks/useApiData';
import Loader from '../components/Loader';

export default function Billing() {
  const { data, loading, error } = useApiData('/bills');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Outstanding" value="$18.4k" detail="Pending invoices" tone="amber" />
        <StatCard title="Collected" value="$74.8k" detail="This month" tone="green" />
        <StatCard title="Claims" value="12" detail="Awaiting approval" tone="blue" />
      </div>
      <PanelCard title="Invoice Overview">
        {loading ? <Loader /> : error ? <p className="text-sm text-rose-600">{error}</p> : <DataTable headers={['Invoice', 'Patient', 'Amount', 'Status']} rows={(data || []).map((bill) => [bill.invoiceNumber || '—', bill.patient?.name || '—', bill.amount ? `$${bill.amount}` : '—', bill.status || 'Pending'])} />}
      </PanelCard>
    </div>
  );
}
