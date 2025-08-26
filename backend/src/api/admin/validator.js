import { body, validationResult } from "express-validator";
import { ValidationError } from "../../exceptions/ValidationError.js";

export const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array());
    }
    next();
};

const allowedEntities = ["users", "posts"];

export const validateTakedown = [
    body("entity_type")
        .notEmpty()
        .withMessage("Entity type is required")
        .isString()
        .trim()
        .isIn(allowedEntities)
        .withMessage(
            `Entity type must be one of: ${allowedEntities.join(", ")}`
        ),

    body("entity_id")
        .notEmpty()
        .withMessage("Entity ID is required")
        .isInt({ min: 1 })
        .withMessage("Entity ID must be a positive integer"),

    body().custom((body) => {
        const allowedFields = ["entity_type", "entity_id"];
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
