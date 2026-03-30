# SolarWire Support - VS Code Extension

VS Code extension for SolarWire DSL, providing syntax highlighting, snippets, real-time preview, and more!

## Installation

### From VS Code Marketplace

Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=SolarWire.solarwire-support) or search for "SolarWire Support" in the Extensions panel.

- ✅ **Syntax Highlighting** – Color-coded SolarWire code for better readability
- ✅ **Snippets** – Quick code snippets for common elements
- ✅ **Real-time Preview** – Live preview panel that updates as you type
- ✅ **Diagnostics** – Error highlighting with detailed messages
- ✅ **Auto-completion** – Smart suggestions for elements, attributes, and declarations
- ✅ **Hover Information** – Documentation when hovering over elements and attributes
- ✅ **Export** – Export to SVG and PNG formats

## Installation

### From Source

1. Clone the repository
2. Run `npm install` in the root directory
3. Run `npm run build` to compile all packages
4. Open the `packages/vscode-extension` folder in VS Code
5. Press `F5` to launch the Extension Development Host
6. Open a `.solarwire` or `.md` file to use the extension

## Commands

- `SolarWire: Open Preview` – Open the real-time preview panel
- `SolarWire: Export SVG` – Export the current document as SVG
- `SolarWire: Export PNG` – Export the current document as PNG

## Usage

1. Create a new file with the `.solarwire` extension, or use in `.md` files
2. Start writing SolarWire code – syntax highlighting will work automatically
3. Use `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and select "SolarWire: Open Preview" to see the live preview
4. The preview updates automatically as you type
5. Use auto-completion (Ctrl+Space) to get suggestions for elements and attributes
6. Hover over elements and attributes to see documentation
7. Any parsing errors will be highlighted in red with detailed messages

## Snippets

The extension provides the following snippets:

- `rect` – Rectangle element: `["text"]`
- `round` – Rounded rectangle: `("text")`
- `circle` – Circle element: `(("text"))`
- `text` – Text element: `"text"`
- `placeholder` – Placeholder element: `[?"text"]`
- `image` – Image element: `<url>`
- `line` – Line element: `-- @(x1,y1)->(x2,y2)`
- `row` – Row container: `{row}`
- `col` – Column container: `{col}`
- `table` – Table element: `##`
- `tablerow` – Table row: `#`

## Auto-completion

The extension provides smart auto-completion for:

- **Elements**: All SolarWire element types with snippets
- **Attributes**: Common attributes for each element type
- **Declarations**: Document-level declarations at the top of the file

## Diagnostics

The extension provides real-time error diagnostics:

- Parsing errors are highlighted with red squiggles
- Error messages show the exact line and column
- Errors update automatically as you type
- Hover over errors to see detailed messages

## Export

### SVG Export

1. Open a `.solarwire` file
2. Use `Ctrl+Shift+P` and select "SolarWire: Export SVG"
3. Choose a location to save the SVG file
4. Alternatively, click the "Download SVG" button in the preview panel

### PNG Export

1. Open a `.solarwire` file
2. Use `Ctrl+Shift+P` and select "SolarWire: Export PNG"
3. Preview the PNG in the webview panel
4. Click "Save PNG" to choose a location
5. The PNG is exported at 2x resolution for crispness

## Example

```solarwire
!title="My Wireframe"

["Header"] @(50,50) w=700 h=80 bg=#4CAF50 c=white
["Content"] @(50,150) w=700 h=400
["Footer"] @(50,570) w=700 h=60 bg=#333 c=white
```

## Development

### Build

```bash
cd packages/vscode-extension
npm run build
```

### Project Structure

```
packages/vscode-extension/
├── src/
│   └── extension.ts        # Main extension code
├── lib/
│   ├── parser/             # Parser library (compiled)
│   └── renderer-svg/       # SVG renderer library (compiled)
├── syntaxes/
│   └── solarwire.tmLanguage.json  # Syntax highlighting grammar
├── snippets/
│   └── solarwire.json     # Code snippets
├── media/
│   └── solarwire-markdown.js  # Preview panel scripts
├── language-configuration.json  # Language configuration
├── package.json
├── tsconfig.json
└── readme.md
```

## License

MIT © SolarWire contributors
