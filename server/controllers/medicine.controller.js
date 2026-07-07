import asyncHandler from '../utils/asyncHandler.js';
import * as medicineService from '../services/medicine.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const getMedicines = asyncHandler(async (req, res) => {
  const medicines = await medicineService.getMedicines(req.query);
  const response = new ApiResponse(200, medicines, 'Medicines fetched successfully');
  res.status(response.statusCode).json(response);
});

export const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await medicineService.getMedicineById(req.params.id);
  const response = new ApiResponse(200, medicine, 'Medicine fetched successfully');
  res.status(response.statusCode).json(response);
});

export const createMedicine = asyncHandler(async (req, res) => {
  const medicine = await medicineService.createMedicine(req.body);
  const response = new ApiResponse(201, medicine, 'Medicine created successfully');
  res.status(response.statusCode).json(response);
});

export const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await medicineService.updateMedicine(req.params.id, req.body);
  const response = new ApiResponse(200, medicine, 'Medicine updated successfully');
  res.status(response.statusCode).json(response);
});

export const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await medicineService.deleteMedicine(req.params.id);
  const response = new ApiResponse(200, medicine, 'Medicine deleted successfully');
  res.status(response.statusCode).json(response);
});

export const dispenseMedicine = asyncHandler(async (req, res) => {
  const medicine = await medicineService.dispenseMedicine(req.params.id, req.body.quantity);
  const response = new ApiResponse(200, medicine, 'Medicine dispensed successfully');
  res.status(response.statusCode).json(response);
});
