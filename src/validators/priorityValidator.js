// validators/priorityValidator.js
import { body, param, validationResult } from 'express-validator';

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validator for creating a priority
export const createPriorityValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),
    body('level')
        .notEmpty()
        .withMessage('Level is required')
        .isInt()
        .withMessage('Level must be an integer'),
    handleValidationErrors
];

// Validator for fetching a priority by ID
export const getPriorityByIdValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    handleValidationErrors
];

// Validator for updating a priority
export const updatePriorityValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string'),
    body('level')
        .optional()
        .isInt()
        .withMessage('Level must be an integer'),
    handleValidationErrors
];

// Validator for deleting a priority
export const deletePriorityValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    handleValidationErrors
];
