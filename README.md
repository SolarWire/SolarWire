# SolarWire

**SolarWire** is a lightweight, Markdown‑style DSL for rapidly creating UI wireframes. It's designed with two goals in mind: **human readability** and **AI friendliness**, all while keeping everything in plain text for version control.

- ✨ **Minimal syntax** – Express common UI elements with just a few characters.
- 🤖 **AI‑native** – The syntax feels natural for language models; they can generate and modify wireframes directly.
- 📦 **Plain text** – Git‑friendly, easily embeddable in technical documentation.
- 🎨 **Instant preview** *(coming soon)* – CLI, editor plugins, and an online playground to render your wireframes.

> ⚠️ **Current status: Specification stage**  
> SolarWire is currently a language specification (v0.1). The parser, renderer, and tooling are under active development. If you are interested in contributing or collaborating, please reach out via GitHub!

---

## Why SolarWire?

- **Simple** – Express common UI elements with just a few characters.
- **AI‑native** – The syntax feels natural for language models; they can generate and modify wireframes directly.
- **Version‑control friendly** – Plain text means you can diff, merge, and review wireframes like code.

---

## Syntax

### Document‑level declarations

Place these at the top of your file (one per line) to set global defaults:

```
!device=phone           // default container size: 390×844
!device=phone-landscape // 844×390
!device=web             // 1440×900
!c=#333                 // default text colour
!size=12                // default font size
!line-height=22         // default line height
!gap=12                 // default container gap
!bg=#f8f8f8             // default background for rectangles
!r=6                    // default corner radius for rounded rectangles
!icon-library="material-icons"  // default icon library
!bold                   // make all text bold by default
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
- **Relative** – `+n` or `-n`: offset from the **previous sibling’s anchor point**  
  (top‑left for ordinary elements, end point for lines)
- **Edge‑relative** – `direction±n`: offset from a specific edge of the previous element  
  Directions: `L` (left), `R` (right), `T` (top), `B` (bottom), `C` (horizontal/vertical center)

Examples:
```
["Username"] @(0,0)
["Password"] @(0,+30)
["Sign up"] @(R+5, T+0)
--"connect"-- @(R+10, B-5)->(+50,0)
```

### Attributes

Attributes follow the element/coordinates, space‑separated. Use double quotes for values that contain spaces.

**Common attributes** (apply to most elements):
- `w` – width (px)
- `h` – height (px)
- `c` – colour (`#RRGGBB`, `red`, `rgb(r,g,b)`, `rgba(r,g,b,a)`)
- `bg` – background colour
- `b` – stroke colour
- `s` – stroke width
- `r` – corner radius
- `hide` – hide the element

**Element notes**:
- `note` – add explanatory text (supports **Markdown**) that will be rendered visually (e.g. as a tooltip or a callout)

**Text‑related** (rectangles, rounded rectangles, plain text):
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

### Multi‑line text

Two ways to write multi‑line text:

- Escape with `\n`: `"First line\nSecond line"`
- Triple quotes `"""`:
  ```
  """
  First line
  Second line
  """
  ```

If a width `w` is set, the text will **automatically wrap**; without a width, the element’s width is determined by the longest line.

### Comments

- Single line: `// comment`
- Multi‑line: each line starts with `//` (Markdown lists work too)

---

## Default styles

If no global or local attribute overrides them, these defaults apply:

| Element | Default |
|--------|---------|
| Rectangle `[]` | white background, black text, font size 12, stroke `#333`, stroke width 1 |
| Rounded rectangle `()` | same as rectangle, plus `r=6` |
| Circle `(())` | transparent background, stroke `#333`, stroke width 1 |
| Plain text `"text"` | black, font size 12 |
| Icon `!icon` | size 24, colour black |
| Placeholder `[?]` | background `#f0f0f0`, text colour `#999`, font size 12 |
| Line `--` | stroke `#333`, width 1, solid |
| Line label | font size 12, colour `#333` |
| Image `<url>` | original dimensions (fallback 100×100) |
| Container `{row}/{col}` | transparent background, no stroke |
| Table `##` | border 1, cellspacing 0, cellpadding 4 |
| Table row `#` | background inherited from parent or none |

All text has a default `line-height` of `22px`.

---

## Example

```SolarWire
// Document‑level settings
!device=phone
!c=#333
!size=12
!line-height=22
!gap=12
!bg=#f8f8f8
!r=6
!icon-library="material-icons"

("Card") @(50,30) w=350
  {col}
    {row} gap=8 align=C
      <logo.png> w=32
      "Welcome" size=20 bold
    ["Username"] w=100% note="Enter your **email** or **phone**"
    ["Password"] w=100% note="""
      Password requirements:
      - at least **8 characters**
      - letters and numbers
      """
    {row} gap=8 align=C
      !icon "lock"
      ["Login"] primary
      ["Sign up"] @(R+5,0)
    --"Separator"-- @(L, B+10)->(R-10, B+10) w=1 c=gray

// Table example
## border=1
  # bg=#eee
    ["Name"] bold
    ["Age"]
    ["Actions"]
  #
    "John Doe"
    "25"
    {row}
      ["Edit"]
      ["Delete"]
```

---

## Get involved

SolarWire is in its early days. We are looking for:

- **Feedback** on the syntax and direction.
- **Contributors** to help build the parser, renderers, editor plugins, and AI integrations.
- **Partners** interested in using SolarWire in their projects or tools.

If you'd like to collaborate, please:

- ⭐ Star this repository to show interest.
- 💬 Open an issue for questions or suggestions.
- 🫂 Reach out via GitHub Discussions (once enabled).

---

## License

MIT © SolarWire contributors
