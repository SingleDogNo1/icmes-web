// https://cz-git.qbb.sh/zh/config/
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scopes = fs
  .readdirSync(path.resolve(__dirname, 'src'), { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name.replace(/s$/, ''));

// precomputed scope
const scopeComplete = execSync('git status --porcelain || true')
  .toString()
  .trim()
  .split('\n')
  .find((r) => ~r.indexOf('M  src'))
  ?.replace(/(\/)/g, '%%')
  ?.match(/src%%((\w|-)*)/)?.[1]
  ?.replace(/s$/, '');

/** @type {import('cz-git').UserConfig} */
module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // 增加新功能
        'fix', // 修复问题/BUG
        'style', // 代码风格相关无影响运行结果的
        'perf', // 优化/性能提升
        'refactor', // 重构
        'revert', // 撤销修改
        'test', // 新增或修改测试用例
        'docs', // 修改文档/注释
        'chore', // 更改环境配置相关文件
        'workflow', // 工作流改进
        'ci', // 持续集成
        'wip', // 开发中
        'mod', // 不确定分类的修改
        'types', // 类型修改
        'release', // 版本发布
      ],
    ],
  },
  prompt: {
    /** @use `yarn commit :f` */
    alias: {
      f: 'docs: fix typos',
      r: 'docs: update README',
      s: 'style: update code format',
      b: 'build: bump dependencies',
      c: 'chore: update config',
    },
    customScopesAlign: !scopeComplete ? 'top' : 'bottom',
    defaultScope: scopeComplete,
    scopes: [...scopes, 'mock'],
    allowEmptyIssuePrefixs: false,
    allowCustomIssuePrefixs: false,
    allowCustomScopes: true,
    allowBreakingChanges: ['feat', 'fix'],
    emptyScopesAlias: 'empty:      不填写',
    customScopesAlias: 'custom:     自定义',
    messages: {
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围 (可选):',
      customScope: '请输入自定义的提交范围 :',
      subject: '填写简短精炼的变更描述 :\n',
      body: '填写更加详细的变更描述 (可选)。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更 (可选)。使用 "|" 换行 :\n',
      footerPrefixsSelect: '选择关联issue前缀 (可选):',
      customFooterPrefixs: '输入自定义issue前缀 :',
      footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
      confirmCommit: '是否提交或修改commit ?',
    },
    types: [
      { value: 'feat', name: '✨  feat:     添加新功能' },
      { value: 'fix', name: '🐛  fix:      修复BUG' },
      { value: 'docs', name: '📝  docs:     文档变更' },
      { value: 'style', name: '💄  style:    代码格式变动, 但不影响代码功能的更改' },
      { value: 'refactor', name: '♻️   refactor: 重构(既不是新增功能，也不是修改bug的代码变动)' },
      { value: 'perf', name: '⚡️  perf:     性能优化' },
      { value: 'test', name: '✅  test:     新增或修改测试用例' },
      {
        value: 'build',
        name: '📦️  build:    构建流程、外部依赖变更 (如升级 npm 包、修改打包配置等)',
      },
      { value: 'ci', name: '🔧  ci:       修改 CI 配置、脚本' },
      {
        value: 'chore',
        name: '🔨  chore:    对构建过程或辅助工具和库的更改 (不影响源文件、测试用例)',
      },
      { value: 'revert', name: '⏪️  revert:   回滚 commit' },
    ],
    typesAppend: [
      { value: 'workflow', name: '🗂   workflow: 工作流程改进' },
      { value: 'wip', name: '🥚  wip:      正在开发中' },
      { value: 'types', name: '🏷️   types:    类型定义文件修改' },
      { value: 'release', name: '🎥  release:  版本发布' },
      { value: 'mod', name: '🔍️  mod:      不确定类型的更改' },
    ],
  },
};
