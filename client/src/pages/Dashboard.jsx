import React from 'react';
import { StatCard, PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { useApiData } from "../hooks/useApiData";

export default function Dashboard() {
  const { data, loading, error } = useApiData("/dashboard");
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
  title="Doctors"
  value={loading ? "..." : data?.totalDoctors || 0}
  detail="Total Doctors"
  tone="blue"
/>

<StatCard
  title="Patients"
  value={loading ? "..." : data?.totalPatients || 0}
  detail="Total Patients"
  tone="green"
/>

<StatCard
  title="Appointments"
  value={loading ? "..." : data?.totalAppointments || 0}
  detail="Total Appointments"
  tone="amber"
/>

<StatCard
  title="Bills"
  value={loading ? "..." : data?.totalBills || 0}
  detail="Total Bills"
  tone="rose"
/>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PanelCard title="Care Operations Snapshot" action={<span className="text-sm text-slate-500">Live preview</span>}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Emergency</p>
              <p className="mt-2 text-2xl font-semibold">4</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">ICU</p>
              <p className="mt-2 text-2xl font-semibold">6</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Discharges</p>
              <p className="mt-2 text-2xl font-semibold">9</p>
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Upcoming Schedule" action={<span className="text-sm text-blue-600">Today</span>}>
          <ul className="space-y-3 text-sm text-slate-300">
  {(data?.recentAppointments || []).map((appointment) => (
    <li
      key={appointment._id}
      className="rounded-xl border border-slate-700 p-3"
    >
      {appointment.appointmentTime} —{" "}
      {appointment.doctor?.fullName} with{" "}
      {appointment.patient?.fullName}
    </li>
  ))}
</ul>
        </PanelCard>
      </div>

      <PanelCard title="Recent Appointments">
     <DataTable
  headers={["Patient", "Doctor", "Time", "Status"]}
  rows={(data?.recentAppointments || []).map((appointment) => [
    appointment.patient?.fullName || "-",
    appointment.doctor?.fullName || "-",
    appointment.appointmentTime,
    appointment.status,
  ])}
/>
      </PanelCard>
    </div>
  );
}
