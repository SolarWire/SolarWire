# SolarWire Parser

## 安装

### 安装根项目依赖

```bash
cd SolarWire
npm install
```

### 安装 parser 包依赖

```bash
cd packages/parser
npm install
```

## 构建

```bash
cd packages/parser
npm run build
```

这会：
1. 使用 peggy 从 grammar.pegjs 生成 parser.js
2. 使用 TypeScript 编译源代码到 dist 目录

## 运行测试

```bash
cd packages/parser
npm test
```

## 使用

```typescript
import { parse } from '@solarwire/parser';

const ast = parse(`
!device=phone
["Login"] w=100 c=red
`);

console.log(ast);
```

## 开发流程

1. 修改 `src/grammar.pegjs` (语法文件)
2. 运行 `npm run generate` 重新生成解析器
3. 运行 `npm run build` 编译 TypeScript
4. 运行 `npm test` 验证修改

## 项目结构

```
packages/parser/
├── src/
│   ├── types.ts              # AST 类型定义
│   ├── grammar.pegjs         # PEG.js 语法规则
│   ├── index.ts              # 解析器入口
│   ├── parser.js             # 自动生成的解析器
│   └── __tests__/
│       └── basic.test.ts     # Jest 测试用例
├── dist/                     # 编译输出
├── package.json
├── tsconfig.json
└── jest.config.js
```
