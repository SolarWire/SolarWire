# SolarWire Parser

Parser for SolarWire DSL, built with Peggy (PEG.js).

## Installation

Install from GitHub:

```bash
npm install github:SolarWire/SolarWire#v1.6.1
```

## Usage

```javascript
const { parse } = require('solarwire');

const ast = parse(`
!title="My Wireframe"
["Login"] w=100 c=red
`);

console.log(ast);
```

## Development Workflow

1. Modify `src/grammar.pegjs` (grammar file)
2. Run `npm run generate` to regenerate the parser
3. Run `npm run build` to compile TypeScript

## Project Structure

```
packages/parser/
├── src/
│   ├── types.ts              # AST type definitions
│   ├── grammar.pegjs         # PEG.js grammar rules
│   ├── index.ts              # Parser entry point
│   ├── parser.js             # Auto-generated parser
│   └── preprocessor.js       # Preprocessor for SolarWire code
├── dist/                     # Compiled output
├── generate-parser.js        # Parser generation script
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
- ✅ Multi-line text support (\n and triple quotes)
- ✅ Table cell attributes (colspan, rowspan)
- ✅ Note attribute support

## Grammar Overview

The parser supports:
- **Elements**: Rectangles `[]`, rounded rectangles `()`, circles `(())`, text `""`, placeholders `[?]`, images `<url>`, lines `--`, containers `{row}/{col}`, tables `##`
- **Coordinates**: Absolute `@(100,50)`, relative `@(0,+30)`, edge-relative `@(R+5,T+0)`
- **Attributes**: Key-value pairs `w=100`, `c=red`, `bg=#ffffff`
- **Declarations**: Document-level settings `!title="Title"`, `!c=#333`
- **Comments**: Single line `// comment`

## License

MIT © SolarWire contributors
