import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

export const verifyToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { address: string };
    return decoded.address;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};