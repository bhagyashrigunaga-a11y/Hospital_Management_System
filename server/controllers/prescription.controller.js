import asyncHandler from '../utils/asyncHandler.js';
import * as prescriptionService from '../services/prescription.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const getPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await prescriptionService.getPrescriptions(req.query, req.user);
  const response = new ApiResponse(200, prescriptions, 'Prescriptions fetched successfully');
  res.status(response.statusCode).json(response);
});

export const getPrescriptionById = asyncHandler(async (req, res) => {
  const prescription = await prescriptionService.getPrescriptionById(req.params.id, req.user);
  const response = new ApiResponse(200, prescription, 'Prescription fetched successfully');
  res.status(response.statusCode).json(response);
});

export const createPrescription = asyncHandler(async (req, res) => {
  const prescription = await prescriptionService.createPrescription(req.body, req.user);
  const response = new ApiResponse(201, prescription, 'Prescription created successfully');
  res.status(response.statusCode).json(response);
});

export const updatePrescription = asyncHandler(async (req, res) => {
  const prescription = await prescriptionService.updatePrescription(req.params.id, req.body, req.user);
  const response = new ApiResponse(200, prescription, 'Prescription updated successfully');
  res.status(response.statusCode).json(response);
});

export const deletePrescription = asyncHandler(async (req, res) => {
  const prescription = await prescriptionService.deletePrescription(req.params.id, req.user);
  const response = new ApiResponse(200, prescription, 'Prescription deleted successfully');
  res.status(response.statusCode).json(response);
});
