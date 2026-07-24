import mongoose from 'mongoose';
import Bill from '../models/bill.model.js';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import ApiError from '../utils/apiError.js';

function buildBillFilter(query = {}) {
  const filter = {};

  if (query.patient) {
    filter.patient = query.patient;
  }

  if (query.doctor) {
    filter.doctor = query.doctor;
  }

  if (query.appointment) {
    filter.appointment = query.appointment;
  }

  if (query.paymentStatus) {
    filter.paymentStatus = query.paymentStatus;
  }

  if (query.paymentMethod) {
    filter.paymentMethod = query.paymentMethod;
  }

  return filter;
}

function normalizeBillInput(data) {
  const normalized = { ...data };

  const numericFields = [
    'consultationFee',
    'medicineCharges',
    'laboratoryCharges',
    'roomCharges',
    'miscellaneousCharges',
    'discount'
  ];

  numericFields.forEach((field) => {
    if (normalized[field] !== undefined) {
      normalized[field] = Number(normalized[field]);
    }
  });

  if (data.paymentDate !== undefined) {
    normalized.paymentDate = data.paymentDate ? new Date(data.paymentDate) : null;
  }

  return normalized;
}

async function resolveVisiblePatient(user) {
  if (!user || user.role !== 'Patient') return null;
  return Patient.findOne({ email: user.email });
}

async function resolveVisibleDoctor(user) {
  if (!user || user.role !== 'Doctor') return null;
  return Doctor.findOne({ email: user.email });
}

async function validateReferences(patientId, appointmentId, doctorId) {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  if (appointment.patient.toString() !== patientId.toString()) {
    throw new ApiError(400, 'Appointment does not belong to the selected patient');
  }

  if (appointment.doctor.toString() !== doctorId.toString()) {
    throw new ApiError(400, 'Appointment does not belong to the selected doctor');
  }

  return { patient, appointment, doctor };
}

export async function getBills(query = {}, user = null) {
  const filter = buildBillFilter(query);

  if (user?.role === 'Patient') {
    const patient = await resolveVisiblePatient(user);
    if (!patient) {
      return [];
    }
    filter.patient = patient._id;
  }

  // if (user?.role === 'Doctor') {
  //   const doctor = await resolveVisibleDoctor(user);
  //   if (!doctor) {
  //     return [];
  //   }
  //   filter.doctor = doctor._id;
  // }

  console.log("User:", user);
console.log("Filter:", filter);

const bills = await Bill.find(filter)
  .populate("patient", "patientId fullName email")
  .populate("appointment", "appointmentId appointmentDate appointmentTime status")
  .populate("doctor", "fullName email department")
  .populate("createdBy", "name email role")
  .sort({ createdAt: -1 });

console.log("Bills Found:", bills);

return bills;
}

export async function getBillById(id, user = null) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid bill id');
  }

  const filter = {};

  if (user?.role === 'Patient') {
    const patient = await resolveVisiblePatient(user);
    if (!patient) {
      throw new ApiError(404, 'Bill not found');
    }
    filter.patient = patient._id;
  }

  if (user?.role === 'Doctor') {
    const doctor = await resolveVisibleDoctor(user);
    if (!doctor) {
      throw new ApiError(404, 'Bill not found');
    }
    filter.doctor = doctor._id;
  }

  const bill = await Bill.findOne({ _id: id, ...filter })
    .populate('patient', 'patientId fullName email')
    .populate('appointment', 'appointmentId appointmentDate appointmentTime status')
    .populate('doctor', 'fullName email department')
    .populate('createdBy', 'name email role');

  if (!bill) {
    throw new ApiError(404, 'Bill not found');
  }

  return bill;
}

export async function createBill(data, user) {
if (!user || !['Admin', 'Receptionist', 'Doctor'].includes(user.role)) {
  throw new ApiError(403, 'You do not have permission to create bills');
}

  const normalizedData = normalizeBillInput(data);

  if (!normalizedData.patient || !mongoose.Types.ObjectId.isValid(normalizedData.patient)) {
    throw new ApiError(400, 'Valid patient id is required');
  }

  if (!normalizedData.appointment || !mongoose.Types.ObjectId.isValid(normalizedData.appointment)) {
    throw new ApiError(400, 'Valid appointment id is required');
  }

  if (!normalizedData.doctor || !mongoose.Types.ObjectId.isValid(normalizedData.doctor)) {
    throw new ApiError(400, 'Valid doctor id is required');
  }

  await validateReferences(normalizedData.patient, normalizedData.appointment, normalizedData.doctor);

  if (normalizedData.paymentStatus === 'Paid' && !normalizedData.paymentDate) {
    normalizedData.paymentDate = new Date();
  }

  return Bill.create({
    ...normalizedData,
    createdBy: user._id
  });
}

export async function updateBill(id, data, user) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid bill id');
  }

  if (!user || !['Admin', 'Receptionist', 'Doctor'].includes(user.role)) {
    throw new ApiError(403, 'You do not have permission to update bills');
  }

  const bill = await Bill.findById(id);
  if (!bill) {
    throw new ApiError(404, 'Bill not found');
  }

  const normalizedData = normalizeBillInput(data);

  if (normalizedData.patient && !mongoose.Types.ObjectId.isValid(normalizedData.patient)) {
    throw new ApiError(400, 'Valid patient id is required');
  }

  if (normalizedData.appointment && !mongoose.Types.ObjectId.isValid(normalizedData.appointment)) {
    throw new ApiError(400, 'Valid appointment id is required');
  }

  if (normalizedData.doctor && !mongoose.Types.ObjectId.isValid(normalizedData.doctor)) {
    throw new ApiError(400, 'Valid doctor id is required');
  }

  const targetPatient = normalizedData.patient || bill.patient;
  const targetAppointment = normalizedData.appointment || bill.appointment;
  const targetDoctor = normalizedData.doctor || bill.doctor;

  if (normalizedData.patient || normalizedData.appointment || normalizedData.doctor) {
    await validateReferences(targetPatient, targetAppointment, targetDoctor);
  }

  if (normalizedData.paymentStatus === 'Paid' && !normalizedData.paymentDate && !bill.paymentDate) {
    normalizedData.paymentDate = new Date();
  }

  const updatedBill = await Bill.findByIdAndUpdate(id, normalizedData, {
    new: true,
    runValidators: true
  })
    .populate('patient', 'patientId fullName email')
    .populate('appointment', 'appointmentId appointmentDate appointmentTime status')
    .populate('doctor', 'fullName email department')
    .populate('createdBy', 'name email role');

  if (!updatedBill) {
    throw new ApiError(404, 'Bill not found');
  }

  return updatedBill;
}

export async function deleteBill(id, user) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid bill id');
  }

  if (!user || !['Admin', 'Receptionist', 'Doctor'].includes(user.role)) {
    throw new ApiError(403, 'You do not have permission to delete bills');
  }

  const bill = await Bill.findByIdAndDelete(id);
  if (!bill) {
    throw new ApiError(404, 'Bill not found');
  }

  return bill;
}
