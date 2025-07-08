const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Parent = require('../models/Parent');
const Pet = require('../models/Pet');
const Clinic = require('../models/Clinic');
const Veterinarian = require('../models/Veterinarian');
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




// create Veterinarian
const registerVeterinarian = catchAsync(async (req, res, next) => {
  const flatData = req.body;
  console.log(req.body)

  // Check if userId exists in the request
  if (!flatData.userId) {
    return res.status(400).json({  // Changed to return JSON response
      success: false,
      message: 'User ID is required'
    });
  }

  // Check existing veterinarian by userId
  const existingVeterinarianByUserId = await Veterinarian.findOne({
    userId: flatData.userId
  });

  if (existingVeterinarianByUserId) {
    return res.status(400).json({  // Changed to return JSON response
      success: false,
      message: 'You have already applied for verification'
    });
  }

  // Check existing veterinarian by registration number
  const existingVeterinarianByReg = await Veterinarian.findOne({
    'registration.value': flatData.registration
  });

  if (existingVeterinarianByReg) {
    return res.status(400).json({  // Changed to return JSON response
      success: false,
      message: 'A veterinarian with this registration number already exists.' // Note: Added period to match frontend check
    });
  }

  // Transform flat data to nested structure
  const veterinarianData = {};
  for (const [key, value] of Object.entries(flatData)) {
    if (key === 'userId') continue;

    veterinarianData[key] = {
      value: key === 'experience' ? Number(value) : value,
      verified: false
    };
  }

  // Create new veterinarian
  const veterinarian = new Veterinarian({
    ...veterinarianData,
    userId: flatData.userId,
    isVerified: false,
    isActive: true
  });

  await veterinarian.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(veterinarian._id);

  // Add refresh token
  veterinarian.refreshTokens.push({ token: refreshToken });
  await veterinarian.save();

  res.status(201).json({
    success: true,
    message: 'Veterinarian profile submitted successfully! Your account will be activated after verification.',
    veterinarian: veterinarian.getPublicProfile(),
    token: accessToken,
    refreshToken
  });
});

// check veterinarian verification
const checkVeterinarianVerification = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  console.log(req.body)

  // Check if userId exists in the request
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required',
      alertType: 'error'
    });
  }

  // Find veterinarian by userId
  const veterinarian = await Veterinarian.findOne({ userId });

  if (!veterinarian) {
    return res.status(404).json({
      success: false,
      message: 'Veterinarian profile not found. Please register first.',
      alertType: 'error'
    });
  }

  if (!veterinarian.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Your veterinarian account is not yet verified. Please wait for verification.',
      alertType: 'warning',
      isVerified: false
    });
  }

  // If verified
  res.status(200).json({
    success: true,
    message: 'Account verified! You can now add your clinic.',
    alertType: 'success',
    isVerified: true,
    veterinarianId: veterinarian._id
  });
});

// get unverified veterinarians (admin)
const getUnverifiedVeterinarians = catchAsync(async (req, res, next) => {
  const veterinarians = await Veterinarian.find({ isVerified: false })
    .select('-refreshTokens') // Exclude refresh tokens
    .lean(); // Convert to plain JS object

  res.status(200).json({
    success: true,
    count: veterinarians.length,
    veterinarians: veterinarians
  });
});

// get verified veterinarians (admin)
const getVerifiedVeterinarians = catchAsync(async (req, res, next) => {
  // Add optional filters (city, specialization, etc.)
  const filter = { isVerified: true };
  if (req.query.city) filter['city.value'] = req.query.city;
  if (req.query.specialization) filter['specialization.value'] = req.query.specialization;

  const veterinarians = await Veterinarian.find(filter)
    .select('-refreshTokens')
    .lean();

  // const formattedVets = veterinarians.map(vet => {
  //   const formatted = {};
  //   Object.keys(vet).forEach(key => {
  //     formatted[key] = vet[key]?.value || vet[key];
  //   });
  //   return formatted;
  // });

  res.status(200).json({
    success: true,
    count: veterinarians.length,
    veterinarians: veterinarians
  });
});

// verify veterinarians detail (admin)
const verifyVeterinarianField = catchAsync(async (req, res, next) => {
  const { veterinarianId, fieldName } = req.params;
  console.log(req.params)

  // Find the veterinarian
  const veterinarian = await Veterinarian.findById(veterinarianId);
  if (!veterinarian) {
    return next(new AppError('Veterinarian not found', 404));
  }

  // Check if the field exists and is not already verified
  if (veterinarian[fieldName] && typeof veterinarian[fieldName] === 'object') {
    if (veterinarian[fieldName].verified) {
      return next(new AppError('Field is already verified', 400));
    }

    // Mark the field as verified
    veterinarian[fieldName].verified = true;
  } else {
    return next(new AppError('Invalid field specified', 400));
  }

  // Check if all required fields are now verified
  const requiredFields = [
    'name', 'gender', 'city',
    'experience', 'specialization',
    'qualification', 'registration',
    'identityProof'
  ];

  const allVerified = requiredFields.every(field => {
    return veterinarian[field]?.verified === true;
  });

  // If all fields are verified, mark the veterinarian as verified
  if (allVerified) {
    veterinarian.isVerified = true;
  }

  await veterinarian.save();

  res.status(200).json({
    success: true,
    message: `${fieldName} verified successfully`,
    veterinarian: {
      _id: veterinarian._id,
      [fieldName]: veterinarian[fieldName],
      isVerified: veterinarian.isVerified
    }
  });
});

// register clinic
const registerClinic = catchAsync(async (req, res, next) => {
  const clinicData = req.body;
  console.log(clinicData)

  // Validate required fields - return consistent error format
  if (!clinicData.userId || !clinicData.clinicName || !clinicData.city || !clinicData.streetAddress) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Missing required fields',
        code: 400
      }
    });
  }

  // Check existing clinics
  const existingClinic = await Clinic.findOne({
    $or: [
      { userId: clinicData.userId },
      {
        clinicName: clinicData.clinicName,
        city: clinicData.city
      }
    ]
  });

  if (existingClinic) {
    const message = existingClinic.userId === clinicData.userId
      ? 'You have already registered a clinic'
      : 'A clinic with this name already exists in this city';

    return res.status(400).json({
      success: false,
      error: {
        message,
        code: 400
      }
    });
  }

  // Create and save clinic
  const clinic = await Clinic.create({
    ...clinicData,
    verified: false,
    isActive: false
  });

  res.status(201).json({
    success: true,
    data: {
      clinicId: clinic._id,
      status: clinic.status
    }
  });
});

// get unverified clinics (admin)
const getUnverifiedClinics = catchAsync(async (req, res, next) => {
  const clinics = await Clinic.find({ verified: false })
    .lean();

  // Get all unique user IDs from clinics
  const userIds = [...new Set(clinics.map(c => c.userId))];

  // Get all related veterinarians in one query
  const veterinarians = await Veterinarian.find({
    userId: { $in: userIds }
  }).lean();

  // Create a map of userId -> veterinarian
  const vetMap = new Map();
  veterinarians.forEach(vet => {
    vetMap.set(vet.userId, {
      name: vet.name.value,
      title: vet.title.value,
      specialization: vet.specialization.value,
      isVerified: vet.isVerified,
      profilePhotoUrl: vet.profilePhotoUrl.value // Added profile photo
    });
  });
  // console.log(vetMap)

  const formattedClinics = clinics.map(clinic => ({
    ...clinic, // Preserve all clinic properties
    veterinarian: {
      ...(vetMap.get(clinic.userId.toString()) || {}), // Keep existing vet info
    }
  }));
  // console.log(formattedClinics)

  res.status(200).json({
    success: true,
    count: formattedClinics.length,
    clinics: formattedClinics
  });
});

// get verified clinics (admin)
const getVerifiedClinics = catchAsync(async (req, res, next) => {
  const filter = { verified: true };
  if (req.query.city) filter.city = req.query.city;
  if (req.query.establishmentType) filter.establishmentType = req.query.establishmentType;
  if (req.query.locality) filter.locality = req.query.locality;

  const clinics = await Clinic.find(filter)
    .lean();

  // Get all unique user IDs from clinics
  const userIds = [...new Set(clinics.map(c => c.userId))];

  // Get all related veterinarians in one query
  const veterinarians = await Veterinarian.find({
    userId: { $in: userIds }
  }).lean();

  // Create a map of userId -> veterinarian
  const vetMap = new Map();
  veterinarians.forEach(vet => {
    vetMap.set(vet.userId, {
      name: vet.name.value,
      title: vet.title.value,
      specialization: vet.specialization.value,
      experience: vet.experience.value,
      profilePhotoUrl: vet.profilePhotoUrl.value, // Changed from profilePhoto to profilePhotoUrl
      isVerified: vet.isVerified
    });
  });

  const formattedClinics = clinics.map(clinic => ({
    ...clinic, // Preserve all clinic properties
    veterinarian: vetMap.get(clinic.userId.toString()) || null
  }));

  res.status(200).json({
    success: true,
    count: formattedClinics.length,
    clinics: formattedClinics
  });
});

// Verify Clinic (admin)
const verifyClinic = catchAsync(async (req, res, next) => {
  const { clinicId } = req.params;
  console.log(clinicId)

  // Find the clinic
  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    console.log('Clinic not found');
    return next(new AppError('Clinic not found', 404));
  }

  // Check if already verified
  if (clinic.verified) {
    console.log('Clinic is already verified');
    return next(new AppError('Clinic is already verified', 400));
  }

  // Mark the clinic as verified
  clinic.verified = true;
  await clinic.save();

  res.status(200).json({
    success: true,
    message: 'Clinic verified successfully',
    clinic: {
      _id: clinic._id,
      isVerified: clinic.verified
    }
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
  createPet,
  registerVeterinarian,
  getUnverifiedVeterinarians,
  getVerifiedVeterinarians,
  verifyVeterinarianField,
  checkVeterinarianVerification,
  registerClinic,
  getUnverifiedClinics,
  getVerifiedClinics,
  verifyClinic
};