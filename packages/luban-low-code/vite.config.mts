/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import * as path from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/luban-low-code',
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  // 测试期将 luban-base 别名指向源码（构建时内联进 dist，不再 external）。
  // v02 修复：原 external: ['luban-base'] 导致 dist 含 bare specifier 'from "luban-base"'，
  // 外部消费者（website/engine）Vite7 commonjs resolver 解析 luban-base 包入口失败。
  // 改为内联：luban-low-code dist 自包含 luban-base 组件，消费者无需再解析 luban-base。
  resolve: {
    alias: {
      'luban-base': path.resolve(import.meta.dirname, '../luban-base/src/index.ts'),
    },
  },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
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
    },
  },
}));
