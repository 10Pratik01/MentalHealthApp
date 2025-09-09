import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error('Access denied. No token provided.');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Get user from token (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      res.status(401);
      throw new Error('Token is not valid. User not found.');
    }

    if (!user.isActive) {
      res.status(401);
      throw new Error('Account has been deactivated.');
    }

    // Set user info in request object
    req.user = { id: user._id };
    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      res.status(401);
      throw new Error('Invalid token.');
    }
    
    if (error.name === 'TokenExpiredError') {
      res.status(401);
      throw new Error('Token has expired.');
    }

    throw error;
  }
});


// // Middleware to check if user is active
// export const checkActiveUser = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user.id);
  
//   if (!user || !user.isActive) {
//     res.status(403);
//     throw new Error('Account is inactive. Please contact support.');
//   }
  
//   next();
// });
