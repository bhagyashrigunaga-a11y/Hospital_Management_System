import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';

if (!jwtSecret) {
  throw new ApiError(500, 'JWT_SECRET is not defined in environment');
}

export function signToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token');
  }
}
