import { FastifyRequest } from 'fastify';
import { Logger } from 'pino';

export function logControllerErrorTrace(options: {
    logger: Logger;
    controller: string;
    method: string;
    request: FastifyRequest;
}) {
    const { logger, controller: controller, method, request } = options;

    logger.error(
        {
            controller,
            method,
            request: {
                body: request.body,
                params: request.params,
                query: request.query,
                user: (request as any).user, // if user is attached to request
            },
        },
        `${controller}.${method} failed`
    );
}

export function logServiceErrorTrace(options: {
    logger: Logger;
    functionInput: any;
    service: string;
    method: string;
}) {
    const { logger, functionInput, method, service } = options;

    logger.error(
        {
            service,
            method,
            functionInput,
        },
        `${service}.${method} failed`
    );
}

export function logRepositoryErrorTrace(options: {
    logger: Logger;
    functionInput: any;
    repository: string;
    method: string;
}) {
    const { logger, functionInput, method, repository } = options;

    logger.error(
        {
            repository,
            method,
            functionInput,
        },
        `${repository}.${method} failed`
    );
}
