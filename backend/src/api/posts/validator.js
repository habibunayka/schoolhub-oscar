import { body, param, validationResult } from "express-validator";
import { ValidationError } from "../../exceptions/ValidationError.js";

export const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array());
    }
    next();
};

export const validateListPosts = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Club ID must be a positive integer"),
    checkValidationResult,
];

export const validateGetPostById = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Club ID must be a positive integer"),
    param("postId")
        .isInt({ min: 1 })
        .withMessage("Post ID must be a positive integer"),
    checkValidationResult,
];

export const validateGetPost = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Post ID must be a positive integer"),

    checkValidationResult,
];

export const validateCreatePost = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Club ID must be a positive integer"),

    body("body_html")
        .notEmpty()
        .withMessage("Post body is required")
        .isString()
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage("Post body must be between 1-5000 characters"),

    body("visibility")
        .optional()
        .isIn(["public", "private", "members_only"])
        .withMessage(
            "Visibility must be one of: public, private, members_only"
        ),

    body("pinned")
        .optional()
        .custom((value) => {
            if (value === null || value === undefined) return true;
            if (![0, 1, true, false].includes(value)) {
                throw new Error("Pinned must be 0/1 or boolean");
            }
            return true;
        }),

    body("images")
        .optional()
        .isArray({ max: 10 })
        .withMessage("Images must be an array with maximum 10 items")
        .custom((arr) => {
            if (!arr.every((item) => typeof item === "string")) {
                throw new Error("All images must be string URLs");
            }
            return true;
        }),

    checkValidationResult,
];
