// validators/categoryValidator.js
import { body, param, validationResult } from 'express-validator';

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validator for creating a category
export const createCategoryValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    handleValidationErrors
];

// Validator for fetching a category by ID
export const getCategoryByIdValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    handleValidationErrors
];

// Validator for updating a category
export const updateCategoryValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    handleValidationErrors
];

// Validator for deleting a category
export const deleteCategoryValidator = [
    param('id')
        .isInt()
        .withMessage('ID must be an integer'),
    handleValidationErrors
];
