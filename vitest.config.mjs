import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    fileParallelism: false,
    environment: 'jsdom',
    passWithNoTests: true,
    include: ['src/**/*.test.ts','src/**/*.test.tsx'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'],
    setupFiles: ['test/utils/init.ts'],
    globalSetup: ['test/utils/globalSetup.ts'],
    // The Forms feature is gated behind FEATURE_FORMS. Enable it for the test
    // suite so the forms collections/endpoints are registered when the Payload
    // config is built. Set here (not in a setup file) because the config module
    // reads the flag at import time, before setupFiles run.
    env: {
      FEATURE_FORMS: 'enabled',
    },
    sequence: {
      hooks: 'stack'
    }
  },
})
