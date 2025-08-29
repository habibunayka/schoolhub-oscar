import { body, validationResult } from "express-validator";
import { ValidationError } from "../../exceptions/ValidationError.js";

export const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array());
    }
    next();
};

export const validateCreateAchievement = [
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage("Title must be between 3-200 characters"),
    body("description")
        .optional()
        .isString()
        .isLength({ max: 1000 })
        .withMessage("Description must be at most 1000 characters"),
    body().custom((body) => {
        const allowed = ["title", "description"];
        const keys = Object.keys(body);
        const unexpected = keys.filter((k) => !allowed.includes(k));
        if (unexpected.length) {
            throw new Error(`Unexpected fields: ${unexpected.join(", ")}`);
        }
        return true;
    }),
    checkValidationResult,
];
