import { useState, useEffect } from "react";
import api from "../services/api";
import { PrimaryButton, SecondaryButton } from "./Buttons";

const initialForm = {
  fullName: "",
  age: "",
  gender: "Male",
  dateOfBirth: "",
  bloodGroup: "",
  phoneNumber: "",
  email: "",
  address: "",
  emergencyContact: "",
  medicalHistory: "",
  allergies: "",
  currentMedications: "",
  assignedDoctor: "",
  status: "Active",
};

export default function AddPatientModal({
  isOpen,
  patient,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(
    patient
      ? {
          ...patient,
          medicalHistory: patient.medicalHistory?.join(", ") || "",
          allergies: patient.allergies?.join(", ") || "",
          currentMedications:
            patient.currentMedications?.join(", ") || "",
        }
      : initialForm
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
  if (patient) {
    setForm({
      fullName: patient.fullName || "",
      age: patient.age || "",
      gender: patient.gender || "Male",
      dateOfBirth: patient.dateOfBirth
        ? patient.dateOfBirth.substring(0, 10)
        : "",
      bloodGroup: patient.bloodGroup || "",
      phoneNumber: patient.phoneNumber || "",
      email: patient.email || "",
      emergencyContact: patient.emergencyContact || "",
      address: patient.address || "",
      medicalHistory: (patient.medicalHistory || []).join(","),
      allergies: (patient.allergies || []).join(","),
      currentMedications: (patient.currentMedications || []).join(","),
      assignedDoctor: patient.assignedDoctor?._id || "",
      status: patient.status || "Active",
    });
  } else {
    setForm(initialForm);
  }
}, [patient]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const patientData = {
        ...form,

        age: Number(form.age),

        medicalHistory: form.medicalHistory
          ? form.medicalHistory
              .split(",")
              .map((item) => item.trim())
          : [],

        allergies: form.allergies
          ? form.allergies
              .split(",")
              .map((item) => item.trim())
          : [],

        currentMedications: form.currentMedications
          ? form.currentMedications
              .split(",")
              .map((item) => item.trim())
          : [],
      };
      if (patientData.assignedDoctor === "") {
  delete patientData.assignedDoctor;
}

      if (patient) {
        await api.put(
          `/patients/${patient._id}`,
          patientData
        );

        alert("Patient updated successfully");
      } else {
        await api.post(
          "/patients",
          patientData
        );

        alert("Patient added successfully");
      }

      setForm(initialForm);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save patient"
      );
    } finally {
      setLoading(false);
    }
  };
    return (
<div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-6">

<div className="mx-auto my-10 w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="mb-6 text-3xl font-bold">
          {patient ? "Edit Patient" : "Add Patient"}
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

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Age"
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            required
          />

          <select
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">
              Prefer not to say
            </option>
          </select>

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Blood Group"
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Emergency Contact"
            name="emergencyContact"
            value={form.emergencyContact}
            onChange={handleChange}
          />

          <input
            className="col-span-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <input
            className="col-span-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Medical History (Comma separated)"
            name="medicalHistory"
            value={form.medicalHistory}
            onChange={handleChange}
          />

          <input
            className="col-span-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Allergies (Comma separated)"
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
          />

          <input
            className="col-span-2 w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            placeholder="Current Medications (Comma separated)"
            name="currentMedications"
            value={form.currentMedications}
            onChange={handleChange}
          />

          <select
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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
                : patient
                ? "Update Patient"
                : "Add Patient"}
            </PrimaryButton>

          </div>

        </form>

      </div>

    </div>
  );
}