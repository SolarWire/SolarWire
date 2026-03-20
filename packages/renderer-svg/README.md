# SolarWire SVG Renderer

SVG renderer for SolarWire DSL.

## Installation

### Install root project dependencies

```bash
cd SolarWire
npm install
```

## Build

```bash
cd packages/renderer-svg
npm run build
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
│   └── elements/
│       ├── rectangle.ts      # Rectangle and rounded rectangle renderers
│       ├── otherElements.ts  # Other element renderers (circle, text, placeholder, image, table)
│       └── lineAndContainer.ts  # Line and container renderers
├── dist/                     # Compiled output
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Supported Elements

- Rectangle (`type: 'rectangle'`)
- Rounded rectangle (`type: 'rounded-rectangle'`)
- Circle (`type: 'circle'`)
- Plain text (`type: 'text'`)
- Placeholder (`type: 'placeholder'`) - with diagonal crosshairs
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

- ✅ **Note System**: Visual badges (teardrop shaped) with numbers + card display at the bottom
- ✅ **Image Placeholders**: Beautiful mountain + sun icon when images can't be loaded
- ✅ **Global Defaults**: Document-level declarations for consistent styling
- ✅ **Multi-line Text**: Proper line wrapping with tspan elements
- ✅ **Table Colspan/Rowspan**: Full support for merged cells
- ✅ **Adaptive Sizing**: Canvas automatically fits to content - no manual width/height needed!

## Development Workflow

1. Modify source code
2. Run `npm run build` to compile TypeScript

## License

MIT © SolarWire contributors
