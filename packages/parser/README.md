# SolarWire Parser

Parser for SolarWire DSL, built with Peggy (PEG.js).

## Installation

### Install root project dependencies

```bash
cd SolarWire
npm install
```

### Install parser package dependencies

```bash
cd packages/parser
npm install
```

## Build

```bash
cd packages/parser
npm run build
```

This will:
1. Generate parser.js from grammar.pegjs using Peggy
2. Compile TypeScript source to dist directory

## Run Tests

```bash
cd packages/parser
npm test
```

## Usage

```typescript
import { parse } from '@solarwire/parser';

const ast = parse(`
!title="My Wireframe"
!width=800
!height=600
["Login"] w=100 c=red
`);

console.log(ast);
```

## Development Workflow

1. Modify `src/grammar.pegjs` (grammar file)
2. Run `npm run generate` to regenerate the parser
3. Run `npm run build` to compile TypeScript
4. Run `npm test` to verify changes

## Project Structure

```
packages/parser/
├── src/
│   ├── types.ts              # AST type definitions
│   ├── grammar.pegjs         # PEG.js grammar rules
│   ├── index.ts              # Parser entry point
│   ├── parser.js             # Auto-generated parser
│   ├── preprocessor.js       # Preprocessor for SolarWire code
│   └── __tests__/
│       ├── basic.test.ts     # Basic functionality tests
│       └── nested.test.ts    # Nested element tests
├── dist/                     # Compiled output
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Features

- ✅ Complete grammar for all SolarWire elements
- ✅ AST generation with rich type definitions
- ✅ Support for document-level declarations
- ✅ Flexible coordinate system parsing
- ✅ Attribute parsing (colors, sizes, booleans)
- ✅ Multi-line text support (\\n and triple quotes)
- ✅ Table cell attributes (colspan, rowspan)
- ✅ Note attribute support
- ✅ 26 comprehensive tests

## Grammar Overview

The parser supports:
- **Elements**: Rectangles `[]`, rounded rectangles `()`, circles `(())`, text `""`, icons `!icon`, placeholders `[?]`, images `<url>`, lines `--`, containers `{row}/{col}`, tables `##`
- **Coordinates**: Absolute `@(100,50)`, relative `@(0,+30)`, edge-relative `@(R+5,T+0)`
- **Attributes**: Key-value pairs `w=100`, `c=red`, `bg=#ffffff`
- **Declarations**: Document-level settings `!width=800`, `!c=#333`
- **Comments**: Single line `// comment`
