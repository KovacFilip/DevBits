import { AppError } from 'apps/backend/src/errors/AppError';
import { StatusCodes } from 'http-status-codes';

export class UnauthorizedError extends AppError {
    constructor(message?: string) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}
