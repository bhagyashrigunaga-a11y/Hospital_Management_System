import React, { useState } from "react";
import { PanelCard } from "../components/Cards";
import { DataTable } from "../components/Tables";
import { useApiData } from "../hooks/useApiData";
import Loader from "../components/Loader";
import AddPrescriptionModal from "../components/AddPrescriptionModal";
import { PrimaryButton } from "../components/Buttons";
import api from "../services/api";

export default function Prescriptions() {

  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const { data = [], loading, error } = useApiData(
    "/prescriptions",
    {
      refreshKey: refresh,
    }
  );

  const filteredData = data.filter((prescription) =>
    prescription.patient?.fullName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Prescriptions
        </h2>

        <PrimaryButton
          onClick={() => {
            setSelectedPrescription(null);
            setIsOpen(true);
          }}
        >
          Add Prescription
        </PrimaryButton>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <PanelCard title="Total Prescriptions">
          <h2 className="text-3xl font-bold text-blue-600">
            {data.length}
          </h2>
        </PanelCard>

        <PanelCard title="Active">
          <h2 className="text-3xl font-bold text-yellow-500">
            {
              data.filter(
                (p) => p.status === "Active"
              ).length
            }
          </h2>
        </PanelCard>

        <PanelCard title="Completed">
          <h2 className="text-3xl font-bold text-green-600">
            {
              data.filter(
                (p) => p.status === "Completed"
              ).length
            }
          </h2>
        </PanelCard>

      </div>
            {/* Search */}
      <div className="flex justify-between items-center">

        <input
          type="text"
          placeholder="Search Patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 rounded-lg border border-gray-300 px-4 py-2 text-black"
        />

      </div>

      {/* Prescription Table */}
      <PanelCard title="Prescription List">

        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (

          <DataTable
            headers={[
              "Prescription ID",
              "Patient",
              "Doctor",
              "Diagnosis",
              "Medicines",
              "Status",
              "Actions",
            ]}

            rows={filteredData.map((prescription) => [

              prescription.prescriptionId,

              prescription.patient?.fullName || "-",

              prescription.doctor?.fullName || "-",

              prescription.diagnosis,

              prescription.medicines
                ?.map((m) => m.medicineName)
                .join(", "),

              <span
                className={`rounded-full px-3 py-1 text-white text-sm ${
                  prescription.status === "Completed"
                    ? "bg-green-600"
                    : "bg-yellow-500"
                }`}
              >
                {prescription.status}
              </span>,

              <div className="flex gap-2">
                                <button
                  className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                  onClick={() => {
                    setSelectedPrescription(prescription);
                    setIsOpen(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  onClick={async () => {

                    if (
                      !window.confirm(
                        "Delete this prescription?"
                      )
                    )
                      return;

                    try {

                      await api.delete(
                        `/prescriptions/${prescription._id}`
                      );

                      setRefresh(!refresh);

                    } catch (err) {

                      alert("Unable to delete prescription");

                    }

                  }}
                >
                  Delete
                </button>

              </div>,

            ])}

          />

        )}

      </PanelCard>
            <AddPrescriptionModal
        isOpen={isOpen}
        prescription={selectedPrescription}
        onClose={() => {
          setIsOpen(false);
          setSelectedPrescription(null);
        }}
        onSuccess={() => {
          setRefresh(!refresh);
          setIsOpen(false);
          setSelectedPrescription(null);
        }}
      />

    </div>
  );
}