import asyncHandler from '../utils/asyncHandler.js';
import * as billService from '../services/bill.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const getBills = asyncHandler(async (req, res) => {
  const bills = await billService.getBills(req.query, req.user);
  const response = new ApiResponse(200, bills, 'Bills fetched successfully');
  res.status(response.statusCode).json(response);
});

export const getBillById = asyncHandler(async (req, res) => {
  const bill = await billService.getBillById(req.params.id, req.user);
  const response = new ApiResponse(200, bill, 'Bill fetched successfully');
  res.status(response.statusCode).json(response);
});

export const createBill = asyncHandler(async (req, res) => {
  const bill = await billService.createBill(req.body, req.user);
  const response = new ApiResponse(201, bill, 'Bill created successfully');
  res.status(response.statusCode).json(response);
});

export const updateBill = asyncHandler(async (req, res) => {
  const bill = await billService.updateBill(req.params.id, req.body, req.user);
  const response = new ApiResponse(200, bill, 'Bill updated successfully');
  res.status(response.statusCode).json(response);
});

export const deleteBill = asyncHandler(async (req, res) => {
  const bill = await billService.deleteBill(req.params.id, req.user);
  const response = new ApiResponse(200, bill, 'Bill deleted successfully');
  res.status(response.statusCode).json(response);
});
