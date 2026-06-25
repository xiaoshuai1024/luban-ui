import nx from '@nx/eslint-plugin';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  // Vue SFC 解析支持（所有子包共享，修复预存的 .vue parsing error）
  ...vuePlugin.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      // LubanPage.vue 动态 <style> 注入是合法场景
      'vue/no-v-text-v-html-on-component': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // low-code 可依赖 base（引擎消费基础组件）
            {
              sourceTag: 'lib:low-code',
              onlyDependOnLibsWithTags: [
                'lib:base',
                'lib:utils',
                'type:library',
              ],
            },
            // base 是叶子库，不依赖内部其他库
            {
              sourceTag: 'lib:base',
              onlyDependOnLibsWithTags: ['lib:utils'],
            },
            // utils 是工具叶子库
            {
              sourceTag: 'lib:utils',
              onlyDependOnLibsWithTags: [],
            },
            // format-utils（scope:format）依赖 utils
            {
              sourceTag: 'scope:format',
              onlyDependOnLibsWithTags: ['lib:utils'],
            },
            // app 可消费所有库
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'lib:base',
                'lib:low-code',
                'lib:utils',
                'type:library',
                'type:app',
              ],
            },
            // 兜底：未标记的源必须只依赖已标记库
            {
              sourceTag: 'type:library',
              onlyDependOnLibsWithTags: [
                'type:library',
                'lib:base',
                'lib:utils',
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
