import { StatusCodes } from 'http-status-codes';
import { RepositoryError } from './RepositoryError';

export class EntityAlreadyDeletedError extends RepositoryError {
    constructor(entityName: string, id: string) {
        super(
            `${entityName} with ID "${id}" is already deleted.`,
            StatusCodes.CONFLICT
        );
        this.name = 'EntityAlreadyDeletedError';
    }
}
