'use strict';
module.exports = {
  types: [
    {
      value: 'feat',
      name: '✨  feat:         添加新功能',
    },
    {
      value: 'fix',
      name: '🐞  fix:          修复bug',
    },
    {
      value: 'style',
      name: '💅  style:        代码格式变动, 不影响代码功能的更改(修改空格/格式化代码等操作)',
    },
    {
      value: 'perf',
      name: '✂️   perf:         优化/性能提升',
    },
    {
      value: 'refactor',
      name: '🛠   refactor:     重构(既不是新增功能，也不是修改bug的代码变动)',
    },
    {
      value: 'revert',
      name: '⏪  revert:       撤销修改',
    },
    {
      value: 'test',
      name: '🏁  test:         新增或修改测试用例',
    },
    {
      value: 'docs',
      name: '📚  docs:         修改文档/注释',
    },
    {
      value: 'chore',
      name: '🗯   chore:        更改环境配置相关文件',
    },
    {
      value: 'workflow',
      name: '🗂   workflow:     工作流改进',
    },
    {
      value: 'ci',
      name: '🔗  ci:           持续集成',
    },
    {
      value: 'wip',
      name: '✏️   wip:          开发中',
    },
    {
      value: 'mod',
      name: '⁉️   mod:          不确定类型的更改',
    },
    {
      value: 'types',
      name: '⏰  types:        类型修改',
    },
    {
      value: 'release',
      name: '🎥  release:      版本发布',
    },
  ],
  scopes: [],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
};
