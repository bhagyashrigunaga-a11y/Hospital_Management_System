import React, { useState } from "react";
import { PanelCard } from '../components/Cards';
import { DataTable } from '../components/Tables';
import { PrimaryButton } from '../components/Buttons';
import { useApiData } from '../hooks/useApiData';
import Loader from '../components/Loader';
import AddAppointmentModal from "../components/AddAppointmentModal";
import api from "../services/api";

export default function Appointments() {
  const [refresh, setRefresh] = useState(false);
const [isOpen, setIsOpen] = useState(false);
const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { data, loading, error } = useApiData("/appointments", {
  refreshKey: refresh,
});
console.log("Appointments:", data);
console.log("Loading:", loading);
console.log("Error:", error);

console.log("Appointments Data:", data);
console.log(data);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Scheduling</p>
          <h2 className="text-2xl font-semibold">Appointments</h2>
        </div>
        <PrimaryButton onClick={() => setIsOpen(true)}>
  Schedule
</PrimaryButton>
      </div>
      <PanelCard title="Today’s Schedule">
        {loading ? <Loader /> : error ? <p className="text-sm text-rose-600">{error}</p> : 
<DataTable
headers={[
  "Appointment ID",
  "Patient",
  "Doctor",
  "Department",
  "Date",
  "Time",
  "Type",
  "Status",
  "Actions",
]}
rows={(data || []).map((appointment) => [
  appointment.appointmentId,
  appointment.patient?.fullName,
  appointment.doctor?.fullName,
  appointment.department,
  new Date(appointment.appointmentDate).toLocaleDateString(),
  appointment.appointmentTime,
  appointment.appointmentType,
  appointment.status,

  <div className="flex gap-2">
    <button
      className="rounded bg-blue-600 px-3 py-1 text-white"
      onClick={() => {
        setSelectedAppointment(appointment);
        setIsOpen(true);
      }}
    >
      Edit
    </button>

    <button
      className="rounded bg-red-600 px-3 py-1 text-white"
      onClick={async () => {
        if (!window.confirm("Delete this appointment?")) return;

try {
  const res = await api.delete(`/appointments/${appointment._id}`);

  console.log("Delete Success:", res.data);

  setRefresh(!refresh);
} catch (err) {
  console.log("Delete Error:", err.response?.data);
  alert(err.response?.data?.message || "Delete failed");
}
        setRefresh(!refresh);
      }}
    >
      Delete
    </button>
  </div>,
])}
/>
}
      </PanelCard>
      <AddAppointmentModal
  isOpen={isOpen}
  appointment={selectedAppointment}
  onClose={() => {
    setIsOpen(false);
    setSelectedAppointment(null);
  }}
  onSuccess={() => {
    setRefresh(!refresh);
    setIsOpen(false);
    setSelectedAppointment(null);
  }}
/>
    </div>
  );
}
