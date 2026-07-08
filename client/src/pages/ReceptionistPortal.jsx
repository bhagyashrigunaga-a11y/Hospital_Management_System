import React, { useMemo, useState } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import SectionCard from '../components/dashboard/SectionCard';
import SkeletonBlock from '../components/dashboard/SkeletonBlock';
import StatusBadge from '../components/dashboard/StatusBadge';
import SearchBar from '../components/dashboard/SearchBar';
import { useApiData } from '../hooks/useApiData';

const mockPatients = [
  { id: 1, name: 'Ava Thompson', age: 34, status: 'Stable' },
  { id: 2, name: 'Noah Lewis', age: 48, status: 'Monitoring' },
  { id: 3, name: 'Mia Gomez', age: 29, status: 'Recovered' },
];

const mockAppointments = [
  { id: 1, patient: 'Ava Thompson', time: '09:30', status: 'Confirmed' },
  { id: 2, patient: 'Noah Lewis', time: '11:00', status: 'Pending' },
  { id: 3, patient: 'Mia Gomez', time: '13:15', status: 'Scheduled' },
];

const mockBills = [
  { id: 1, number: 'INV-1042', patient: 'Ava Thompson', amount: '$240', status: 'Paid' },
  { id: 2, number: 'INV-1043', patient: 'Noah Lewis', amount: '$840', status: 'Pending' },
];

export default function ReceptionistPortal() {
  const { data: patients = [], loading: patientsLoading, error: patientsError } = useApiData('/patients');
  const { data: appointments = [], loading: appointmentsLoading, error: appointmentsError } = useApiData('/appointments');
  const { data: bills = [], loading: billsLoading, error: billsError } = useApiData('/bills');
  const [search, setSearch] = useState('');

  const patientSource = useMemo(() => (patients.length ? patients : mockPatients), [patients]);
  const appointmentSource = useMemo(() => (appointments.length ? appointments : mockAppointments), [appointments]);
  const billSource = useMemo(() => (bills.length ? bills : mockBills), [bills]);

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase();
    return patientSource.filter((patient) => [patient.name, patient.condition, patient.status].join(' ').toLowerCase().includes(query));
  }, [patientSource, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Reception Desk</p>
          <h2 className="text-3xl font-semibold">Receptionist Dashboard</h2>
        </div>
        <SearchBar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patients" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Registered Patients" value={patientSource.length} change="Active records" icon="🧾" tone="blue" />
        <MetricCard title="Appointments" value={appointmentSource.length} change="Scheduled today" icon="🗓️" tone="green" />
        <MetricCard title="Pending Billing" value={billSource.filter((bill) => bill.status === 'Pending').length} change="Needs follow-up" icon="💳" tone="amber" />
        <MetricCard title="Quick Checks" value="3" change="Front desk tasks" icon="✅" tone="purple" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Patient Search" subtitle="Find existing patient records quickly">
          {patientsLoading ? <div className="space-y-3">{[...Array(3)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : patientsError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{patientsError}</div> : (
            <div className="space-y-3">
              {filteredPatients.length ? filteredPatients.map((patient) => (
                <div key={patient.id || patient._id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{patient.name || '—'}</p>
                    <StatusBadge status={patient.status || 'Stable'} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{patient.condition || '—'} • {patient.age ? `${patient.age} years` : '—'}</p>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No patients match your search.</div>}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Register Patients" subtitle="Create a new patient record">
          <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
            <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
              <p className="font-medium">Patient Form</p>
              <p className="text-slate-500 dark:text-slate-400">Ready for patient registration UI and API submission.</p>
            </div>
            <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">New Patient</button>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Book Appointment" subtitle="Schedule consultation slots">
          <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
            <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
              <p className="font-medium">Appointment Scheduler</p>
              <p className="text-slate-500 dark:text-slate-400">Calendar and booking form UI are ready for backend submission.</p>
            </div>
            <button className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Schedule Appointment</button>
          </div>
        </SectionCard>

        <SectionCard title="Appointment Calendar" subtitle="Upcoming visits">
          {appointmentsLoading ? <div className="space-y-3">{[...Array(3)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : appointmentsError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{appointmentsError}</div> : (
            <div className="space-y-3">
              {appointmentSource.map((item) => (
                <div key={item.id || item._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div>
                    <p className="font-medium">{item.patient?.name || item.patient}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.time || item.date}</p>
                  </div>
                  <StatusBadge status={item.status || 'Scheduled'} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Billing" subtitle="Pending invoices and payments">
        {billsLoading ? <div className="space-y-3">{[...Array(2)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : billsError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{billsError}</div> : (
          <div className="space-y-3">
            {billSource.map((bill) => (
              <div key={bill.id || bill._id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{bill.number || 'Invoice'}</p>
                  <StatusBadge status={bill.status || 'Pending'} />
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{bill.patient || 'Patient'} • {bill.amount || '—'}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
