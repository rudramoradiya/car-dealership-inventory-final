import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  try {
    const user = await User.create({ email, password });
    return res.status(201).json({ user: user.toJSON() });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user);

  return res.status(200).json({ token, user: user.toJSON() });
}

export function getMe(req, res) {
  return res.status(200).json({ user: req.user.toJSON() });
}
