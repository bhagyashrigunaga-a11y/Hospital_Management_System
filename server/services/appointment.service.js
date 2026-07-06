import mongoose from 'mongoose';
import Appointment from '../models/appointment.model.js';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import ApiError from '../utils/apiError.js';

function buildAppointmentFilter(query = {}) {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.department) {
    filter.department = new RegExp(query.department, 'i');
  }

  if (query.patient) {
    filter.patient = query.patient;
  }

  if (query.doctor) {
    filter.doctor = query.doctor;
  }

  if (query.appointmentDate) {
    const date = new Date(query.appointmentDate);
    if (!Number.isNaN(date.getTime())) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.appointmentDate = { $gte: start, $lte: end };
    }
  }

  return filter;
}

function normalizeAppointmentInput(data) {
  const normalized = { ...data };

  if (data.appointmentDate !== undefined) {
    normalized.appointmentDate = new Date(data.appointmentDate);
  }

  return normalized;
}

function buildAppointmentDateTime(appointmentDate, appointmentTime) {
  const date = new Date(appointmentDate);
  const [hours, minutes] = appointmentTime.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

async function resolveVisiblePatient(user) {
  if (!user || user.role !== 'Patient') return null;
  return Patient.findOne({ email: user.email });
}

async function resolveVisibleDoctor(user) {
  if (!user || user.role !== 'Doctor') return null;
  return Doctor.findOne({ email: user.email });
}

async function ensureNoDuplicateAppointment(doctorId, appointmentDate, appointmentTime, excludeId = null) {
  const query = {
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: { $in: ['Pending', 'Confirmed', 'Completed'] }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await Appointment.findOne(query);
  if (existing) {
    throw new ApiError(409, 'A booking already exists for this doctor at the selected date and time');
  }
}

async function validateReference(id, model, errorMessage) {
  const doc = await model.findById(id);
  if (!doc) {
    throw new ApiError(404, errorMessage);
  }
  return doc;
}

export async function getAppointments(query = {}, user = null) {
  const filter = buildAppointmentFilter(query);

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

  return Appointment.find(filter)
    .populate('patient', 'patientId fullName email')
    .populate('doctor', 'fullName email')
    .populate('createdBy', 'name email role')
    .sort({ appointmentDate: 1, appointmentTime: 1 });
}

export async function getAppointmentById(id, user = null) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid appointment id');
  }

  const filter = {};
  if (user?.role === 'Patient') {
    const patient = await resolveVisiblePatient(user);
    if (!patient) {
      throw new ApiError(404, 'Appointment not found');
    }
    filter.patient = patient._id;
  }

  if (user?.role === 'Doctor') {
    const doctor = await resolveVisibleDoctor(user);
    if (!doctor) {
      throw new ApiError(404, 'Appointment not found');
    }
    filter.doctor = doctor._id;
  }

  const appointment = await Appointment.findOne({ _id: id, ...filter })
    .populate('patient', 'patientId fullName email')
    .populate('doctor', 'fullName email')
    .populate('createdBy', 'name email role');

  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  return appointment;
}

export async function createAppointment(data, user) {
  const normalizedData = normalizeAppointmentInput(data);

  if (!normalizedData.patient || !mongoose.Types.ObjectId.isValid(normalizedData.patient)) {
    throw new ApiError(400, 'Valid patient id is required');
  }

  if (!normalizedData.doctor || !mongoose.Types.ObjectId.isValid(normalizedData.doctor)) {
    throw new ApiError(400, 'Valid doctor id is required');
  }

  if (!normalizedData.appointmentDate || !normalizedData.appointmentTime) {
    throw new ApiError(400, 'Appointment date and time are required');
  }

  const appointmentDateTime = buildAppointmentDateTime(normalizedData.appointmentDate, normalizedData.appointmentTime);
  if (appointmentDateTime < new Date()) {
    throw new ApiError(400, 'Appointment cannot be booked in the past');
  }

  await validateReference(normalizedData.patient, Patient, 'Patient not found');
  await validateReference(normalizedData.doctor, Doctor, 'Doctor not found');
  await ensureNoDuplicateAppointment(normalizedData.doctor, normalizedData.appointmentDate, normalizedData.appointmentTime);

  return Appointment.create({
    ...normalizedData,
    createdBy: user._id,
    status: normalizedData.status || 'Pending'
  });
}

export async function updateAppointment(id, data, user) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid appointment id');
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  if (data.patient && !mongoose.Types.ObjectId.isValid(data.patient)) {
    throw new ApiError(400, 'Valid patient id is required');
  }

  if (data.doctor && !mongoose.Types.ObjectId.isValid(data.doctor)) {
    throw new ApiError(400, 'Valid doctor id is required');
  }

  const normalizedData = normalizeAppointmentInput(data);

  if (normalizedData.appointmentDate && normalizedData.appointmentTime) {
    const appointmentDateTime = buildAppointmentDateTime(normalizedData.appointmentDate, normalizedData.appointmentTime);
    if (appointmentDateTime < new Date()) {
      throw new ApiError(400, 'Appointment cannot be booked in the past');
    }
  }

  if (normalizedData.patient) {
    await validateReference(normalizedData.patient, Patient, 'Patient not found');
  }

  if (normalizedData.doctor) {
    await validateReference(normalizedData.doctor, Doctor, 'Doctor not found');
  }

  if (normalizedData.doctor && normalizedData.appointmentDate && normalizedData.appointmentTime) {
    await ensureNoDuplicateAppointment(normalizedData.doctor, normalizedData.appointmentDate, normalizedData.appointmentTime, id);
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(id, { ...normalizedData, updatedAt: new Date() }, {
    new: true,
    runValidators: true
  }).populate('patient', 'patientId fullName email').populate('doctor', 'fullName email').populate('createdBy', 'name email role');

  if (!updatedAppointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  return updatedAppointment;
}

export async function deleteAppointment(id, user) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid appointment id');
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  if (appointment.status === 'Cancelled') {
    return appointment;
  }

  if (appointment.status === 'Completed') {
    throw new ApiError(400, 'Completed appointments cannot be cancelled');
  }

  const cancelledAppointment = await Appointment.findByIdAndUpdate(
    id,
    { status: 'Cancelled', notes: appointment.notes ? `${appointment.notes}\nCancelled by ${user?.name || 'system'}` : `Cancelled by ${user?.name || 'system'}` },
    { new: true, runValidators: true }
  ).populate('patient', 'patientId fullName email').populate('doctor', 'fullName email').populate('createdBy', 'name email role');

  return cancelledAppointment;
}
