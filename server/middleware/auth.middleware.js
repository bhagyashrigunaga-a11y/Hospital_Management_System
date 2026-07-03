import asyncHandler from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/jwt.js';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authorization token missing');
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, 'User not found');

  req.user = user;
  next();
});

export default authMiddleware;
