import asyncHandler from "../utils/asyncHandler.js";
import * as dashboardService from "../services/dashboard.service.js";
import ApiResponse from "../utils/apiResponse.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboard();

  const response = new ApiResponse(
    200,
    data,
    "Dashboard fetched successfully"
  );

  res.status(response.statusCode).json(response);
});