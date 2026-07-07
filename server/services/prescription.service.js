import mongoose from 'mongoose';
import Prescription from '../models/prescription.model.js';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import ApiError from '../utils/apiError.js';

function buildPrescriptionFilter(query = {}) {
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

  if (query.status) {
    filter.status = query.status;
  }

  return filter;
}

async function resolveVisiblePatient(user) {
  if (!user || user.role !== 'Patient') return null;
  return Patient.findOne({ email: user.email });
}

async function resolveVisibleDoctor(user) {
  if (!user || user.role !== 'Doctor') return null;
  return Doctor.findOne({ email: user.email });
}

async function validateReferences(patientId, doctorId, appointmentId) {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  if (appointment.patient.toString() !== patientId.toString()) {
    throw new ApiError(400, 'Appointment does not belong to the selected patient');
  }

  if (appointment.doctor.toString() !== doctorId.toString()) {
    throw new ApiError(400, 'Appointment does not belong to the selected doctor');
  }

  return { patient, doctor, appointment };
}

export async function getPrescriptions(query = {}, user = null) {
  const filter = buildPrescriptionFilter(query);

  if (user?.role === 'Patient') {
    const patient = await resolveVisiblePatient(user);
    if (!patient) {
      return [];
    }
    filter.patient = patient._id;
  }

  if (user?.role === 'Doctor') {
    const doctor = await resolveVisibleDoctor(user);
    if (!doctor) {
      return [];
    }
    filter.doctor = doctor._id;
  }

  return Prescription.find(filter)
    .populate('patient', 'patientId fullName email')
    .populate('doctor', 'fullName email department')
    .populate('appointment', 'appointmentId appointmentDate appointmentTime status')
    .sort({ createdAt: -1 });
}

export async function getPrescriptionById(id, user = null) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid prescription id');
  }

  const filter = {};

  if (user?.role === 'Patient') {
    const patient = await resolveVisiblePatient(user);
    if (!patient) {
      throw new ApiError(404, 'Prescription not found');
    }
    filter.patient = patient._id;
  }

  if (user?.role === 'Doctor') {
    const doctor = await resolveVisibleDoctor(user);
    if (!doctor) {
      throw new ApiError(404, 'Prescription not found');
    }
    filter.doctor = doctor._id;
  }

  const prescription = await Prescription.findOne({ _id: id, ...filter })
    .populate('patient', 'patientId fullName email')
    .populate('doctor', 'fullName email department')
    .populate('appointment', 'appointmentId appointmentDate appointmentTime status');

  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  return prescription;
}

export async function createPrescription(data, user) {
  if (!user || !['Admin', 'Doctor'].includes(user.role)) {
    throw new ApiError(403, 'Only admins and assigned doctors can create prescriptions');
  }

  const normalizedData = { ...data };

  if (!normalizedData.patient || !mongoose.Types.ObjectId.isValid(normalizedData.patient)) {
    throw new ApiError(400, 'Valid patient id is required');
  }

  if (!normalizedData.doctor || !mongoose.Types.ObjectId.isValid(normalizedData.doctor)) {
    throw new ApiError(400, 'Valid doctor id is required');
  }

  if (!normalizedData.appointment || !mongoose.Types.ObjectId.isValid(normalizedData.appointment)) {
    throw new ApiError(400, 'Valid appointment id is required');
  }

  if (user.role === 'Doctor') {
    const doctorProfile = await Doctor.findOne({ email: user.email });
    if (!doctorProfile) {
      throw new ApiError(403, 'Doctor profile not found');
    }
    if (doctorProfile._id.toString() !== normalizedData.doctor.toString()) {
      throw new ApiError(403, 'You can only create prescriptions for your own appointments');
    }
  }

  await validateReferences(normalizedData.patient, normalizedData.doctor, normalizedData.appointment);

  return Prescription.create(normalizedData);
}

export async function updatePrescription(id, data, user) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid prescription id');
  }

  if (!user || !['Admin', 'Doctor'].includes(user.role)) {
    throw new ApiError(403, 'Only admins and assigned doctors can update prescriptions');
  }

  const prescription = await Prescription.findById(id);
  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  if (user.role === 'Doctor') {
    const doctorProfile = await Doctor.findOne({ email: user.email });
    if (!doctorProfile) {
      throw new ApiError(403, 'Doctor profile not found');
    }
    if (doctorProfile._id.toString() !== prescription.doctor.toString()) {
      throw new ApiError(403, 'You can only update your own prescriptions');
    }
  }

  const normalizedData = { ...data };

  if (normalizedData.patient && !mongoose.Types.ObjectId.isValid(normalizedData.patient)) {
    throw new ApiError(400, 'Valid patient id is required');
  }

  if (normalizedData.doctor && !mongoose.Types.ObjectId.isValid(normalizedData.doctor)) {
    throw new ApiError(400, 'Valid doctor id is required');
  }

  if (normalizedData.appointment && !mongoose.Types.ObjectId.isValid(normalizedData.appointment)) {
    throw new ApiError(400, 'Valid appointment id is required');
  }

  const targetPatient = normalizedData.patient || prescription.patient;
  const targetDoctor = normalizedData.doctor || prescription.doctor;
  const targetAppointment = normalizedData.appointment || prescription.appointment;

  if (normalizedData.patient || normalizedData.doctor || normalizedData.appointment) {
    await validateReferences(targetPatient, targetDoctor, targetAppointment);
  }

  const updatedPrescription = await Prescription.findByIdAndUpdate(id, normalizedData, {
    new: true,
    runValidators: true
  })
    .populate('patient', 'patientId fullName email')
    .populate('doctor', 'fullName email department')
    .populate('appointment', 'appointmentId appointmentDate appointmentTime status');

  if (!updatedPrescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  return updatedPrescription;
}

export async function deletePrescription(id, user) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid prescription id');
  }

  if (!user || !['Admin', 'Doctor'].includes(user.role)) {
    throw new ApiError(403, 'Only admins and assigned doctors can delete prescriptions');
  }

  const prescription = await Prescription.findById(id);
  if (!prescription) {
    throw new ApiError(404, 'Prescription not found');
  }

  if (user.role === 'Doctor') {
    const doctorProfile = await Doctor.findOne({ email: user.email });
    if (!doctorProfile) {
      throw new ApiError(403, 'Doctor profile not found');
    }
    if (doctorProfile._id.toString() !== prescription.doctor.toString()) {
      throw new ApiError(403, 'You can only delete your own prescriptions');
    }
  }

  await Prescription.findByIdAndDelete(id);
  return prescription;
}
