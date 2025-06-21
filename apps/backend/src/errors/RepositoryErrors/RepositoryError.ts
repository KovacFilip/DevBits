import { AppError } from 'apps/backend/src/errors/AppError';
import { StatusCodes } from 'http-status-codes';

export class RepositoryError extends AppError {
    constructor(
        message: string,
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message, statusCode);
        this.name = 'RepositoryError';
    }
}
