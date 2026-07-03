import mongoose from 'mongoose';
import Doctor from '../models/doctor.model.js';
import ApiError from '../utils/apiError.js';

function buildDoctorFilter(query = {}) {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.department) {
    filter.department = new RegExp(query.department, 'i');
  }

  if (query.specialization) {
    filter.specialization = new RegExp(query.specialization, 'i');
  }

  return filter;
}

function normalizeDoctorInput(data) {
  const normalized = { ...data };

  if (typeof data.availableDays === 'string') {
    normalized.availableDays = data.availableDays
      .split(',')
      .map((day) => day.trim())
      .filter(Boolean);
  }

  if (typeof data.availableTime === 'string') {
    normalized.availableTime = data.availableTime
      .split(',')
      .map((time) => time.trim())
      .filter(Boolean);
  }

  if (data.experience !== undefined) {
    normalized.experience = Number(data.experience);
  }

  if (data.consultationFee !== undefined) {
    normalized.consultationFee = Number(data.consultationFee);
  }

  return normalized;
}

export async function getDoctors(query = {}) {
  const filter = buildDoctorFilter(query);
  return Doctor.find(filter).sort({ createdAt: -1 });
}

export async function getDoctorById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid doctor id');
  }

  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  return doctor;
}

export async function createDoctor(data) {
  const existingDoctor = await Doctor.findOne({ email: data.email });
  if (existingDoctor) {
    throw new ApiError(409, 'Doctor email already exists');
  }

  const normalizedData = normalizeDoctorInput(data);
  return Doctor.create(normalizedData);
}

export async function updateDoctor(id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid doctor id');
  }

  if (data.email) {
    const existingDoctor = await Doctor.findOne({ email: data.email, _id: { $ne: id } });
    if (existingDoctor) {
      throw new ApiError(409, 'Doctor email already exists');
    }
  }

  const normalizedData = normalizeDoctorInput(data);
  const doctor = await Doctor.findByIdAndUpdate(id, normalizedData, {
    new: true,
    runValidators: true
  });

  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  return doctor;
}

export async function deleteDoctor(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid doctor id');
  }

  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) {
    throw new ApiError(404, 'Doctor not found');
  }

  return doctor;
}
