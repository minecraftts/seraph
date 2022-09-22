export default class NotImplementedError extends Error {
    constructor(method: string) {
        super(`${method} is not implemented.`);
    }
}