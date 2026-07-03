import ApiResponse from '../utils/apiResponse.js';

export const healthCheck = (req, res) => {
  const response = new ApiResponse(200, {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }, 'Service is healthy');

  res.status(response.statusCode).json(response);
};
