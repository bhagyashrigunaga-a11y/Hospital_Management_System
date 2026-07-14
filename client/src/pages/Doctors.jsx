import React, { useState } from "react";
import api from "../services/api";
import { PanelCard } from "../components/Cards";
import { DataTable } from "../components/Tables";
import { PrimaryButton } from "../components/Buttons";
import { useApiData } from "../hooks/useApiData";
import Loader from "../components/Loader";
import AddDoctorModal from "../components/AddDoctorModal";

export default function Doctors() {
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { data, loading, error } = useApiData("/doctors", {
    refreshKey: refresh,
  });

  async function deleteDoctor(id) {
    if (!window.confirm("Delete this doctor?")) return;

    try {
      await api.delete(`/doctors/${id}`);

      alert("Doctor deleted successfully");

      setRefresh(!refresh);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-blue-500 uppercase text-sm">
            Staff
          </p>

          <h2 className="text-3xl font-bold">
            Doctors
          </h2>

        </div>

        <PrimaryButton onClick={() => setIsOpen(true)}>
          Add Doctor
        </PrimaryButton>

      </div>

      <PanelCard title="Clinical Team">

        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <DataTable
            headers={[
              "Name",
              "Department",
              "Specialization",
              "Status",
              "Actions",
            ]}
            rows={(data || []).map((doctor) => [
              doctor.fullName,
              doctor.department,
              doctor.specialization,
              doctor.status,

              <div key={doctor._id} className="flex gap-2">
  <button
    onClick={() => {
      setSelectedDoctor(doctor);
      setIsOpen(true);
    }}
    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
  >
    Edit
  </button>

  <button
    onClick={() => deleteDoctor(doctor._id)}
    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
  >
    Delete
  </button>
</div>,
            ])}
          />
        )}

      </PanelCard>

      <AddDoctorModal
  isOpen={isOpen}
  doctor={selectedDoctor}
  onClose={() => {
    setIsOpen(false);
    setSelectedDoctor(null);
  }}
  onSuccess={() => {
    setIsOpen(false);
    setSelectedDoctor(null);
    setRefresh(!refresh);
  }}
/>

    </div>
  );
}