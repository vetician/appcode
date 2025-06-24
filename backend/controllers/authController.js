const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Parent = require('../models/Parent');
const Pet = require('../models/Pet');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');


// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

// Register new user
const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role = 'vetician' } = req.body;
  console.log(req.body);

    // Validate role
  if (role && !['veterinarian', 'vetician'].includes(role)) {
    return next(new AppError('Invalid role specified', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ 
    email: email.toLowerCase().trim(),
    role
  });

  if (existingUser) {
    return next(new AppError(`User with this email already exists as a ${role}`, 400));
  }

  // Create new user
  const user = new User({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role 
  });
  console.log(user)

  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token to user
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  // Update last login
  await user.updateLastLogin();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      ...user.getPublicProfile(),
      role: user.role // Explicitly include role in response
    },
    token: accessToken,
    refreshToken,
  });
});

// Login user
const login = catchAsync(async (req, res, next) => {
  const { email, password, loginType } = req.body;
  console.log(req.body)

  // Find user and include password for comparison
  const user = await User.findByEmailAndRole(email, loginType).select('+password');
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Verify role matches login type (if loginType is provided)
  if (loginType && user.role !== loginType) {
    return next(new AppError(`Please login as ${user.role}`, 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new AppError('Account has been deactivated', 401));
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token to user
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  // Update last login
  await user.updateLastLogin();

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      ...user.getPublicProfile(),
      role: user.role // Explicitly include role in response
    },
    token: accessToken,
    refreshToken,
  });
});

// Register new parent
const registerParent = catchAsync(async (req, res, next) => {
  const { name, email, phone, address } = req.body;
  console.log(req.body)

  // Check if parent already exists
  const existingParent = await Parent.findByEmail(email);
  if (existingParent) {
    return next(new AppError('Parent with this email already exists', 400));
  }

  // Create new parent  
  const parent = new Parent({
    name: name,
    email: email,
    phone: phone,
    address: address,
  });

  await parent.save();

  // Generate tokens (same as user registration)
  const { accessToken, refreshToken } = generateTokens(parent._id);

  res.status(201).json({
    success: true,
    message: 'Parent registered successfully',
    parent: parent.getPublicProfile(),
    token: accessToken,
    refreshToken,
  });
});

// Register pet
const createPet = catchAsync(async (req, res, next) => {
  const { name, species, gender, userId } = req.body;
  console.log(req.body);

  // Validate required fields
  if (!name || !species || !gender) {
    return next(new AppError('Name, species and gender are required', 400));
  }

  if (!userId) {
    return next(new AppError('User ID is required', 400));
  }

  // Check if pet already exists for this user
  const existingPet = await Pet.findOne({ name, userId });
  if (existingPet) {
    return next(new AppError('A pet with this name already exists for this user', 409));
  }

  // Create new pet  
  const pet = new Pet({
    name,
    species,
    gender,
    userId,
    ...req.body // Include any additional fields
  });

  await pet.save();

  console.log(res)

  res.status(201).json({
    success: true,
    message: 'Pet created successfully',
    pet: pet.getBasicInfo()
  });
});

// Refresh access token
const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return next(new AppError('Refresh token is required', 400));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError('Invalid refresh token', 401));
    }

    const tokenExists = user.refreshTokens.some(tokenObj => tokenObj.token === token);
    if (!tokenExists) {
      return next(new AppError('Invalid refresh token', 401));
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== token);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({
      success: true,
      token: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return next(new AppError('Invalid refresh token', 401));
  }
});

// Logout user (remove current refresh token)
const logout = catchAsync(async (req, res, next) => {
  const { refreshToken: token } = req.body;
  const user = req.user;

  if (token) {
    // Remove specific refresh token
    user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== token);
    await user.save();
  }

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Logout from all devices (remove all refresh tokens)
const logoutAll = catchAsync(async (req, res, next) => {
  const user = req.user;

  // Remove all refresh tokens
  user.refreshTokens = [];
  await user.save();

  res.json({
    success: true,
    message: 'Logged out from all devices successfully',
  });
});


module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  registerParent,
  createPet
};