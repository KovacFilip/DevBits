import { getDefaultUserJwt } from 'apps/backend/src/tests/unit/utils/post/commonUtils';
import { FastifyReply, FastifyRequest, RequestGenericInterface } from 'fastify';
import { ReplyGenericInterface } from 'fastify/types/reply';
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended';

export const getMockFastifyRequest = <T extends RequestGenericInterface>({
    Body,
    Headers,
    Params,
    Querystring,
}: T): DeepMockProxy<FastifyRequest<T>> => {
    const request = mockDeep<FastifyRequest<T>>();

    request.body = Body as any;
    request.headers = Headers as any;
    request.params = Params as any;
    request.query = Querystring as any;

    return request;
};

export const getMockFastifyRequestAuthenticated = <
    T extends RequestGenericInterface,
>({
    Body,
    Headers,
    Params,
    Querystring,
}: T): DeepMockProxy<FastifyRequest<T>> => {
    const request = mockDeep<FastifyRequest<T>>();

    request.body = Body as any;
    request.headers = Headers as any;
    request.params = Params as any;
    request.query = Querystring as any;

    request.user = getDefaultUserJwt();

    return request;
};

export const getMockFastifyRepsponse = <
    T extends ReplyGenericInterface,
>(): DeepMockProxy<FastifyReply<T>> => {
    return mockDeep<FastifyReply<T>>();
};
