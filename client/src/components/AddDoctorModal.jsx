import { useState, useEffect } from "react";
import api from "../services/api";
import { PrimaryButton, SecondaryButton } from "./Buttons";

const initialForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  department: "",
  specialization: "",
  qualification: "",
  experience: "",
  consultationFee: "",
  availableDays: "",
  availableTime: "",
  status: "Active",
};

export default function AddDoctorModal({
  isOpen,
  doctor,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  if (doctor) {
    setForm({
      fullName: doctor.fullName || "",
      email: doctor.email || "",
      phoneNumber: doctor.phoneNumber || "",
      department: doctor.department || "",
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience || "",
      consultationFee: doctor.consultationFee || "",
      availableDays: (doctor.availableDays || []).join(","),
      availableTime: (doctor.availableTime || []).join(","),
      status: doctor.status || "Active",
    });
  } else {
    setForm(initialForm);
  }
}, [doctor]);

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

      const doctorData = {
  ...form,
  availableDays: form.availableDays
    ? form.availableDays.split(",").map(day => day.trim())
    : [],

  availableTime: form.availableTime
    ? form.availableTime.split(",").map(time => time.trim())
    : [],
};

if (doctor) {
  await api.put(`/doctors/${doctor._id}`, doctorData);
  alert("Doctor updated successfully");
} else {
  await api.post("/doctors", doctorData);
  alert("Doctor added successfully");
}

      setForm(initialForm);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create doctor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 p-8 text-white shadow-2xl">

<h2 className="mb-6 text-3xl font-bold">
  {doctor ? "Edit Doctor" : "Add Doctor"}
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
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Department"
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Specialization"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            required
          />
                    <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Qualification"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Experience (Years)"
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Consultation Fee"
            type="number"
            name="consultationFee"
            value={form.consultationFee}
            onChange={handleChange}
            required
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Available Days (Mon,Tue,Wed)"
            name="availableDays"
            value={form.availableDays}
            onChange={handleChange}
          />

          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Available Time (10AM-2PM)"
            name="availableTime"
            value={form.availableTime}
            onChange={handleChange}
          />

          <select
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white focus:border-blue-500 focus:outline-none"
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
  : doctor
  ? "Update Doctor"
  : "Add Doctor"}
            </PrimaryButton>

          </div>

        </form>

      </div>

    </div>
  );
}