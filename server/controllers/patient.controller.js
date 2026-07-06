import asyncHandler from '../utils/asyncHandler.js';
import * as patientService from '../services/patient.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const getPatients = asyncHandler(async (req, res) => {
  const patients = await patientService.getPatients(req.query);
  const response = new ApiResponse(200, patients, 'Patients fetched successfully');
  res.status(response.statusCode).json(response);
});

export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await patientService.getPatientById(req.params.id);
  const response = new ApiResponse(200, patient, 'Patient fetched successfully');
  res.status(response.statusCode).json(response);
});

export const createPatient = asyncHandler(async (req, res) => {
  const patient = await patientService.createPatient(req.body);
  const response = new ApiResponse(201, patient, 'Patient created successfully');
  res.status(response.statusCode).json(response);
});

export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await patientService.updatePatient(req.params.id, req.body);
  const response = new ApiResponse(200, patient, 'Patient updated successfully');
  res.status(response.statusCode).json(response);
});

export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await patientService.deletePatient(req.params.id);
  const response = new ApiResponse(200, patient, 'Patient deleted successfully');
  res.status(response.statusCode).json(response);
});
