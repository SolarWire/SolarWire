# SolarWire

**SolarWire** is a lightweight, Markdown-style DSL for rapidly creating UI wireframes. It's designed with two goals in mind: **human readability** and **AI friendliness**, all while keeping everything in plain text for version control.

- ✨ **Minimal syntax** – Express common UI elements with just a few characters.
- 🤖 **AI-native** – The syntax feels natural for language models; they can generate and modify wireframes directly.
- 📦 **Plain text** – Git-friendly, easily embeddable in technical documentation.
- 🎨 **Complete implementation** – Parser, SVG renderer, and VS Code extension are all ready to use!

## 🚀 Features

### Core Language
- ✅ Complete parser built with Peggy (PEG.js)
- ✅ SVG renderer with full element support
- ✅ Rich attribute system (colors, sizes, styling)
- ✅ Flexible coordinate system (absolute, relative, edge-relative)
- ✅ Automatic content sizing - no manual width/height needed!
- ✅ **Improved text wrapping** - Smart line breaking for both English and Chinese text!
- ✅ **Responsive preview** - SVG scales automatically to fit container width
- ✅ **Better note cards** - Improved text fitting with safe margins

### UI Elements
- ✅ Rectangles, rounded rectangles, circles
- ✅ Text elements with bold/italic styling
- ✅ Placeholders and images (with fallback rendering)
- ✅ Lines with labels and styling
- ✅ Row and column containers with gap control
- ✅ Tables with colspan/rowspan support

### Advanced Features
- ✅ **Note system** – Visual badges + card display at the bottom
- ✅ Document-level declarations for global defaults
- ✅ Multi-line text support (\n and triple quotes)
- ✅ Image placeholder rendering with mountain/sun icon
- ✅ Adaptive sizing - canvas automatically fits to content

### VS Code Extension
- ✅ Syntax highlighting
- ✅ Snippets for quick coding
- ✅ Real-time preview panel
- ✅ Diagnostics and error highlighting
- ✅ Auto-completion for elements, attributes, declarations
- ✅ Hover information for documentation
- ✅ Export to SVG and PNG

---

## Syntax

### Document-level declarations

Place these at the top of your file (one per line) to set global defaults:

```
!title="My Wireframe"    // Document title
!c=#333                   // Default text color
!size=12                  // Default font size
!line-height=22           // Default line height
!gap=12                   // Default container gap
!bg=#f8f8f8               // Default background for rectangles
!r=6                      // Default corner radius for rounded rectangles
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
- Triple quotes `""""`:
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
| Placeholder `[?]` | background `#f0f0f0`, text color `#999`, font size 12, with diagonal lines |
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
# Open example.solarwire in VSCode and use the preview feature
```

This will show you the complete feature demo.

### Use the parser and renderer

```typescript
import { parse } from '@solarwire/parser';
import { render } from '@solarwire/renderer-svg';

const code = `
!title="My Wireframe"

["Hello World"] @(50,50) w=200 h=60
`;

const ast = parse(code);
const svg = render(ast);

console.log(svg);
```

---

## Example

```SolarWire
!title="SolarWire Complete Feature Demo"
!c=#333
!bg=#ffffff
!size=12
!line-height=1.5

"=== SolarWire Complete Feature Demo ===" @(50,30) size=20 bold

["Rectangle"] @(50,110) w=120 h=50 c=blue bg=lightblue
("Rounded") @(180,110) w=120 h=50 r=10 bg=#fff0c0
(("Circle")) @(310,125) w=40 h=40 bg=#90EE90
[?"Placeholder"] @(370,105) w=120 h=50 note="This is a placeholder element that shows a grey box with crosshairs"

"Basic Text" @(50,180) bold size=16
"Normal text with some words." @(50,210) w=200
"Multi-line text\nusing \\n escapes." @(280,210) w=180
"""
Triple-quoted
multi-line text.
The renderer will
line-break
automatically!
""" @(50,250) w=300

"Text Styles" @(50,330) bold size=16
"This is bold" @(50,360) bold
"This is italic" @(180,360) italic
"Align left (default)" @(50,400) w=150 align=l bg=#f5f5f5
"Align center" @(220,400) w=150 align=c bg=#f5f5f5
"Align right" @(390,400) w=150 align=r bg=#f5f5f5

## @(50,470) w=600 border=1
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

["Containers & Layout"] @(50,590) bold size=16
{row} @(50,630) gap=10
  ["Button 1"] w=100 h=40 bg=#4CAF50 c=white
  ["Button 2"] w=100 h=40 bg=#2196F3 c=white
  ["Button 3"] w=100 h=40 bg=#FF9800 c=white

{col} @(380,630) gap=8
  ["Item A"] w=150 h=30
  ["Item B"] w=150 h=30
  ["Item C"] w=150 h=30

["Lines & Connections"] @(50,760) bold size=16
["Start"] @(50,790) w=80 h=40 note="This is the starting point"
--"line A"-- @(R+10, C+0)->(+100, 0)
["Middle"] @(+, C-20) w=80 h=40
--"line B"-- @(R+10, C+0)->(+100, 0)
["End"] @(+, C-20) w=80 h=40

["Images"] @(50,890) bold size=16
<https://example.com/logo.png> @(50,920) w=100 h=80 note="Image with custom size"
<invalid-url.jpg> @(180,920) w=100 h=80 note="Image fallback - shows placeholder"

["Elements with Notes"] @(50,1050) bold size=16
["Important Element"] @(50,1080) w=180 h=50 note="This element has a note that appears as a badge and is detailed in the card area below"
("Another Note") @(260,1080) w=180 h=50 bg=#e3f2fd note="Notes help document your wireframe choices"
(("Circle")) @(470,1095) w=40 h=40 bg=#f3e5f5 note="Circles can also have notes attached"

["Multi-line Note"] @(50,1170) w=250 h=60 note="This is a multi-line note.
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
│   ├── vscode-extension/    # VS Code extension
│   └── example/             # Example files
├── package.json
├── package-lock.json
└── readme.md
```

---

## Version History

### v1.3.0 (2026-03-24)
- ✅ **Fixed table rendering** - 完全重写表格渲染算法，使用双 pass 方式精确计算 colspan 和 rowspan 的组合
- ✅ **Removed device support** - 移除 device 相关属性和功能
- ✅ **Placeholder with diagonal lines** - Placeholder 元素现在显示与边框相同颜色和线宽的对角线
- ✅ **Column count calculation** - 正确计算 rowspan 占用后续行列位置的情况
- ✅ **Table height strict** - 严格按照用户声明的 h 属性计算表格高度，按最终行数平均分配
- ✅ **Multiple colspan/rowspan combinations** - 支持任意复杂的 colspan 和 rowspan 组合场景
- ✅ **Project cleanup** - 移除临时文件和过期文件，整理项目结构

### v1.2.0 (2026-03-23)
- ✅ **Syntax highlighting** - 完善的语法高亮支持（solarwire 格式和 markdown 格式中的代码块）
- ✅ **Preview window enhancements** - 预览窗口支持缩放和拖动功能
- ✅ **Table element indentation** - 表格单元格元素缩进检查和异常抛出
- ✅ **Multi-line note parsing** - 支持多行 note 解析
- ✅ **Temporary file management** - 创建 debug 文件夹管理临时调试文件
- ✅ **Script folder reorganization** - 将 scripts 文件夹内容移动到 example 文件夹

### v1.1.0
- ✅ **Initial release** - 完整的 SolarWire DSL 解析器和渲染器
- ✅ **SVG rendering** - 所有元素的 SVG 渲染支持
- ✅ **VS Code extension** - 基础语法高亮、代码片段、预览功能
- ✅ **Table support** - 基本表格支持，包括 colspan 和 rowspan
- ✅ **Note system** - 元素注释系统（视觉标签 + 底部卡片）
- ✅ **Multi-line text** - 多行文本支持（\n 和三引号）
- ✅ **Document declarations** - 文档级别全局默认值声明

---

## License

MIT © SolarWire contributors
