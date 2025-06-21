import { buildServer } from 'apps/backend/src/server/buildServer';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
