import mongoose from 'mongoose';
import Patient from '../models/patient.model.js';
import Doctor from '../models/doctor.model.js';
import ApiError from '../utils/apiError.js';

function buildPatientFilter(query = {}) {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.gender) {
    filter.gender = query.gender;
  }

  if (query.assignedDoctor) {
    filter.assignedDoctor = query.assignedDoctor;
  }

  if (query.fullName) {
    filter.fullName = new RegExp(query.fullName, 'i');
  }

  return filter;
}

function normalizePatientInput(data) {
  const normalized = { ...data };

  if (data.age !== undefined) {
    normalized.age = Number(data.age);
  }

  if (typeof data.medicalHistory === 'string') {
    normalized.medicalHistory = data.medicalHistory
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof data.allergies === 'string') {
    normalized.allergies = data.allergies
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof data.currentMedications === 'string') {
    normalized.currentMedications = data.currentMedications
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return normalized;
}

export async function getPatients(query = {}) {
  const filter = buildPatientFilter(query);
  return Patient.find(filter).populate('assignedDoctor', 'fullName email').sort({ createdAt: -1 });
}

export async function getPatientById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid patient id');
  }

  const patient = await Patient.findById(id).populate('assignedDoctor', 'fullName email');
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  return patient;
}

export async function createPatient(data) {
  const existingPatient = await Patient.findOne({ email: data.email });
  if (existingPatient) {
    throw new ApiError(409, 'Patient email already exists');
  }

  if (data.assignedDoctor) {
    const doctor = await Doctor.findById(data.assignedDoctor);
    if (!doctor) {
      throw new ApiError(404, 'Assigned doctor not found');
    }
  }

  const normalizedData = normalizePatientInput(data);
  return Patient.create(normalizedData);
}

export async function updatePatient(id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid patient id');
  }

  if (data.email) {
    const existingPatient = await Patient.findOne({ email: data.email, _id: { $ne: id } });
    if (existingPatient) {
      throw new ApiError(409, 'Patient email already exists');
    }
  }

  if (data.assignedDoctor) {
    const doctor = await Doctor.findById(data.assignedDoctor);
    if (!doctor) {
      throw new ApiError(404, 'Assigned doctor not found');
    }
  }

  const normalizedData = normalizePatientInput(data);
  const patient = await Patient.findByIdAndUpdate(id, normalizedData, {
    new: true,
    runValidators: true
  });

  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  return patient;
}

export async function deletePatient(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid patient id');
  }

  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  return patient;
}
