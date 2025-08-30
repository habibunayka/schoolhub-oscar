import { body, param, query, validationResult } from "express-validator";
import { ValidationError } from "../../exceptions/ValidationError.js";

const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array());
    }
    next();
};

export const validateListCategories = [
    query("withClubs").optional().isBoolean().toBoolean(),
    checkValidationResult,
];

export const validateCreateCategory = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters"),
    checkValidationResult,
];

export const validatePatchCategory = [
    param("id").isInt({ min: 1 }).withMessage("ID must be positive"),
    body("name")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters"),
    checkValidationResult,
];

export const validateGetCategory = [
    param("id").isInt({ min: 1 }).withMessage("ID must be positive"),
    checkValidationResult,
];

export default {
    validateListCategories,
    validateCreateCategory,
    validatePatchCategory,
    validateGetCategory,
};
