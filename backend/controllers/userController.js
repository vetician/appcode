const User = require('../models/User');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

// Get user profile
const getProfile = catchAsync(async (req, res, next) => {
  const user = req.user;

  res.json({
    success: true,
    user: user.getPublicProfile(),
  });
});

// Update user profile
const updateProfile = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { name, phone, location } = req.body;

  // Update fields if provided
  if (name !== undefined) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim() || null;
  if (location !== undefined) user.location = location.trim() || null;

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: user.getPublicProfile(),
  });
});

// Change password
const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  
  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return next(new AppError('Current password is incorrect', 400));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Remove all refresh tokens to force re-login on all devices
  user.refreshTokens = [];
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully. Please log in again.',
  });
});

// Delete user account
const deleteAccount = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Soft delete - deactivate account
  user.isActive = false;
  user.refreshTokens = [];
  await user.save();

  res.json({
    success: true,
    message: 'Account deactivated successfully',
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};