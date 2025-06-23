import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        include: ['src/tests/integration/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'lcov'],
            include: [
                '**/src/repositories/**',
                '**/src/services/**',
                '**/src/controllers/**',
            ],
        },
    },
});
