import { INTERNAL_SERVER_ERROR_MESSAGE } from 'apps/backend/src/constants/errorMessages';
import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
    statusCode: number;

    constructor(
        message = INTERNAL_SERVER_ERROR_MESSAGE,
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message);
        this.statusCode = statusCode;
    }
}
