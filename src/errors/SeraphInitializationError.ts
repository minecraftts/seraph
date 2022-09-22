export default class SeraphInitializationError extends Error {
    constructor(message: string) {
        super(`failed to initialize seraph: ${message}`);
    }
}