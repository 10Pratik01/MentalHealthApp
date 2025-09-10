import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    dateOfBirth: dateOfBirth || null,
    mobileNumber: mobileNumber || null,
  });

  const token = generateToken(user._id);

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
      createdAt: user.createdAt,
    },
    token, // Provide JWT token for client use
  });
});

export const loginuser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error("Account has been deactivated. Please contact support.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  user.lastLoginAt = new Date(); // Optional: track last login
  await user.save();

  res.status(200).json({
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
    token, // Provide token for client
  });
});

export const logoutuser = asyncHandler(async (req, res) => {
  // If you set HTTP-only cookies for token, clear here
  // But for JWT in headers, client removes token

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

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
      updatedAt: user.updatedAt,
    },
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, dateOfBirth, mobileNumber } = req.body;
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

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
      updatedAt: updatedUser.updatedAt,
    },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current password and new password are required");
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS) || 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

const labelToRiskLevel = {
  "None": "none",
  "Mild": "mild",
  "Moderate": "moderate",
  "Moderately Severe": "moderately severe",
  "Severe": "severe",
};

export const updateUserRiskLevel = async (req, res) => {
  try {
    const userId = req.params.id;
    const { label } = req.body; // Expecting { label: "Moderate" }

    if (!label) {
      return res.status(400).json({ success: false, error: "Label is required" });
    }

    // Convert incoming label to enum value
    const riskLevel = labelToRiskLevel[label];
    if (!riskLevel) {
      return res.status(400).json({ success: false, error: "Invalid label provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { riskLevel },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user risk level:", error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};