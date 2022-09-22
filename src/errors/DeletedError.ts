export default class DeletedError extends Error {
    constructor() {
        super("object already deleted");
    }
}