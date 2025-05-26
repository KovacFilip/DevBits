import { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from './AppError';

export const ErrorHandler = (
    error: Error,
    request: FastifyRequest,
    response: FastifyReply
) => {
    request.log.error(error);

    if (error instanceof AppError) {
        return response.status(error.statusCode).send({
            success: false,
            message: error.message || 'Internal server error',
        });
    }

    return response.status(500).send({
        success: false,
        message: 'Internal server error',
    });
};
