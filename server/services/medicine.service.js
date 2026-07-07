import mongoose from 'mongoose';
import Medicine from '../models/medicine.model.js';
import ApiError from '../utils/apiError.js';

function buildMedicineFilter(query = {}) {
  const filter = {};

  if (query.medicineName) {
    filter.medicineName = new RegExp(query.medicineName, 'i');
  }

  if (query.category) {
    filter.category = new RegExp(query.category, 'i');
  }

  if (query.status) {
    filter.status = query.status;
  }

  return filter;
}

function normalizeMedicineInput(data) {
  const normalized = { ...data };

  if (normalized.expiryDate !== undefined) {
    normalized.expiryDate = new Date(normalized.expiryDate);
  }

  if (normalized.stockQuantity !== undefined) {
    normalized.stockQuantity = Number(normalized.stockQuantity);
  }

  if (normalized.unitPrice !== undefined) {
    normalized.unitPrice = Number(normalized.unitPrice);
  }

  return normalized;
}

export async function getMedicines(query = {}) {
  const filter = buildMedicineFilter(query);
  return Medicine.find(filter).sort({ createdAt: -1 });
}

export async function getMedicineById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid medicine id');
  }

  const medicine = await Medicine.findById(id);
  if (!medicine) {
    throw new ApiError(404, 'Medicine not found');
  }

  return medicine;
}

export async function createMedicine(data) {
  const normalizedData = normalizeMedicineInput(data);
  return Medicine.create(normalizedData);
}

export async function updateMedicine(id, data) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid medicine id');
  }

  const normalizedData = normalizeMedicineInput(data);
  const medicine = await Medicine.findByIdAndUpdate(id, normalizedData, {
    new: true,
    runValidators: true
  });

  if (!medicine) {
    throw new ApiError(404, 'Medicine not found');
  }

  return medicine;
}

export async function deleteMedicine(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid medicine id');
  }

  const medicine = await Medicine.findByIdAndDelete(id);
  if (!medicine) {
    throw new ApiError(404, 'Medicine not found');
  }

  return medicine;
}

export async function dispenseMedicine(id, quantity) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid medicine id');
  }

  const parsedQuantity = Number(quantity);
  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    throw new ApiError(400, 'Dispense quantity must be a positive integer');
  }

  const medicine = await Medicine.findById(id);
  if (!medicine) {
    throw new ApiError(404, 'Medicine not found');
  }

  if (medicine.status === 'Expired') {
    throw new ApiError(400, 'Cannot dispense expired medicine');
  }

  if (medicine.stockQuantity < parsedQuantity) {
    throw new ApiError(400, 'Insufficient stock for requested quantity');
  }

  medicine.stockQuantity -= parsedQuantity;
  await medicine.save();
  return medicine;
}
