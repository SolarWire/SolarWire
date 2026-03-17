# SolarWire SVG Renderer

SVG renderer for SolarWire DSL.

## Installation

### Install root project dependencies

```bash
cd SolarWire
npm install
```

### Install renderer-svg package dependencies

```bash
cd packages/renderer-svg
npm install
```

## Build

```bash
cd packages/renderer-svg
npm run build
```

## Run Tests

```bash
cd packages/renderer-svg
npm test
```

## Usage

```typescript
import { parse } from '@solarwire/parser';
import { render } from '@solarwire/renderer-svg';

const ast = parse(`
  ["Login"] w=200 h=60
  "Username" @(20, 80)
`);

const svg = render(ast);
console.log(svg);
```

## Project Structure

```
packages/renderer-svg/
├── src/
│   ├── index.ts              # Renderer entry point
│   ├── context.ts            # Context management and coordinate calculation
│   ├── renderer.ts           # Main rendering function
│   ├── elements/
│   │   ├── rectangle.ts      # Rectangle and rounded rectangle renderers
│   │   ├── otherElements.ts  # Other element renderers (circle, text, icon, placeholder, image, table)
│   │   └── lineAndContainer.ts  # Line and container renderers
│   └── __tests__/
│       ├── basic.test.ts     # Basic functionality tests
│       ├── defaults.test.ts  # Default styles tests
│       ├── generate-svg.test.ts  # Complete SVG generation test
│       ├── edge-cases.test.ts  # Edge case tests
│       └── performance.test.ts  # Performance and large file tests
├── dist/                     # Compiled output
├── complete-example.svg      # Generated example SVG
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Supported Elements

- Rectangle (`type: 'rectangle'`)
- Rounded rectangle (`type: 'rounded-rectangle'`)
- Circle (`type: 'circle'`)
- Plain text (`type: 'text'`)
- Icon (`type: 'icon'`) - with Material Icons and Font Awesome support
- Placeholder (`type: 'placeholder'`)
- Image (`type: 'image'`) - with beautiful placeholder rendering (mountain + sun)
- Line (`type: 'line'`) - with or without label
- Container (`type: 'row'` / `'col'`)
- Table (`type: 'table'`, `'table-row'`) - with colspan/rowspan support

## Attribute Support

- **Dimensions**: `w`, `h`, `s`, `r`, `size`, `line-height`, `gap`
- **Colors**: `c`, `bg`, `b`
- **Boolean attributes**: `bold`, `italic`, `hide`
- **Alignment**: `align` (l/c/r → start/middle/end)
- **Line style**: `style` (solid/dashed/dotted)
- **Table cells**: `colspan`, `rowspan`
- **Notes**: `note` - renders as badge + card at bottom

## Advanced Features

- ✅ **Note System**: Visual badges with numbers + card display at the bottom
- ✅ **Image Placeholders**: Beautiful mountain + sun icon when images can't be loaded
- ✅ **Icon Libraries**: Built-in Material Icons and Font Awesome
- ✅ **Global Defaults**: Document-level declarations for consistent styling
- ✅ **Multi-line Text**: Proper line wrapping with tspan elements
- ✅ **Table Colspan/Rowspan**: Full support for merged cells

## Development Workflow

1. Modify source code
2. Run `npm run build` to compile TypeScript
3. Run `npm test` to verify changes

## Testing

- 70+ comprehensive tests
- Edge case testing (empty elements, special characters, large content)
- Performance testing (100-500 elements, large tables)
- All tests passing!
