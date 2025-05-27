import { AppError } from 'apps/backend/src/errors/AppError';
import { StatusCodes } from 'http-status-codes';

export class NotFoundError extends AppError {
    constructor(message?: string) {
        super(message, StatusCodes.NOT_FOUND);
    }
}
