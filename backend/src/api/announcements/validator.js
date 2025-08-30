import { body, param, query, validationResult } from "express-validator";
import { ValidationError } from "../../exceptions/ValidationError.js";

export const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array());
    }
    next();
};

export const validateGetAllAnnouncements = [
    query("search").optional().isString().trim().isLength({ min: 1, max: 200 }),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1-100"),

    query("offset")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Offset must be a non-negative integer"),

    checkValidationResult,
];

export const validateGetAnnouncementById = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Announcement ID must be a positive integer"),

    checkValidationResult,
];

export const validateCreateAnnouncement = [
    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage("Title must be between 3-200 characters"),

    body("content_html")
        .notEmpty()
        .withMessage("Content is required")
        .isString()
        .trim()
        .isLength({ min: 10, max: 50000 })
        .withMessage("Content must be between 10-50000 characters"),

    body().custom((body) => {
        const allowedFields = ["title", "content_html"];
        const bodyKeys = Object.keys(body);
        const unexpectedFields = bodyKeys.filter(
            (key) => !allowedFields.includes(key)
        );

        if (unexpectedFields.length > 0) {
            throw new Error(
                `Unexpected fields: ${unexpectedFields.join(", ")}`
            );
        }

        return true;
    }),

    checkValidationResult,
];

export const validateUpdateAnnouncement = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Announcement ID must be a positive integer"),

    body("title")
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage("Title must be between 3-200 characters"),

    body("content_html")
        .notEmpty()
        .withMessage("Content is required")
        .isString()
        .trim()
        .isLength({ min: 10, max: 50000 })
        .withMessage("Content must be between 10-50000 characters"),

    body().custom((body) => {
        const allowedFields = ["title", "content_html"];
        const bodyKeys = Object.keys(body);
        const unexpectedFields = bodyKeys.filter(
            (key) => !allowedFields.includes(key)
        );

        if (unexpectedFields.length > 0) {
            throw new Error(
                `Unexpected fields: ${unexpectedFields.join(", ")}`
            );
        }

        return true;
    }),

    checkValidationResult,
];

export const validateDeleteAnnouncement = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Announcement ID must be a positive integer"),
    checkValidationResult,
];
