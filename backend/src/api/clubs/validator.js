import { body, param, query, validationResult } from "express-validator";
import { ValidationError } from "../../exceptions/ValidationError.js";

export const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array());
    }
    next();
};

export const validateListClubs = [
    query("search")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Search must be a string with maximum 100 characters"),

    query("tag")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Tag must be a string with maximum 50 characters"),

    query("day")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 20 })
        .withMessage("Day must be a string with maximum 20 characters"),

    checkValidationResult,
];

export const validateCreateClub = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2-100 characters"),

    body("slug")
        .notEmpty()
        .withMessage("Slug is required")
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Slug must be between 2-100 characters")
        .matches(/^[a-z0-9-]+$/)
        .withMessage(
            "Slug must contain only lowercase letters, numbers, and hyphens"
        ),

    body("description")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 5000 })
        .withMessage("Description must not exceed 5000 characters"),

    body("advisor_name")
        .notEmpty()
        .withMessage("Advisor name is required")
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Advisor name must be between 2-100 characters"),

    body().custom((body) => {
        const allowedFields = ["name", "slug", "description", "advisor_name"];
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

export const validatePatchClub = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Club ID must be a positive integer"),

    body("name")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2-100 characters"),

    body("slug")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Slug must be between 2-100 characters")
        .matches(/^[a-z0-9-]+$/)
        .withMessage(
            "Slug must contain only lowercase letters, numbers, and hyphens"
        ),

    body("description")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 5000 })
        .withMessage("Description must not exceed 5000 characters"),

    body("logo_url")
        .optional()
        .isURL({ protocols: ["http", "https"] })
        .withMessage("Logo URL must be a valid HTTP/HTTPS URL")
        .isLength({ max: 500 })
        .withMessage("Logo URL must not exceed 500 characters"),

    body("banner_url")
        .optional()
        .isURL({ protocols: ["http", "https"] })
        .withMessage("Banner URL must be a valid HTTP/HTTPS URL")
        .isLength({ max: 500 })
        .withMessage("Banner URL must not exceed 500 characters"),

    body("advisor_name")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Advisor name must be between 2-100 characters"),

    body().custom((body) => {
        const allowedFields = [
            "name",
            "slug",
            "description",
            "logo_url",
            "banner_url",
            "advisor_name",
        ];
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

export const validateJoinClub = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Club ID must be a positive integer"),

    body().custom((body) => {
        const bodyKeys = Object.keys(body);
        if (bodyKeys.length > 0) {
            throw new Error(
                `Unexpected fields in request body: ${bodyKeys.join(", ")}`
            );
        }
        return true;
    }),

    checkValidationResult,
];

export const validateSetMemberStatus = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Club ID must be a positive integer"),

    param("userId")
        .isInt({ min: 1 })
        .withMessage("User ID must be a positive integer"),

    body("decision")
        .notEmpty()
        .withMessage("Decision is required")
        .isIn(["approved", "rejected"])
        .withMessage('Decision must be either "approved" or "rejected"'),

    body().custom((body) => {
        const allowedFields = ["decision"];
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

export const validatePatchHasFields = (req, res, next) => {
    const allowedFields = [
        "name",
        "slug",
        "description",
        "logo_url",
        "banner_url",
        "advisor_name",
    ];
    const hasValidField = allowedFields.some((field) =>
        req.body.hasOwnProperty(field)
    );

    if (!hasValidField) {
        throw new ValidationError([
            {
                msg: "At least one field must be provided for update",
                param: "body",
                value: req.body,
                allowedFields,
            },
        ]);
    }

    next();
};
