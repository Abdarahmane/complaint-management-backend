import { check, validationResult } from 'express-validator';
import { getUsers } from '../controllers/userController.js';

// Validator for creating a user
export const createUserValidator = [
  check('email')
    .isEmail()
    .withMessage('Invalid email format.'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validator for retrieving a user by ID
export const getUserByIdValidator = [
  check('id')
    .isInt()
    .withMessage('User ID must be an integer.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validator for updating a user (assuming only email and password are updated)
export const updateUserValidator = [
  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format if provided.'),
  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long if provided.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validator for deleting a user by ID
export const deleteUserValidator = [
  check('id')
    .isInt()
    .withMessage('User ID must be an integer.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
