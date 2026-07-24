import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import SectionCard from '../components/dashboard/SectionCard';
import SkeletonBlock from '../components/dashboard/SkeletonBlock';
import StatusBadge from '../components/dashboard/StatusBadge';
import { useApiData } from '../hooks/useApiData';

const mockAppointments = [
  { id: 1, patient: 'Ava Thompson', time: '09:30', status: 'Confirmed', type: 'Checkup' },
  { id: 2, patient: 'Noah Lewis', time: '11:00', status: 'Pending', type: 'Follow-up' },
  { id: 3, patient: 'Mia Gomez', time: '13:15', status: 'Completed', type: 'Consultation' },
];

const mockPatients = [
  { id: 1, name: 'Ava Thompson', condition: 'Diabetes', status: 'Stable' },
  { id: 2, name: 'Noah Lewis', condition: 'Orthopedic', status: 'Monitoring' },
  { id: 3, name: 'Mia Gomez', condition: 'Respiratory', status: 'Recovered' },
];

export default function DoctorPortal() {
  const { data: appointments = [], loading: appointmentsLoading, error: appointmentsError } = useApiData('/appointments');
  const { data: patients = [], loading: patientsLoading, error: patientsError } = useApiData('/patients');
  const { data: prescriptions = [], loading: prescriptionsLoading, error: prescriptionsError } = useApiData('/prescriptions');
  const { data: bills = [], loading: billsLoading, error: billsError } = useApiData('/bills');
  const { data: labs = [], loading: labsLoading, error: labsError } = useApiData('/laboratory');

  const todayAppointments = useMemo(() => {
    const source = appointments.length ? appointments : mockAppointments;
    return source.slice(0, 3);
  }, [appointments]);

  const upcomingAppointments = useMemo(() => {
    const source = appointments.length ? appointments : mockAppointments;
    return source.slice(0, 4);
  }, [appointments]);

  const patientList = useMemo(() => (patients.length ? patients : mockPatients).slice(0, 4), [patients]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Doctor Portal</p>
          <h2 className="text-3xl font-semibold">Doctor Dashboard</h2>
        </div>
        <Link to="/profile" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
          Manage Profile
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Today’s Appointments" value={todayAppointments.length} change="Prepared for review" icon="🗓️" tone="blue" />
        <MetricCard title="Upcoming Visits" value={upcomingAppointments.length} change="Next in queue" icon="⏰" tone="green" />
        <MetricCard title="Active Patients" value={patientList.length} change="Tracked this week" icon="🧑‍⚕️" tone="amber" />
        <MetricCard title="Pending Reports" value={labs.length || 3} change="Lab updates waiting" icon="🧪" tone="purple" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Today’s Appointments" subtitle="Appointments scheduled for today">
          {appointmentsLoading ? <div className="space-y-3">{[...Array(3)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : appointmentsError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{appointmentsError}</div> : (
            <div className="space-y-3">
              {todayAppointments.map((item) => (
                <div key={item.id || item._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div>
<p className="font-medium">
  {item.patient?.fullName || "Unknown Patient"}
</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.time || item.date} • {item.type || 'Consultation'}</p>
                  </div>
                  <StatusBadge status={item.status || 'Scheduled'} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Upcoming Appointments" subtitle="Next planned visits">
          {appointmentsLoading ? <div className="space-y-3">{[...Array(3)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : appointmentsError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{appointmentsError}</div> : (
            <div className="space-y-3">
              {upcomingAppointments.map((item) => (
                <div key={item.id || item._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div>
<p className="font-medium">
{item.patient?.fullName || item.patient?.name || "Unknown Patient"}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.appointmentTime || item.time} • {item.type || 'Consultation'}</p>
                  </div>
                  <StatusBadge status={item.status || 'Scheduled'} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Patient List" subtitle="Recent patient records">
          {patientsLoading ? <div className="space-y-3">{[...Array(3)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : patientsError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">{patientsError}</div> : (
            <div className="space-y-3">
              {patientList.map((patient) => (
                <div key={patient.id || patient._id} className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
  {patient.fullName || patient.name || "—"}
</p>
                    <StatusBadge status={patient.status || 'Stable'} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{patient.condition || '—'}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Create Prescription" subtitle="Document medication recommendations">
          <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
            <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
              <p className="font-medium">Patient</p>
              <p className="text-slate-500 dark:text-slate-400">Select a patient from the list to draft a prescription.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
              <p className="font-medium">Medication Notes</p>
              <p className="text-slate-500 dark:text-slate-400">Prescription form UI is ready for API integration.</p>
            </div>
            <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Create Prescription</button>
          </div>
        </SectionCard>

        <SectionCard title="Laboratory & Billing" subtitle="Reports and payment status">
          {labsLoading || billsLoading ? <div className="space-y-3">{[...Array(2)].map((_, index) => <SkeletonBlock key={index} className="h-12" />)}</div> : (
            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                <p className="font-medium">Lab Reports</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{labs.length ? `${labs.length} reports available` : 'No lab reports yet'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                <p className="font-medium">Billing</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{bills.length ? `${bills.length} billing entries available` : 'No billing data yet'}</p>
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Doctor Profile" subtitle="Profile management and availability">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Specialty</p>
            <p className="mt-1 font-semibold">Cardiology</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Availability</p>
            <p className="mt-1 font-semibold">Morning Shift</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
