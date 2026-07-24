import { useState, useEffect } from "react";
import api from "../services/api";
import { PrimaryButton, SecondaryButton } from "./Buttons";

const initialForm = {
  patient: "",
  doctor: "",
  appointment: "",
  diagnosis: "",
  medicines: [
    {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ],
  notes: "",
  followUpDate: "",
  status: "Active",
};

export default function AddPrescriptionModal({
  isOpen,
  prescription,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(initialForm);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    loadData();
  }, [isOpen]);

  useEffect(() => {
    if (prescription) {
      setForm({
        patient: prescription.patient?._id || "",
        doctor: prescription.doctor?._id || "",
        appointment: prescription.appointment?._id || "",
        diagnosis: prescription.diagnosis || "",
        medicines:
          prescription.medicines?.length > 0
            ? prescription.medicines
            : initialForm.medicines,
        notes: prescription.notes || "",
        followUpDate: prescription.followUpDate
          ? prescription.followUpDate.substring(0, 10)
          : "",
        status: prescription.status || "Active",
      });
    } else {
      setForm(initialForm);
    }
  }, [prescription]);
    async function loadData() {
    try {
      const patientRes = await api.get("/patients");
      const doctorRes = await api.get("/doctors");
      const appointmentRes = await api.get("/appointments");

      setPatients(patientRes.data.data || []);
      setDoctors(doctorRes.data.data || []);
      setAppointments(appointmentRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleMedicineChange(index, field, value) {
    const updatedMedicines = [...form.medicines];

    updatedMedicines[index][field] = value;

    setForm({
      ...form,
      medicines: updatedMedicines,
    });
  }

  function addMedicine() {
    setForm({
      ...form,
      medicines: [
        ...form.medicines,
        {
          medicineName: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    });
  }

  function removeMedicine(index) {
    const updatedMedicines = [...form.medicines];

    updatedMedicines.splice(index, 1);

    setForm({
      ...form,
      medicines: updatedMedicines,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (prescription) {
        await api.put(
          `/prescriptions/${prescription._id}`,
          form
        );

        alert("Prescription updated successfully");
      } else {
        await api.post("/prescriptions", form);

        alert("Prescription created successfully");
      }

      setForm(initialForm);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save prescription"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;
    return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-6">
      <div className="mx-auto my-10 w-full max-w-6xl rounded-2xl border border-slate-700 bg-slate-900 p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto">

        <h2 className="mb-6 text-3xl font-bold">
          {prescription ? "Edit Prescription" : "Add Prescription"}
        </h2>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500 bg-red-900/30 p-3">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-5"
        >

          {/* Patient */}
          <select
            name="patient"
            value={form.patient}
            onChange={handleChange}
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
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

          {/* Doctor */}
          <select
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
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

          {/* Appointment */}
          <select
            name="appointment"
            value={form.appointment}
            onChange={handleChange}
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
            required
          >
            <option value="">
              Select Appointment
            </option>

            {appointments.map((appointment) => (
              <option
                key={appointment._id}
                value={appointment._id}
              >
                {appointment.appointmentId}
              </option>
            ))}
          </select>

          {/* Diagnosis */}
          <input
            type="text"
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            placeholder="Diagnosis"
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
            required
          />
                    {/* Medicines */}
          <div className="col-span-2">

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Medicines
              </h3>

              <button
                type="button"
                onClick={addMedicine}
                className="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
              >
                + Add Medicine
              </button>
            </div>

            {form.medicines.map((medicine, index) => (

              <div
                key={index}
                className="mb-5 rounded-lg border border-slate-700 p-4"
              >

                <div className="grid grid-cols-2 gap-4">

                  <input
                    type="text"
                    placeholder="Medicine Name"
                    value={medicine.medicineName}
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        "medicineName",
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-slate-600 bg-slate-800 p-3"
                  />

                  <input
                    type="text"
                    placeholder="Dosage"
                    value={medicine.dosage}
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        "dosage",
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-slate-600 bg-slate-800 p-3"
                  />

                  <input
                    type="text"
                    placeholder="Frequency"
                    value={medicine.frequency}
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        "frequency",
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-slate-600 bg-slate-800 p-3"
                  />

                  <input
                    type="text"
                    placeholder="Duration"
                    value={medicine.duration}
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        "duration",
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-slate-600 bg-slate-800 p-3"
                  />

                </div>

                <textarea
                  rows="2"
                  placeholder="Instructions"
                  value={medicine.instructions}
                  onChange={(e) =>
                    handleMedicineChange(
                      index,
                      "instructions",
                      e.target.value
                    )
                  }
                  className="mt-4 w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
                />

                {form.medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="mt-3 rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                  >
                    Remove Medicine
                  </button>
                )}

              </div>

            ))}

          </div>

          {/* Notes */}
          <textarea
            name="notes"
            rows="4"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="col-span-2 rounded-lg border border-slate-600 bg-slate-800 p-3"
          />

          {/* Follow Up Date */}
          <input
            type="date"
            name="followUpDate"
            value={form.followUpDate}
            onChange={handleChange}
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
          />

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
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
                : prescription
                ? "Update Prescription"
                : "Create Prescription"}
            </PrimaryButton>

          </div>

        </form>

      </div>

    </div>
  );
} 