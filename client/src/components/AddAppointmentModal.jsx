import { useState, useEffect } from "react";
import api from "../services/api";
import { PrimaryButton, SecondaryButton } from "./Buttons";

const initialForm = {
  patient: "",
  doctor: "",
  department: "",
  appointmentDate: "",
  appointmentTime: "",
  appointmentType: "Offline",
  reason: "",
  status: "Pending",
  notes: "",
};

export default function AddAppointmentModal({
  isOpen,
  appointment,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(initialForm);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    loadData();
  }, [isOpen]);

  useEffect(() => {
    if (appointment) {
      setForm({
        patient: appointment.patient?._id || "",
        doctor: appointment.doctor?._id || "",
        department: appointment.department || "",
        appointmentDate: appointment.appointmentDate
          ? appointment.appointmentDate.substring(0, 10)
          : "",
        appointmentTime: appointment.appointmentTime || "",
        appointmentType: appointment.appointmentType || "Offline",
        reason: appointment.reason || "",
        status: appointment.status || "Pending",
        notes: appointment.notes || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [appointment]);

  async function loadData() {
    try {
      const patientRes = await api.get("/patients");
      const doctorRes = await api.get("/doctors");

      setPatients(patientRes.data.data || []);
      setDoctors(doctorRes.data.data || []);
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
    async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (appointment) {
        await api.put(
          `/appointments/${appointment._id}`,
          form
        );

        alert("Appointment updated successfully");
      } else {
        await api.post(
          "/appointments",
          form
        );

        alert("Appointment created successfully");
      }

      setForm(initialForm);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save appointment"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-6">

      <div className="mx-auto my-10 w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto">

        <h2 className="mb-6 text-3xl font-bold">
          {appointment
            ? "Edit Appointment"
            : "Schedule Appointment"}
        </h2>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500 bg-red-900/30 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-5"
        >
                      <select
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            name="patient"
            value={form.patient}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>

            {patients.map((patient) => (
              <option
                key={patient._id}
                value={patient._id}
              >
                {patient.fullName}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>

            {doctors.map((doctor) => (
              <option
                key={doctor._id}
                value={doctor._id}
              >
                {doctor.fullName}
              </option>
            ))}
          </select>

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            type="date"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            type="time"
            name="appointmentTime"
            value={form.appointmentTime}
            onChange={handleChange}
            required
          />

          <select
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            name="appointmentType"
            value={form.appointmentType}
            onChange={handleChange}
          >
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
          </select>

          <input
            className="col-span-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
          />

          <textarea
            className="col-span-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            rows="4"
            placeholder="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />

          <select
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div></div>

          <div className="col-span-2 mt-6 flex justify-end gap-4">

            <SecondaryButton
              type="button"
              onClick={() => {
                setForm(initialForm);
                setError("");
                onClose();
              }}
            >
              Cancel
            </SecondaryButton>

            <PrimaryButton
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : appointment
                ? "Update Appointment"
                : "Schedule Appointment"}
            </PrimaryButton>

          </div>

        </form>

      </div>

    </div>
  );
}
