import { useState, useEffect } from "react";
import api from "../services/api";
import { PrimaryButton, SecondaryButton } from "./Buttons";

const initialForm = {
  patient: "",
  appointment: "",
  doctor: "",
  consultationFee: 0,
  medicineCharges: 0,
  laboratoryCharges: 0,
  roomCharges: 0,
  miscellaneousCharges: 0,
  discount: 0,
  paymentMethod: "Cash",
  paymentStatus: "Pending",
  remarks: "",
};

export default function AddBillModal({
  isOpen,
  bill,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState(initialForm);

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    loadData();
  }, [isOpen]);

  useEffect(() => {
    if (bill) {
      setForm({
        patient: bill.patient?._id || "",
        appointment: bill.appointment?._id || "",
        doctor: bill.doctor?._id || "",
        consultationFee: bill.consultationFee || 0,
        medicineCharges: bill.medicineCharges || 0,
        laboratoryCharges: bill.laboratoryCharges || 0,
        roomCharges: bill.roomCharges || 0,
        miscellaneousCharges: bill.miscellaneousCharges || 0,
        discount: bill.discount || 0,
        paymentMethod: bill.paymentMethod || "Cash",
        paymentStatus: bill.paymentStatus || "Pending",
        remarks: bill.remarks || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [bill]);

  async function loadData() {
    try {
      const patientRes = await api.get("/patients");
      const appointmentRes = await api.get("/appointments");
      const doctorRes = await api.get("/doctors");

      setPatients(patientRes.data.data || []);
      setAppointments(appointmentRes.data.data || []);
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

      if (bill) {
        await api.put(`/bills/${bill._id}`, form);
        alert("Bill updated successfully");
      } else {
        await api.post("/bills", form);
        alert("Bill created successfully");
      }

      setForm(initialForm);

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save bill"
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
          {bill ? "Edit Bill" : "Add Bill"}
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
                      <select
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
            name="patient"
            value={form.patient}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.fullName}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
            name="appointment"
            value={form.appointment}
            onChange={handleChange}
            required
          >
            <option value="">Select Appointment</option>
            {appointments.map((appointment) => (
              <option key={appointment._id} value={appointment._id}>
                {appointment.appointmentId}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.fullName}
              </option>
            ))}
          </select>

         <div>
  <label className="mb-2 block text-sm font-medium">
    Consultation Fee
  </label>

  <input
    className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
    type="number"
    name="consultationFee"
    placeholder="Enter consultation fee"
    value={form.consultationFee || ""}
    onChange={handleChange}
  />
</div>

         <div>
  <label className="mb-2 block text-sm font-medium">
    Medicine Charges
  </label>

  <input
    className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
    type="number"
    name="medicineCharges"
    placeholder="Enter medicine charges"
    value={form.medicineCharges || ""}
    onChange={handleChange}
  />
</div>

         <div>
  <label className="mb-2 block text-sm font-medium">
    Laboratory Charges
  </label>

  <input
    className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
    type="number"
    name="laboratoryCharges"
    placeholder="Enter laboratory charges"
    value={form.laboratoryCharges || ""}
    onChange={handleChange}
  />
</div>

         <div>
  <label className="mb-2 block text-sm font-medium">
    Room Charges
  </label>

  <input
    className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
    type="number"
    name="roomCharges"
    placeholder="Enter room charges"
    value={form.roomCharges || ""}
    onChange={handleChange}
  />
</div>
          <div>
  <label className="mb-2 block text-sm font-medium">
    Miscellaneous Charges
  </label>

  <input
    className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
    type="number"
    name="miscellaneousCharges"
    placeholder="Enter miscellaneous charges"
    value={form.miscellaneousCharges || ""}
    onChange={handleChange}
  />
</div>

         <div>
  <label className="mb-2 block text-sm font-medium">
    Discount
  </label>

  <input
    className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
    type="number"
    name="discount"
    placeholder="Enter discount"
    value={form.discount || ""}
    onChange={handleChange}
  />
</div>
                <select
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Insurance">Insurance</option>
          </select>

          <select
            className="rounded-lg border border-slate-600 bg-slate-800 p-3"
            name="paymentStatus"
            value={form.paymentStatus}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </select>

          <textarea
            className="col-span-2 rounded-lg border border-slate-600 bg-slate-800 p-3"
            rows="4"
            name="remarks"
            placeholder="Remarks"
            value={form.remarks}
            onChange={handleChange}
          />

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
                : bill
                ? "Update Bill"
                : "Create Bill"}
            </PrimaryButton>

          </div>

        </form>

      </div>

    </div>
  );
}
