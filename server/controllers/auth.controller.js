import asyncHandler from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';
import ApiResponse from '../utils/apiResponse.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const { user, token } = await authService.registerUser({ name, email, password, role });

  const response = new ApiResponse(201, { user, token }, 'User registered');
  res.status(response.statusCode).json(response);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser({ email, password });

  const response = new ApiResponse(200, { user, token }, 'Login successful');
  res.status(response.statusCode).json(response);
});

export const profile = asyncHandler(async (req, res) => {
  const user = req.user;
  const response = new ApiResponse(200, { user }, 'User profile');
  res.status(response.statusCode).json(response);
});
