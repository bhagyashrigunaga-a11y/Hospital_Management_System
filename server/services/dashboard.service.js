import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import Bill from "../models/bill.model.js";

export async function getDashboard() {
  const totalDoctors = await Doctor.countDocuments();
  const totalPatients = await Patient.countDocuments();
  const totalAppointments = await Appointment.countDocuments();
  const totalBills = await Bill.countDocuments();

  const recentAppointments = await Appointment.find()
    .populate("patient", "fullName")
    .populate("doctor", "fullName")
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    totalDoctors,
    totalPatients,
    totalAppointments,
    totalBills,
    recentAppointments,
  };
}