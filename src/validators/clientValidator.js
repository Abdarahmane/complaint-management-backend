// validators/clientValidator.js
import { body, param, validationResult } from 'express-validator';

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validator for creating a client
export const createClientValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Phone number must be valid'),
    handleValidationErrors
];

// Validator for fetching a client by ID
export const getClientByIdValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    handleValidationErrors
];

// Validator for updating a client
export const updateClientValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Phone number must be valid'),
    handleValidationErrors
];

// Validator for deleting a client
export const deleteClientValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    handleValidationErrors
];
