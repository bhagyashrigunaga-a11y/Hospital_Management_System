import React, { useState } from "react";
import { PanelCard } from "../components/Cards";
import { DataTable } from "../components/Tables";
import { PrimaryButton } from "../components/Buttons";
import { useApiData } from "../hooks/useApiData";
import Loader from "../components/Loader";
import AddBillModal from "../components/AddBillModal";
import api from "../services/api";

export default function Billing() {
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data = [], loading, error } = useApiData("/bills", {
    refreshKey: refresh,
  });

  const filteredBills = data.filter((bill) => {
    const patientName = bill.patient?.fullName?.toLowerCase() || "";

    const matchesSearch = patientName.includes(
      search.toLowerCase()
    );

    const matchesStatus =
      statusFilter === "All" ||
      bill.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
        <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h2 className="text-3xl font-bold">
            Billing Management
          </h2>

          <p className="text-gray-500">
            Manage hospital bills and payments
          </p>
        </div>

        <PrimaryButton onClick={() => setIsOpen(true)}>
          + Add Bill
        </PrimaryButton>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <PanelCard title="Total Bills">
          <h2 className="text-3xl font-bold text-blue-600">
            {data.length}
          </h2>
        </PanelCard>

        <PanelCard title="Total Revenue">
          <h2 className="text-3xl font-bold text-green-600">
            ₹
            {data.reduce(
              (sum, bill) => sum + Number(bill.totalAmount || 0),
              0
            )}
          </h2>
        </PanelCard>

        <PanelCard title="Pending Bills">
          <h2 className="text-3xl font-bold text-red-600">
            {
              data.filter(
                (bill) => bill.paymentStatus === "Pending"
              ).length
            }
          </h2>
        </PanelCard>

      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow md:flex-row md:items-center md:justify-between">

        <input
          type="text"
          placeholder="Search Patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black md:w-80"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-black md:w-56"
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

      </div>

      <PanelCard title="Bills">        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-center text-red-500">
            {error}
          </p>
        ) : filteredBills.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            No bills found.
          </div>
        ) : (
          <DataTable
            headers={[
              "Invoice",
              "Patient",
              "Doctor",
              "Amount",
              "Status",
              "Actions",
            ]}
            rows={filteredBills.map((bill) => [
              bill.invoiceNumber || "-",

              bill.patient?.fullName || "-",

              bill.doctor?.fullName || "-",

              `₹${Number(bill.totalAmount || 0).toFixed(2)}`,

              <span
                className={`rounded-full px-3 py-1 text-sm font-medium text-white ${
                  bill.paymentStatus === "Paid"
                    ? "bg-green-600"
                    : bill.paymentStatus === "Pending"
                    ? "bg-yellow-500"
                    : "bg-red-600"
                }`}
              >
                {bill.paymentStatus}
              </span>,

              <div className="flex gap-2">

                <button
                  className="rounded-lg bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                  onClick={() => {
                    setSelectedBill(bill);
                    setIsOpen(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="rounded-lg bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  onClick={async () => {
                    if (!window.confirm("Delete this bill?")) return;

                    try {
                      await api.delete(`/bills/${bill._id}`);

                      setRefresh(!refresh);
                    } catch (err) {
                      alert(
                        err.response?.data?.message ||
                          "Unable to delete bill"
                      );
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
            {/* Add / Edit Bill Modal */}
      <AddBillModal
        isOpen={isOpen}
        bill={selectedBill}
        onClose={() => {
          setIsOpen(false);
          setSelectedBill(null);
        }}
        onSuccess={() => {
          setRefresh(!refresh);
          setIsOpen(false);
          setSelectedBill(null);
        }}
      />

    </div>
  );
}