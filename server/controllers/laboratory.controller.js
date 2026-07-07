import asyncHandler from '../utils/asyncHandler.js';
import * as laboratoryService from '../services/laboratory.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const getLaboratoryTests = asyncHandler(async (req, res) => {
  const tests = await laboratoryService.getLaboratoryTests(req.query, req.user);
  const response = new ApiResponse(200, tests, 'Laboratory tests fetched successfully');
  res.status(response.statusCode).json(response);
});

export const getLaboratoryTestById = asyncHandler(async (req, res) => {
  const test = await laboratoryService.getLaboratoryTestById(req.params.id, req.user);
  const response = new ApiResponse(200, test, 'Laboratory test fetched successfully');
  res.status(response.statusCode).json(response);
});

export const createLaboratoryTest = asyncHandler(async (req, res) => {
  const test = await laboratoryService.createLaboratoryTest(req.body, req.user);
  const response = new ApiResponse(201, test, 'Laboratory test created successfully');
  res.status(response.statusCode).json(response);
});

export const updateLaboratoryTest = asyncHandler(async (req, res) => {
  const test = await laboratoryService.updateLaboratoryTest(req.params.id, req.body, req.user);
  const response = new ApiResponse(200, test, 'Laboratory test updated successfully');
  res.status(response.statusCode).json(response);
});

export const deleteLaboratoryTest = asyncHandler(async (req, res) => {
  const test = await laboratoryService.deleteLaboratoryTest(req.params.id, req.user);
  const response = new ApiResponse(200, test, 'Laboratory test deleted successfully');
  res.status(response.statusCode).json(response);
});
