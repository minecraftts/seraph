export default class NotInitializedError extends Error {
    constructor() {
        super("seraph is not initialized");
    }
}