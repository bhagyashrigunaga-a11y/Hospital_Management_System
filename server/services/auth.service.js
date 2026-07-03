import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import { signToken } from '../utils/jwt.js';

export async function registerUser({ name, email, password, role }) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already in use');

  const user = await User.create({ name, email, password, role });
  const token = signToken({ id: user._id, role: user.role });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const valid = await user.comparePassword(password);
  if (!valid) throw new ApiError(401, 'Invalid credentials');

  const token = signToken({ id: user._id, role: user.role });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
}
