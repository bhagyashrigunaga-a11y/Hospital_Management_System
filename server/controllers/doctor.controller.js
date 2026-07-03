import asyncHandler from '../utils/asyncHandler.js';
import * as doctorService from '../services/doctor.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctorService.getDoctors(req.query);
  const response = new ApiResponse(200, doctors, 'Doctors fetched successfully');
  res.status(response.statusCode).json(response);
});

export const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.id);
  const response = new ApiResponse(200, doctor, 'Doctor fetched successfully');
  res.status(response.statusCode).json(response);
});

export const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await doctorService.createDoctor(req.body);
  const response = new ApiResponse(201, doctor, 'Doctor created successfully');
  res.status(response.statusCode).json(response);
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await doctorService.updateDoctor(req.params.id, req.body);
  const response = new ApiResponse(200, doctor, 'Doctor updated successfully');
  res.status(response.statusCode).json(response);
});

export const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await doctorService.deleteDoctor(req.params.id);
  const response = new ApiResponse(200, doctor, 'Doctor deleted successfully');
  res.status(response.statusCode).json(response);
});
