import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    clearMocks: true,
    passWithNoTests: true,
    setupFiles: ['./test/e2e/setup-e2e.ts'],
    include: ['**/*.e2e-spec.ts', '**/*.spec.ts'],
    coverage: {
      exclude: [
        'src/**/*.interface.ts',
        'src/**/*.error.ts',
        'src/**/*.types.ts',
        'src/common/*',
        'src/infra/db/*',
        'src/infra/env/*',
        'src/infra/http/*',
        'src/infra/gateways/*',
      ],
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text-summary', 'lcov', 'html'],
      enabled: true,
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
