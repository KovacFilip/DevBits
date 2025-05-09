export class UnableToCreateUserError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'UnableToCreateUserError';
    }
}
