/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      outDir: 'dist/types',
      tsconfigPath: 'tsconfig.lib.json',
      staticImport: true,
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      'luban-base': resolve(__dirname, '../luban-base/src'),
      'luban-base': resolve(__dirname, '../luban-base/src'),
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'luban-low-code',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es' as const],
    },
    rollupOptions: {
      // 仅 vue 外部化；luban-base 内联进 dist（修复外部消费者 resolver 失败）
      external: ['vue'],
    },
  },
  test: {
    name: 'luban-low-code',
    watch: false,
    globals: true,
    environment: 'jsdom',
    // 单元测试和 e2e 测试都放在 packages/luban-low-code/test 下
    include: ['{src,test}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
      reporter: ['text', 'html', 'lcov'],
      thresholds: { lines: 20, functions: 20, branches: 20, statements: 20 },
    },
  },
});
