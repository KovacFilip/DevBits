import { StatusCodes } from 'http-status-codes';
import { RepositoryError } from './RepositoryError';

export class DatabaseOperationError extends RepositoryError {
    constructor(operation: string, message?: string) {
        super(
            `Database error during "${operation}": ${message || 'Unknown error'}`,
            StatusCodes.INTERNAL_SERVER_ERROR
        );
        this.name = 'DatabaseOperationError';
    }
}
