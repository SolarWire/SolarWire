# Installation

## Requirements

- Node.js 18+ (for npm packages)
- VSCode 1.80+ (for VSCode extension)

## Installation Methods

### 1. VSCode Extension

#### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "SolarWire"
4. Click Install

#### From VSIX File

1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/SolarWire/SolarWire/releases)
2. Open VS Code
3. Open Command Palette (`Ctrl+Shift+P`)
4. Run "Extensions: Install from VSIX..."
5. Select the downloaded file

### 2. NPM Packages

#### Parser

```bash
npm install @solarwire/parser
```

#### SVG Renderer

```bash
npm install @solarwire/renderer-svg
```

#### Both

```bash
npm install @solarwire/parser @solarwire/renderer-svg
```

### 3. CDN (Browser)

```html
<script src="https://unpkg.com/@solarwire/parser/dist/index.js"></script>
<script src="https://unpkg.com/@solarwire/renderer-svg/dist/index.js"></script>
```

## Verify Installation

### Node.js

```javascript
const { parse } = require('@solarwire/parser');
const { render } = require('@solarwire/renderer-svg');

const ast = parse('["Hello"] @(0,0) w=100 h=40');
const svg = render(ast);

console.log(svg);
```

### VSCode Extension

1. Create a new file with `.solarwire` extension
2. Type `["Button"] @(0,0)`
3. You should see syntax highlighting

## Next Steps

- [Quick Start](/getting-started/quick-start) - Create your first wireframe
- [Elements](/reference/elements) - Explore all available elements
