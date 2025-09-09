import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // Fixed typo: "uils" -> "utils"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registeruser = asyncHandler(async (req, res) => {
  const { email, password, name, dateOfBirth, mobileNumber } = req.body;

  if (!email || !password || !name) {
    res.status(400);
    throw new Error("Please fill all the required fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  // Hash password before creating user
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user with hashed password
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    dateOfBirth: dateOfBirth || null,
    mobileNumber: mobileNumber || null,
  });

  // Generate token
  const token = generateToken(user._id);

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      riskLevel: user.riskLevel,
      dateOfBirth: user.dateOfBirth,
      mobileNumber: user.mobileNumber,
      createdAt: user.createdAt
    },
    token // Include token in response for mobile apps
  });
});

export const loginuser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find user by email (include password for comparison)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if user account is active
  if (!user.isActive) {
    res.status(401);
    throw new Error("Account has been deactivated. Please contact support.");
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user._id);

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  };

  // Update last login (optional)
  user.updatedAt = new Date();
  await user.save();

  res.status(200).cookie("token", token, options).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      riskLevel: user.riskLevel,
      dateOfBirth: user.dateOfBirth,
      mobileNumber: user.mobileNumber,
    },
    token // Include token in response for mobile apps
  });
});

// Logout user
export const logoutuser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      riskLevel: user.riskLevel,
      dateOfBirth: user.dateOfBirth,
      mobileNumber: user.mobileNumber,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, dateOfBirth, mobileNumber } = req.body;

  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update fields if provided
  if (name) user.name = name.trim();
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;
  if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      riskLevel: updatedUser.riskLevel,
      dateOfBirth: updatedUser.dateOfBirth,
      mobileNumber: updatedUser.mobileNumber,
      updatedAt: updatedUser.updatedAt
    }
  });
});
