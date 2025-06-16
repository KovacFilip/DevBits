import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
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
