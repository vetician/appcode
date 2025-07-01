const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  registerParent,
  createPet,
  registerVeterinarian,
  getUnverifiedVeterinarians,
  getVerifiedVeterinarians
} = require('../controllers/authController');
const { auth, protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// const parentRegisterValidation = [
//   ...registerValidation, // Includes name, email, password from registerValidation
//   body('phone')
//     .trim()
//     .isLength({ min: 10, max: 15 })
//     .withMessage('Phone must be between 10 and 15 digits')
//     .isNumeric()
//     .withMessage('Phone must contain only numbers'),
//   body('address')
//     .trim()
//     .isLength({ min: 10 })
//     .withMessage('Address must be at least 10 characters long'),
// ];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/parent-register', registerParent);
router.post('/veterinarian-register', registerVeterinarian);
router.post('/admin/verified', getVerifiedVeterinarians);
router.post('/admin/unverified', getUnverifiedVeterinarians);
router.post('/pet-register', createPet);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth, logout);
router.post('/logout-all', auth, logoutAll);


module.exports = router;