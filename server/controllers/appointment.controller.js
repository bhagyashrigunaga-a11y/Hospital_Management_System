import asyncHandler from '../utils/asyncHandler.js';
import * as appointmentService from '../services/appointment.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getAppointments(req.query, req.user);
  const response = new ApiResponse(200, appointments, 'Appointments fetched successfully');
  res.status(response.statusCode).json(response);
});

export const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.params.id, req.user);
  const response = new ApiResponse(200, appointment, 'Appointment fetched successfully');
  res.status(response.statusCode).json(response);
});

export const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body, req.user);
  const response = new ApiResponse(201, appointment, 'Appointment created successfully');
  res.status(response.statusCode).json(response);
});

export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.updateAppointment(req.params.id, req.body, req.user);
  const response = new ApiResponse(200, appointment, 'Appointment updated successfully');
  res.status(response.statusCode).json(response);
});

export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.deleteAppointment(req.params.id, req.user);
  const response = new ApiResponse(200, appointment, 'Appointment cancelled successfully');
  res.status(response.statusCode).json(response);
});
