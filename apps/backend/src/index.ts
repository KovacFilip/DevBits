import * as dotenv from 'dotenv';
import fastify from 'fastify';
import path from 'path';
import { googleAuthRoutes } from './controllers/auth/GoogleAuthController';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const server = fastify({
    logger: true,
});

server.register(googleAuthRoutes);

/**
 * Run the server!
 */
const start = async () => {
    try {
        await server.listen({ port: 3000 });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
