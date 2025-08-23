import { query, validationResult } from "express-validator";
import { ValidationError } from "../../exceptions/ValidationError";

export const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array());
    }
    next();
};

export const validateListNotifications = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1-100"),

    query("status")
        .optional()
        .isIn(["read", "unread", "all"])
        .withMessage("Status must be one of: read, unread, all"),

    query("type")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Type must be between 1-50 characters"),

    checkValidationResult,
];
