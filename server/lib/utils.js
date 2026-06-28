import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  // FIX: Added expiry. Tokens without expiry last forever — a security risk.
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
};