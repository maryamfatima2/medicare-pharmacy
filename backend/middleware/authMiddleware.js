import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const userId = decoded.id || decoded._id;
      if (!userId) {
        return res.status(401).json({ message: 'Authentication failed: Invalid token payload' });
      }

      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Authentication failed: User not found in database' });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'Authentication failed: Account is deactivated' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Admin-only middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};
