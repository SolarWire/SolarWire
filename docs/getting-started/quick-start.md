# Quick Start

Get started with SolarWire in minutes.

## Try Online

The fastest way to try SolarWire is using our online playground:

::: info Coming Soon
Online playground is under development. For now, use the methods below.
:::

## Installation

### Option 1: VSCode Extension

1. Install the [SolarWire extension](https://marketplace.visualstudio.com/items?itemName=solarwire.solarwire) from VS Code Marketplace
2. Open a `.solarwire` file or a Markdown file
3. Start writing SolarWire code!

### Option 2: NPM Package

```bash
npm install @solarwire/parser @solarwire/renderer-svg
```

### Option 3: Manual Download

Download the latest release from [GitHub Releases](https://github.com/SolarWire/SolarWire/releases).

## Your First Wireframe

Create a file named `hello.solarwire`:

```solarwire
!title="Hello World"

[] @(0,0) w=400 h=300 bg=#fff

"Hello, SolarWire!" @(100,100) size=24 bold

["Click Me"] @(150,180) w=100 h=40 bg=#3498db c=white
```

## Render to SVG

### Using Node.js

```javascript
const { parse } = require('@solarwire/parser');
const { render } = require('@solarwire/renderer-svg');

const code = `
!title="Hello World"

[] @(0,0) w=400 h=300 bg=#fff

"Hello, SolarWire!" @(100,100) size=24 bold

["Click Me"] @(150,180) w=100 h=40 bg=#3498db c=white
`;

const ast = parse(code);
const svg = render(ast);

console.log(svg);
```

### Using VSCode Extension

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Run "SolarWire: Show Preview"
3. Or use "SolarWire: Export to SVG"

## In Markdown

SolarWire works great in Markdown files:

````markdown
# My PRD

## Login Page

```solarwire
!title="Login Page"

[] @(0,0) w=400 h=500 bg=#fff

"Email" @(50,150)
["Enter email"] @(50,175) w=300 h=44

"Password" @(50,250)
["Enter password"] @(50,275) w=300 h=44

["Sign In"] @(50,350) w=300 h=48 bg=#3498db c=white
```
````

## Next Steps

- [Basic Syntax](/getting-started/basic-syntax) - Learn the fundamentals
- [Elements](/reference/elements) - Explore all available elements
- [Examples](/examples/login-form) - See real-world examples
