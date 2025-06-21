import { StatusCodes } from 'http-status-codes';
import { RepositoryError } from './RepositoryError';

export class EntityNotFoundError extends RepositoryError {
    constructor(entityName: string, id: string) {
        super(
            `${entityName} with ID "${id}" was not found.`,
            StatusCodes.NOT_FOUND
        );
        this.name = 'EntityNotFoundError';
    }
}
