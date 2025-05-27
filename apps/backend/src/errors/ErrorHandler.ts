import { INTERNAL_SERVER_ERROR_MESSAGE } from 'apps/backend/src/constants/errorMessages';
import { AppError } from 'apps/backend/src/errors/AppError';
import { FastifyReply, FastifyRequest } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import { StatusCodes } from 'http-status-codes';

export const ErrorHandler = (
    error: Error,
    request: FastifyRequest,
    response: FastifyReply
) => {
    request.log.error(error);

    if (error instanceof AppError) {
        return response
            .status(error.statusCode)
            .send({ message: error.message });
    }

    if (hasZodFastifySchemaValidationErrors(error)) {
        return response
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: error.message });
    }

    return response.status(500).send({
        message: INTERNAL_SERVER_ERROR_MESSAGE,
    });
};
