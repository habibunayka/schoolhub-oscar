import { body, param, validationResult } from "express-validator";
import { ValidationError } from "../../exceptions/ValidationError.js";

export const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array());
    }
    next();
};

export const validateListEvents = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Club ID must be a positive integer"),

    checkValidationResult,
];

export const validateCreateEvent = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Club ID must be a positive integer"),

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
        .trim()
        .isLength({ max: 5000 })
        .withMessage("Description must not exceed 5000 characters"),

    body("location")
        .notEmpty()
        .withMessage("Location is required")
        .isString()
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage("Location must be between 2-200 characters"),

    body("start_at")
        .notEmpty()
        .withMessage("Start date/time is required")
        .isISO8601()
        .withMessage("Start date must be a valid ISO 8601 datetime")
        .custom((value) => {
            const startDate = new Date(value);
            const now = new Date();
            if (startDate <= now) {
                throw new Error("Start date must be in the future");
            }
            return true;
        }),

    body("end_at")
        .notEmpty()
        .withMessage("End date/time is required")
        .isISO8601()
        .withMessage("End date must be a valid ISO 8601 datetime")
        .custom((value, { req }) => {
            const endDate = new Date(value);
            const startDate = new Date(req.body.start_at);
            if (endDate <= startDate) {
                throw new Error("End date must be after start date");
            }
            return true;
        }),

    body("capacity")
        .optional()
        .custom((value) => {
            if (value === null || value === undefined) return true;
            if (!Number.isInteger(Number(value)) || Number(value) < 1) {
                throw new Error("Capacity must be a positive integer or null");
            }
            return true;
        }),

    body("require_rsvp")
        .optional()
        .isBoolean()
        .withMessage("Require RSVP must be a boolean value"),

    body("visibility")
        .optional()
        .isIn(["public", "private", "members_only"])
        .withMessage(
            "Visibility must be one of: public, private, members_only"
        ),

    checkValidationResult,
];

export const validateRsvpEvent = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Event ID must be a positive integer"),

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["going", "interested", "declined"])
        .withMessage("Status must be one of: going, interested, declined"),

    checkValidationResult,
];

export const validateCheckinEvent = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Event ID must be a positive integer"),

    body("code")
        .notEmpty()
        .withMessage("Check-in code is required")
        .isString()
        .trim()
        .isLength({ min: 6, max: 12 })
        .withMessage("Check-in code must be between 6-12 characters")
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage("Check-in code must contain only letters and numbers"),

    checkValidationResult,
];

export const validateReviewEvent = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Event ID must be a positive integer"),

    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),

    body("comment")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Comment must not exceed 1000 characters"),

    checkValidationResult,
];
