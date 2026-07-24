import React, { useMemo, useState } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import SectionCard from '../components/dashboard/SectionCard';
import SearchBar from '../components/dashboard/SearchBar';
import StatusBadge from '../components/dashboard/StatusBadge';
import ChartCard from '../components/dashboard/ChartCard';
import SkeletonBlock from '../components/dashboard/SkeletonBlock';
import { useApiData } from '../hooks/useApiData';

const mockStats = {
  totalDoctors: 24,
  totalPatients: 318,
  todayAppointments: 42,
  totalRevenue: '$184.2k',
  pendingBills: 17,
  labTests: 29,
  availableMedicines: 142,
  lowStockMedicines: 6,
};

const revenueData = [12000, 16800, 15200, 19800, 22400, 24100];
const appointmentsData = [18, 25, 21, 32, 36, 41];
const registrationData = [22, 31, 27, 35, 40, 48];
const departmentData = [
  { label: 'Cardiology', value: 6 },
  { label: 'Neurology', value: 4 },
  { label: 'Pediatrics', value: 5 },
  { label: 'Orthopedics', value: 3 },
  { label: 'General', value: 6 },
];

const appointmentsSeed = [
  { patient: 'Ava Thompson', doctor: 'Dr. Rao', time: '09:30', status: 'Confirmed' },
  { patient: 'Noah Lewis', doctor: 'Dr. Kim', time: '11:00', status: 'Pending' },
  { patient: 'Mia Gomez', doctor: 'Dr. Singh', time: '13:15', status: 'Completed' },
  { patient: 'Leo Carter', doctor: 'Dr. Patel', time: '15:00', status: 'Scheduled' },
];

const patientsSeed = [
  { name: 'Ava Thompson', age: 34, condition: 'Diabetes', status: 'Stable' },
  { name: 'Noah Lewis', age: 48, condition: 'Orthopedic', status: 'Monitoring' },
  { name: 'Mia Gomez', age: 29, condition: 'Respiratory', status: 'Recovered' },
  { name: 'Leo Carter', age: 41, condition: 'Cardiology', status: 'Stable' },
];

const billsSeed = [
  { number: 'INV-1042', patient: 'Ava Thompson', amount: '$240', status: 'Paid' },
  { number: 'INV-1043', patient: 'Noah Lewis', amount: '$840', status: 'Pending' },
  { number: 'INV-1044', patient: 'Mia Gomez', amount: '$110', status: 'Pending' },
  { number: 'INV-1045', patient: 'Leo Carter', amount: '$500', status: 'Paid' },
];

export default function AdminDashboardPage() {
  const { data: doctors = [], loading: doctorsLoading, error: doctorsError } = useApiData('/doctors');
  const { data: patients = [], loading: patientsLoading, error: patientsError } = useApiData('/patients');
  const { data: appointments = [], loading: appointmentsLoading, error: appointmentsError } = useApiData('/appointments');
  const { data: bills = [], loading: billsLoading, error: billsError } = useApiData('/bills');

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 3;

  const filteredAppointments = useMemo(() => {
    const query = search.toLowerCase();
    return (appointments.length ? appointments : appointmentsSeed).filter((item) => {
      const matchesSearch = [item.patient?.name, item.doctor?.name, item.status, item.time].filter(Boolean).join(' ').toLowerCase().includes(query);
      const matchesFilter = filter === 'All' || item.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [appointments, search, filter]);

  const pagedAppointments = filteredAppointments.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / pageSize));

  const renderError = (message) => <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{message}</div>;
  const renderEmpty = (message) => <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">{message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Operations</p>
          <h2 className="text-3xl font-semibold">Admin Dashboard</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search appointments" />
          <select value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
            <option value="All">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {doctorsLoading ? <SkeletonBlock className="h-28" /> : doctorsError ? renderError(doctorsError) : <MetricCard title="Total Doctors" value={doctors.length || mockStats.totalDoctors} change="+3 this month" icon="🧑‍⚕️" tone="blue" />}
        {patientsLoading ? <SkeletonBlock className="h-28" /> : patientsError ? renderError(patientsError) : <MetricCard title="Total Patients" value={patients.length || mockStats.totalPatients} change="+8% this week" icon="🧾" tone="green" />}
        <MetricCard title="Today's Appointments" value={mockStats.todayAppointments} change="12 urgent" icon="🗓️" tone="amber" />
        <MetricCard title="Total Revenue" value={mockStats.totalRevenue} change="+$12k vs last month" icon="💰" tone="purple" />
        <MetricCard title="Pending Bills" value={mockStats.pendingBills} change="3 require review" icon="🧾" tone="rose" />
        <MetricCard title="Laboratory Tests" value={mockStats.labTests} change="7 urgent results" icon="🧪" tone="blue" />
        <MetricCard title="Available Medicines" value={mockStats.availableMedicines} change="Stable supply" icon="💊" tone="green" />
        <MetricCard title="Low Stock Medicines" value={mockStats.lowStockMedicines} change="Reorder soon" icon="⚠️" tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Monthly Revenue" subtitle="Last 6 months performance">
          <div className="h-full rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex h-full items-end gap-3">
              {revenueData.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-2xl bg-gradient-to-t from-blue-600 to-cyan-400" style={{ height: `${value / 250}px` }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">M{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Appointments Per Month" subtitle="Patient visit trends">
          <div className="h-full rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex h-full items-end gap-3">
              {appointmentsData.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-500 to-green-400" style={{ height: `${value * 3}px` }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">M{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Patient Registration Trend" subtitle="New registrations over time">
          <div className="h-full rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex h-full items-end gap-3">
              {registrationData.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-2xl bg-gradient-to-t from-violet-500 to-fuchsia-400" style={{ height: `${value * 2.6}px` }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">M{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Department-wise Doctors" subtitle="Specialist distribution">
          <div className="flex h-full flex-col justify-center gap-3">
            {departmentData.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${item.value * 16}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Recent Appointments" subtitle="Latest scheduled visits" action={<span className="text-sm text-blue-600">Live</span>}>
          {appointmentsLoading ? <div className="space-y-3">{[...Array(3)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : appointmentsError ? renderError(appointmentsError) : filteredAppointments.length === 0 ? renderEmpty('No appointments match this search.') : (
            <div className="space-y-3">
              {pagedAppointments.map((item, index) => (
                <div key={item._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div>
<p className="font-medium">
  {item.patient?.fullName || "Unknown Patient"}
</p>
<p className="text-sm text-slate-500 dark:text-slate-400">
  {item.doctor?.fullName} • {item.appointmentTime}
</p>
                  </div>
                  <StatusBadge status={item.status || 'Scheduled'} />
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700">Prev</button>
              <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700">Next</button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Recent Patients" subtitle="Latest patient records" action={<span className="text-sm text-slate-500">Updated today</span>}>
          {patientsLoading ? <div className="space-y-3">{[...Array(3)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : patientsError ? renderError(patientsError) : patients.length ? (
            <div className="space-y-3">
              {(patients.slice(0, 4)).map((patient, index) => (
                <div key={`${patient.fullName}-${index}`} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{patient.fullName || '—'}</p>
                    <StatusBadge status={patient.status || 'Stable'} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{patient.condition || '—'} • {patient.age ? `${patient.age} years` : '—'}</p>
                </div>
              ))}
            </div>
          ) : renderEmpty('No patient records available.')}
        </SectionCard>

        <SectionCard title="Recent Bills" subtitle="Latest billing activity" action={<span className="text-sm text-slate-500">Pending review</span>}>
          {billsLoading ? <div className="space-y-3">{[...Array(3)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : billsError ? renderError(billsError) : bills.length ? (
            <div className="space-y-3">
              {(bills.slice(0, 4)).map((bill, index) => (
                <div key={`${bill.number}-${index}`} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{bill.number || '—'}</p>
                    <StatusBadge status={bill.status || 'Pending'} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{bill.patient || '—'} • {bill.amount || '—'}</p>
                </div>
              ))}
            </div>
          ) : renderEmpty('No billing records available.')}
        </SectionCard>
      </div>
    </div>
  );
}
