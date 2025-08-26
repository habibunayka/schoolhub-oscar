export class ValidationError extends Error {
    constructor(errors) {
        super("Validation error");
        this.name = "ValidationError";
        this.errors = errors;
    }
}
