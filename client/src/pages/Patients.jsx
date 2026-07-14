import React, { useState } from "react";
import { PanelCard } from "../components/Cards";
import { DataTable } from "../components/Tables";
import { PrimaryButton } from "../components/Buttons";
import { useApiData } from "../hooks/useApiData";
import Loader from "../components/Loader";
import AddPatientModal from "../components/AddPatientModal";
import api from "../services/api";

export default function Patients() {
  const [refresh, setRefresh] = useState(false);
const [isOpen, setIsOpen] = useState(false);
const [selectedPatient, setSelectedPatient] = useState(null);
  const { data, loading, error } = useApiData("/patients", {
    refreshKey: refresh,
  });
async function deletePatient(id) {
  if (!window.confirm("Delete this patient?")) return;

  try {
    await api.delete(`/patients/${id}`);

    alert("Patient deleted successfully");

    setRefresh(!refresh);
  } catch (err) {
    alert(err.response?.data?.message || "Delete failed");
  }
}
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-blue-600 text-sm uppercase">
            Records
          </p>

          <h2 className="text-3xl font-bold">
            Patients
          </h2>
        </div>

      <PrimaryButton onClick={() => setIsOpen(true)}>
  Add Patient
</PrimaryButton>

      </div>

      <PanelCard title="Patient Directory">

        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <DataTable
            headers={[
  "Patient ID",
  "Name",
  "Age",
  "Gender",
  "Phone",
  "Status",
  "Actions",
]}
           rows={(data || []).map((patient) => [
  patient.patientId,
  patient.fullName,
  patient.age,
  patient.gender,
  patient.phoneNumber,
  patient.status,

  <div className="flex gap-2" key={patient._id}>
    <button
      onClick={() => {
        setSelectedPatient(patient);
        setIsOpen(true);
      }}
      className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
    >
      Edit
    </button>

    <button
      onClick={() => deletePatient(patient._id)}
      className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
    >
      Delete
    </button>
  </div>,
])}
          />
        )}

      </PanelCard>
      <AddPatientModal
  isOpen={isOpen}
  patient={selectedPatient}
  onClose={() => {
    setIsOpen(false);
    setSelectedPatient(null);
  }}
  onSuccess={() => {
    setRefresh(!refresh);
    setIsOpen(false);
    setSelectedPatient(null);
  }}
/>

    </div>
  );
}