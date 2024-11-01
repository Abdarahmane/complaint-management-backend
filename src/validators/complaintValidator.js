// validators/complaintValidator.js
import { body, param, validationResult } from 'express-validator';

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validator for creating a complaint
export const createComplaintValidator = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string'),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isString()
        .withMessage('Description must be a string'),
    body('clientId')
        .notEmpty()
        .withMessage('Client ID is required')
        .isInt()
        .withMessage('Client ID must be an integer'),
    handleValidationErrors
];

// Validator for fetching a complaint by ID
export const getComplaintByIdValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    handleValidationErrors
];

// Validator for updating a complaint
export const updateComplaintValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    body('title')
        .optional()
        .isString()
        .withMessage('Title must be a string'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    body('clientId')
        .optional()
        .isInt()
        .withMessage('Client ID must be an integer'),
    handleValidationErrors
];

// Validator for deleting a complaint
export const deleteComplaintValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    handleValidationErrors
];
