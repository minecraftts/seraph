export default class GlewInitializationError extends Error {
    constructor(message?: string) {
        super(`failed to initialize glew${typeof message === "string" ? `: ${message}` : ""}`);
    }
}