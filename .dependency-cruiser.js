/** @type {import('dependency-cruiser').IConfiguration} */
// UI (Nx workspace) 模块依赖边界配置
// 验证 apps → packages 单向，库间按 tag 约束（与 Nx boundaries 对齐）
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      from: {
        orphan: true,
        pathNot: '\\.(spec|test|stories|d)\\.(ts|tsx|vue)$',
      },
      to: {},
    },
    {
      name: 'packages-must-not-import-apps',
      severity: 'error',
      comment: '库不得反向依赖 app',
      from: { path: 'packages/' },
      to: { path: 'apps/' },
    },
    {
      name: 'base-must-not-import-lowcode',
      severity: 'error',
      comment: 'luban-base 不得依赖 luban-low-code（方向相反）',
      from: { path: 'packages/luban-base/' },
      to: { path: 'packages/luban-low-code/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.base.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/[^/]+' },
      archi: { collapsePattern: 'node_modules/[^/]+' },
    },
  },
};
