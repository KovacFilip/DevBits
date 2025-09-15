import { buildServer } from 'apps/backend/src/server/buildServer';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'ci') {
    dotenv.config();
}

const start = async () => {
    try {
        const server = await buildServer();
        await server.listen({ port: 3000 });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
