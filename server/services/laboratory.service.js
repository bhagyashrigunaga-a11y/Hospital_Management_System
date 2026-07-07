import mongoose from 'mongoose';
import LaboratoryTest from '../models/laboratory.model.js';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import ApiError from '../utils/apiError.js';

function buildLaboratoryFilter(query = {}) {
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

  if (query.testStatus) {
    filter.testStatus = query.testStatus;
  }

  return filter;
}

async function resolveVisiblePatient(user) {
  if (!user || user.role !== 'Patient') return null;
  return Patient.findOne({ email: user.email });
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

export async function getLaboratoryTests(query = {}, user = null) {
  const filter = buildLaboratoryFilter(query);

  if (user?.role === 'Patient') {
    const patient = await resolveVisiblePatient(user);
    if (!patient) {
      return [];
    }
    filter.patient = patient._id;
  }

  return LaboratoryTest.find(filter)
    .populate('patient', 'patientId fullName email')
    .populate('doctor', 'fullName email department')
    .populate('appointment', 'appointmentId appointmentDate appointmentTime status')
    .sort({ requestedDate: -1 });
}

export async function getLaboratoryTestById(id, user = null) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid laboratory test id');
  }

  const filter = {};

  if (user?.role === 'Patient') {
    const patient = await resolveVisiblePatient(user);
    if (!patient) {
      throw new ApiError(404, 'Laboratory test not found');
    }
    filter.patient = patient._id;
  }

  const test = await LaboratoryTest.findOne({ _id: id, ...filter })
    .populate('patient', 'patientId fullName email')
    .populate('doctor', 'fullName email department')
    .populate('appointment', 'appointmentId appointmentDate appointmentTime status');

  if (!test) {
    throw new ApiError(404, 'Laboratory test not found');
  }

  return test;
}

export async function createLaboratoryTest(data, user) {
  if (!user || !['Admin', 'Doctor', 'Lab Technician'].includes(user.role)) {
    throw new ApiError(403, 'You do not have permission to create laboratory tests');
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

  await validateReferences(normalizedData.patient, normalizedData.doctor, normalizedData.appointment);

  return LaboratoryTest.create(normalizedData);
}

export async function updateLaboratoryTest(id, data, user) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid laboratory test id');
  }

  if (!user || !['Admin', 'Doctor', 'Lab Technician'].includes(user.role)) {
    throw new ApiError(403, 'You do not have permission to update laboratory tests');
  }

  const test = await LaboratoryTest.findById(id);
  if (!test) {
    throw new ApiError(404, 'Laboratory test not found');
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

  const targetPatient = normalizedData.patient || test.patient;
  const targetDoctor = normalizedData.doctor || test.doctor;
  const targetAppointment = normalizedData.appointment || test.appointment;

  if (normalizedData.patient || normalizedData.doctor || normalizedData.appointment) {
    await validateReferences(targetPatient, targetDoctor, targetAppointment);
  }

  const updatedTest = await LaboratoryTest.findByIdAndUpdate(id, normalizedData, {
    new: true,
    runValidators: true
  })
    .populate('patient', 'patientId fullName email')
    .populate('doctor', 'fullName email department')
    .populate('appointment', 'appointmentId appointmentDate appointmentTime status');

  if (!updatedTest) {
    throw new ApiError(404, 'Laboratory test not found');
  }

  return updatedTest;
}

export async function deleteLaboratoryTest(id, user) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid laboratory test id');
  }

  if (!user || !['Admin', 'Doctor', 'Lab Technician'].includes(user.role)) {
    throw new ApiError(403, 'You do not have permission to delete laboratory tests');
  }

  const test = await LaboratoryTest.findByIdAndDelete(id);
  if (!test) {
    throw new ApiError(404, 'Laboratory test not found');
  }

  return test;
}
