import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./config/vitest.setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
        pool: 'threads',
        // @ts-expect-error - poolOptions types are incomplete in vitest 4
        poolOptions: {
            threads: {
                singleThread: true,
            },
        },
    },
})
