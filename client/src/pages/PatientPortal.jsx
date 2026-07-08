import React from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import SectionCard from '../components/dashboard/SectionCard';
import SkeletonBlock from '../components/dashboard/SkeletonBlock';
import StatusBadge from '../components/dashboard/StatusBadge';
import { useApiData } from '../hooks/useApiData';

const mockAppointments = [
  { id: 1, doctor: 'Dr. Rao', date: '2026-07-10', status: 'Confirmed', type: 'Checkup' },
  { id: 2, doctor: 'Dr. Kim', date: '2026-07-18', status: 'Pending', type: 'Follow-up' },
];

const mockPrescriptions = [
  { id: 1, medication: 'Metformin', dosage: '500mg', status: 'Active' },
  { id: 2, medication: 'Vitamin D', dosage: '1000 IU', status: 'Completed' },
];

const mockBills = [
  { id: 1, number: 'INV-1042', amount: '$240', status: 'Paid' },
  { id: 2, number: 'INV-1043', amount: '$840', status: 'Pending' },
];

export default function PatientPortal() {
  const { data: appointments = [], loading: appointmentsLoading, error: appointmentsError } = useApiData('/appointments');
  const { data: prescriptions = [], loading: prescriptionsLoading, error: prescriptionsError } = useApiData('/prescriptions');
  const { data: bills = [], loading: billsLoading, error: billsError } = useApiData('/bills');
  const { data: labs = [], loading: labsLoading, error: labsError } = useApiData('/laboratory');
  const { data: medicines = [], loading: medicinesLoading, error: medicinesError } = useApiData('/medicines');

  const appointmentsSource = appointments.length ? appointments : mockAppointments;
  const prescriptionsSource = prescriptions.length ? prescriptions : mockPrescriptions;
  const billsSource = bills.length ? bills : mockBills;
  const laboratorySource = labs.length ? labs : [];
  const medicinesSource = medicines.length ? medicines : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Patient Portal</p>
          <h2 className="text-3xl font-semibold">Patient Dashboard</h2>
        </div>
        <Link to="/profile" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
          View Profile
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="My Appointments" value={appointmentsSource.length} change="Upcoming and past visits" icon="🗓️" tone="blue" />
        <MetricCard title="Active Prescriptions" value={prescriptionsSource.length} change="Current treatment plan" icon="💊" tone="green" />
        <MetricCard title="Outstanding Bills" value={billsSource.filter((bill) => bill.status === 'Pending').length} change="Pending payments" icon="💳" tone="amber" />
        <MetricCard title="Lab Reports" value={laboratorySource.length || 2} change="Available results" icon="🧪" tone="purple" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="My Appointments" subtitle="Scheduled appointments and visits">
          {appointmentsLoading ? <div className="space-y-3">{[...Array(2)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : appointmentsError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{appointmentsError}</div> : (
            <div className="space-y-3">
              {appointmentsSource.map((item) => (
                <div key={item.id || item._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div>
                    <p className="font-medium">{item.doctor?.name || item.doctor}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.date || item.time} • {item.type || 'Consultation'}</p>
                  </div>
                  <StatusBadge status={item.status || 'Scheduled'} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="My Prescriptions" subtitle="Current prescribed medications">
          {prescriptionsLoading ? <div className="space-y-3">{[...Array(2)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : prescriptionsError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{prescriptionsError}</div> : (
            <div className="space-y-3">
              {prescriptionsSource.map((item) => (
                <div key={item.id || item._id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.medication || item.name || 'Medication'}</p>
                    <StatusBadge status={item.status || 'Active'} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.dosage || item.instructions || 'As directed'}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="My Bills" subtitle="Invoices and payment status">
          {billsLoading ? <div className="space-y-3">{[...Array(2)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : billsError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{billsError}</div> : (
            <div className="space-y-3">
              {billsSource.map((bill) => (
                <div key={bill.id || bill._id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{bill.number || 'Invoice'}</p>
                    <StatusBadge status={bill.status || 'Pending'} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{bill.amount || 'Pending'}</p>
                  <button className="mt-3 rounded-xl border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700">Download Bill</button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Laboratory Reports" subtitle="Recent test results">
          {labsLoading ? <div className="space-y-3">{[...Array(2)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : labsError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{labsError}</div> : (
            <div className="space-y-3">
              {laboratorySource.length ? laboratorySource.slice(0, 2).map((lab) => (
                <div key={lab.id || lab._id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <p className="font-medium">{lab.testName || 'Lab Test'}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lab.result || 'Pending review'}</p>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No reports yet.</div>}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Medicine History" subtitle="Medication history and inventory status">
          {medicinesLoading ? <div className="space-y-3">{[...Array(2)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : medicinesError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{medicinesError}</div> : (
            <div className="space-y-3">
              {medicinesSource.length ? medicinesSource.slice(0, 2).map((medicine) => (
                <div key={medicine.id || medicine._id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <p className="font-medium">{medicine.name || 'Medicine'}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Stock: {medicine.stock || '—'}</p>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No medicine history.</div>}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Notifications & Profile" subtitle="Recent reminders and account details">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Notifications</p>
            <p className="mt-2 font-medium">Upcoming appointment reminder</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Keep your profile updated before your next visit.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Profile</p>
            <p className="mt-2 font-medium">Patient account details</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage personal data and contact details.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
