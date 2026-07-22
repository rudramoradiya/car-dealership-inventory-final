import User from '../models/User.js';

export async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await User.create({ email, password });

  return res.status(201).json({ user: user.toJSON() });
}
