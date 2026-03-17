# SolarWire

**SolarWire** is a lightweight, Markdown-style DSL for rapidly creating UI wireframes. It's designed with two goals in mind: **human readability** and **AI friendliness**, all while keeping everything in plain text for version control.

- ✨ **Minimal syntax** – Express common UI elements with just a few characters.
- 🤖 **AI-native** – The syntax feels natural for language models; they can generate and modify wireframes directly.
- 📦 **Plain text** – Git-friendly, easily embeddable in technical documentation.
- 🎨 **Complete implementation** – Parser, SVG/HTML renderers, and VS Code extension are all ready to use!

## 🚀 Features

### Core Language
- ✅ Complete parser built with Peggy (PEG.js)
- ✅ SVG renderer with full element support
- ✅ HTML renderer for web display
- ✅ Rich attribute system (colors, sizes, styling)
- ✅ Flexible coordinate system (absolute, relative, edge-relative)

### UI Elements
- ✅ Rectangles, rounded rectangles, circles
- ✅ Text elements with bold/italic styling
- ✅ Icons with Material Icons and Font Awesome support
- ✅ Placeholders and images (with fallback rendering)
- ✅ Lines with labels and styling
- ✅ Row and column containers with gap control
- ✅ Tables with colspan/rowspan support

### Advanced Features
- ✅ **Note system** – Visual badges + card display at the bottom
- ✅ Document-level declarations for global defaults
- ✅ Multi-line text support (\\n and triple quotes)
- ✅ Image placeholder rendering with mountain/sun icon

### VS Code Extension
- ✅ Syntax highlighting
- ✅ Snippets for quick coding
- ✅ Real-time preview panel
- ✅ Diagnostics and error highlighting
- ✅ Auto-completion for elements, attributes, declarations
- ✅ Hover information for documentation
- ✅ Export to SVG and PNG

### Testing
- ✅ 70+ comprehensive tests
- ✅ Edge case testing
- ✅ Performance testing (supports large files)
- ✅ All tests passing!

---

## Syntax

### Document-level declarations

Place these at the top of your file (one per line) to set global defaults:

```
!title="My Wireframe"    // Document title
!width=1000              // Canvas width
!height=800              // Canvas height
!c=#333                   // Default text color
!size=12                  // Default font size
!line-height=22           // Default line height
!gap=12                   // Default container gap
!bg=#f8f8f8               // Default background for rectangles
!r=6                      // Default corner radius for rounded rectangles
!icon-library="material-icons"  // Default icon library
!bold                     // Make all text bold by default
```

Any standard attribute can be used as a global default. Local attributes override them.

### Basic elements

| Symbol | Meaning | Example |
|--------|---------|---------|
| `[]` | Rectangle (with text) | `["Login"]` |
| `()` | Rounded rectangle | `("Card")` |
| `(())` | Circle | `((Avatar))` |
| `"text"` | Plain text (no border) | `"Username"` |
| `!icon` | Icon | `!icon "home"` |
| `[?]` | Placeholder | `[?"Ad space"]` |
| `--` | Line (no label) | `-- @(10,10)->(100,10)` |
| `--"label"--` | Line with label | `--"connect"-- @(10,10)->(100,20)` |
| `<url>` | Image | `<logo.png> w=32` |
| `{row}` | Horizontal container | `{row} gap=8` |
| `{col}` | Vertical container | `{col} gap=12` |
| `{}` | Empty container (default horizontal) | `{} gap=8` |
| `##` | Table container | `## border=1` |
| `#` | Table row (only inside tables) | `# bg=#eee` |

> **All text content** (inside rectangles, rounded rectangles, plain text) **must** be enclosed in double quotes: `["Login"]`, `("Card")`, `"Welcome"`.

### Coordinates

Place coordinates after an element with `@(x, y)`. Each coordinate can be:

- **Absolute** – plain number: `@(100,50)`
- **Relative** – `+n` or `-n`: offset from the **previous sibling's anchor point**  
  (top-left for ordinary elements, end point for lines)
- **Edge-relative** – `direction±n`: offset from a specific edge of the previous element  
  Directions: `L` (left), `R` (right), `T` (top), `B` (bottom), `C` (horizontal/vertical center)

Examples:
```
["Username"] @(0,0)
["Password"] @(0,+30)
["Sign up"] @(R+5, T+0)
--"connect"-- @(R+10, B-5)->(+50,0)
```

### Attributes

Attributes follow the element/coordinates, space-separated. Use double quotes for values that contain spaces.

**Common attributes** (apply to most elements):
- `w` – width (px)
- `h` – height (px)
- `c` – color (`#RRGGBB`, `red`, `rgb(r,g,b)`, `rgba(r,g,b,a)`)
- `bg` – background color
- `b` – stroke color
- `s` – stroke width
- `r` – corner radius
- `hide` – hide the element

**Element notes**:
- `note` – add explanatory text that will be rendered visually as a badge + card at the bottom

**Text-related** (rectangles, rounded rectangles, plain text):
- `size` – font size (default 12)
- `line-height` – line height (default 22)
- `bold` – bold text
- `italic` – italic text
- `align` – horizontal alignment (`l`/`c`/`r`)

**Icons**:
- `size` – icon size (default 24)
- `library` – icon library name (overrides global `!icon-library`)

**Containers** (`{row}`/`{col}`/`{}`):
- `gap` – spacing between children
- `align` – alignment (`start`/`center`/`end`/`stretch`)

**Tables** (`##`):
- `border` – border width
- `cellspacing` – space between cells
- `cellpadding` – padding inside cells

**Cells** (any element inside a table row):
- `colspan`, `rowspan`

### Multi-line text

Two ways to write multi-line text:

- Escape with `\n`: `"First line\nSecond line"`
- Triple quotes `"""`:
  ```
  """
  First line
  Second line
  """
  ```

If a width `w` is set, the text will **automatically wrap**; without a width, the element's width is determined by the longest line.

### Comments

- Single line: `// comment`
- Multi-line: each line starts with `//` (Markdown lists work too)

---

## Default styles

If no global or local attribute overrides them, these defaults apply:

| Element | Default |
|--------|---------|
| Rectangle `[]` | white background, black text, font size 12, stroke `#333`, stroke width 1 |
| Rounded rectangle `()` | same as rectangle, plus `r=6` |
| Circle `(())` | transparent background, stroke `#333`, stroke width 1 |
| Plain text `"text"` | black, font size 12 |
| Icon `!icon` | size 24, color black |
| Placeholder `[?]` | background `#f0f0f0`, text color `#999`, font size 12 |
| Line `--` | stroke `#333`, width 1, solid |
| Line label | font size 12, color `#333` |
| Image `<url>` | original dimensions (fallback 100×100, renders as placeholder) |
| Container `{row}/{col}` | transparent background, no stroke |
| Table `##` | border 1, cellspacing 0, cellpadding 4 |
| Table row `#` | background inherited from parent or none |

All text has a default `line-height` of `22px`.

---

## Quick Start

### Installation

```bash
git clone https://github.com/your-username/solarwire.git
cd solarwire
npm install
```

### Run the example

```bash
cd packages/example
node generate-example.js
```

This will generate `example.svg` and `example.html` from `example.solarwire`.

### Use the parser and renderer

```typescript
import { parse } from '@solarwire/parser';
import { render as renderSvg } from '@solarwire/renderer-svg';
import { render as renderHtml } from '@solarwire/renderer-html';

const code = `
!title="My Wireframe"
!width=800
!height=600

["Hello World"] @(50,50) w=200 h=60
`;

const ast = parse(code);
const svg = renderSvg(ast);
const html = renderHtml(ast);

console.log(svg);
console.log(html);
```

### Run tests

```bash
# Run all tests
npm test

# Run parser tests
cd packages/parser
npm test

# Run SVG renderer tests
cd packages/renderer-svg
npm test
```

---

## Example

```SolarWire
!title="SolarWire Complete Feature Demo"
!width=1000
!height=1200

"=== SolarWire Complete Feature Demo ===" @(50,30) size=20 bold

["Rectangle"] @(50,110) w=120 h=50 c=blue bg=lightblue
("Rounded") @(180,110) w=120 h=50 r=10 bg=#fff0c0
(("Circle")) @(310,125) w=40 h=40 bg=#90EE90
!icon "star" @(370,120) size=24
!icon "home" @(410,120) size=24 library=font-awesome

## @(50,390) w=600 border=1
#
["Header 1"] colspan=2 bg=#4CAF50 c=white bold
["Header 2"] bg=#4CAF50 c=white bold
#
["Merged"] rowspan=2 bg=#e8f5e9
["Cell A1"] bg=#f5f5f5
["Cell A2"] bg=#f5f5f5
#
["Cell B1"] bg=#ffffff
["Cell B2"] bg=#ffffff
#
["Footer"] colspan=3 bg=#2196F3 c=white bold

["Multi-line Note"] @(50,980) w=250 h=60 note="This is a multi-line note.
It contains several lines of text
to demonstrate how notes with
longer content are displayed
in the card area at the bottom."
```

---

## Project Structure

```
SolarWire/
├── packages/
│   ├── parser/              # Parser built with Peggy
│   ├── renderer-svg/        # SVG renderer
│   ├── renderer-html/       # HTML renderer
│   ├── icons/               # Icon library system
│   ├── markdown-it-plugin/  # Markdown plugin
│   ├── cli/                 # Command-line interface
│   ├── vscode-extension/    # VS Code extension
│   └── example/             # Example files
├── package.json
├── package-lock.json
└── README.md
```

---

## Get involved

SolarWire is actively developed! We are looking for:

- **Feedback** on the syntax and direction.
- **Contributors** to help improve the parser, renderers, editor plugins, and AI integrations.
- **Partners** interested in using SolarWire in their projects or tools.

If you'd like to collaborate, please:

- ⭐ Star this repository to show interest.
- 💬 Open an issue for questions or suggestions.
- 🫂 Reach out via GitHub Discussions (once enabled).

---

## License

MIT © SolarWire contributors
