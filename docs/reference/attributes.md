# Attributes Reference

Complete reference for all SolarWire attributes.

## Overview

Attributes are written as `key=value` pairs after coordinates:

```solarwire
["Button"] @(100,50) w=100 h=40 bg=#3498db c=white
```

---

## Size Attributes

### `w` - Width

Sets the element width in pixels.

```solarwire
["Button"] @(100,50) w=200
```

| Element | Default |
|---------|---------|
| Rectangle | 100 |
| Rounded | 100 |
| Circle | 100 |
| Text | 0 (auto) |
| Image | 100 |

### `h` - Height

Sets the element height in pixels.

```solarwire
["Button"] @(100,50) h=44
```

| Element | Default |
|---------|---------|
| Rectangle | 40 |
| Rounded | 40 |
| Circle | 40 |
| Text | auto |
| Image | 100 |

---

## Color Attributes

### `bg` - Background Color

Sets the background color.

```solarwire
["Button"] @(100,50) bg=#3498db
["Button"] @(100,50) bg=red
["Button"] @(100,50) bg=rgb(52,152,219)
["Button"] @(100,50) bg=rgba(52,152,219,0.5)
```

**Color Formats:**
| Format | Example |
|--------|---------|
| Hex | `#3498db`, `#333` |
| Named | `red`, `blue`, `white` |
| RGB | `rgb(52,152,219)` |
| RGBA | `rgba(52,152,219,0.5)` |
| Transparent | `transparent` |

### `c` - Text Color

Sets the text color.

```solarwire
["Button"] @(100,50) c=white
"Title" @(100,50) c=#333
```

### `b` - Border Color

Sets the border/line color.

```solarwire
["Input"] @(100,50) b=#ddd
-- @(0,100)->(400,100) b=#eee
```

---

## Border Attributes

### `s` - Border Width

Sets the border width in pixels.

```solarwire
["Card"] @(100,50) s=2 b=#333
```

**Default:** 1

### `r` - Border Radius

Sets the border radius in pixels.

```solarwire
["Button"] @(100,50) r=8
("Card") @(100,50) r=12
```

**Default:**
- Rectangle: 0
- Rounded Rectangle: 6

---

## Text Attributes

### `size` - Font Size

Sets the font size in pixels.

```solarwire
"Title" @(100,50) size=24
["Button"] @(100,50) size=16
```

**Default:** 12

### `line-height` - Line Height

Sets the line height in pixels for multi-line text.

```solarwire
"Line 1\nLine 2\nLine 3" @(100,50) line-height=24
```

**Default:** 22

### `bold` - Bold Text

Makes text bold.

```solarwire
"Title" @(100,50) bold
["Button"] @(100,50) bold
```

**Default:** false

### `italic` - Italic Text

Makes text italic.

```solarwire
"Emphasis" @(100,50) italic
```

**Default:** false

### `align` - Text Alignment

Sets horizontal text alignment.

```solarwire
"Left" @(100,50) w=200 align=l
"Center" @(100,50) w=200 align=c
"Right" @(100,50) w=200 align=r
```

**Values:**
- `l` - Left (default)
- `c` - Center
- `r` - Right

---

## Visual Attributes

### `opacity` - Element Opacity

Sets the element opacity (0-1).

```solarwire
["Button"] @(100,50) opacity=0.5
"Disabled Text" @(100,50) opacity=0.3
```

**Default:** 1

---

## Table Attributes

### Table-Level Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `w` | Table width | auto |
| `border` | Border width | 1 |
| `cellspacing` | Space between cells | 0 |
| `cellpadding` | Cell padding | 8 |
| `note` | Table description | - |

```solarwire
## @(100,50) w=500 border=2 cellspacing=1 cellpadding=10
```

### Row-Level Attributes

| Attribute | Description |
|-----------|-------------|
| `bg` | Row background color |
| `c` | Default text color |
| `size` | Default font size |
| `bold` | Bold text |
| `italic` | Italic text |
| `align` | Text alignment |

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee c=#333 bold
    "Header 1"
    "Header 2"
```

### Cell-Level Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `colspan` | Column span | 1 |
| `rowspan` | Row span | 1 |
| `bg` | Background color | - |
| `c` | Text color | - |
| `size` | Font size | - |
| `bold` | Bold text | - |
| `note` | Cell description | - |

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "Header spanning 2 columns" colspan=2
  #
    "Cell 1"
    "Cell 2"
```

---

## Note Attribute

### `note` - Functional Description

Adds functional description to elements.

```solarwire
["Login"] @(100,50) w=100 h=40 note="[Primary Button]
- Validates username and password
- Success: Redirect to dashboard
- Failure: Show error message
- Disabled when: username or password is empty"
```

**Best Practices:**
1. Start with element type tag: `[Primary Button]`, `[Input Field]`, etc.
2. Describe behavior, not visual details
3. Include success/failure scenarios
4. Note disabled states

**Element Type Tags:**
| Tag | Usage |
|-----|-------|
| `[Primary Button]` | Primary action button |
| `[Secondary Button]` | Secondary action button |
| `[Input Field]` | Text input field |
| `[Dropdown]` | Dropdown select |
| `[Checkbox]` | Checkbox |
| `[Link]` | Text link |
| `[Table]` | Data table |
| `[Card]` | Card container |

::: warning
`note` attribute is **NOT supported** on table rows (`#`). Add `note` to the table element (`##`) instead.
:::

---

## Attribute Inheritance

### Table Row Inheritance

Row-level attributes serve as defaults for all cells in that row:

```solarwire
## @(100,50) w=500 border=1
  # bg=#4CAF50 c=white bold
    "ID"           // Inherits: white, bold
    "Name"         // Inherits: white, bold
    "Actions"      // Inherits: white, bold
  # bg=#f5f5f5
    "1"
    "John Doe" c=#333  // Override: darker text
    ["Edit"]
```

---

## Complete Example

```solarwire
!title="Attribute Demo"
!bg=#f5f5f5

// Container
[] @(0,0) w=600 h=800 bg=#fff

// Size demo
["Small"] @(50,50) w=80 h=30
["Medium"] @(150,50) w=100 h=40
["Large"] @(270,50) w=120 h=50

// Color demo
["Primary"] @(50,120) w=100 h=40 bg=#3498db c=white
["Success"] @(170,120) w=100 h=40 bg=#27ae60 c=white
["Danger"] @(290,120) w=100 h=40 bg=#e74c3c c=white

// Border demo
["No Radius"] @(50,190) w=100 h=40 r=0
["Small Radius"] @(170,190) w=100 h=40 r=4
["Large Radius"] @(290,190) w=100 h=40 r=20

// Text demo
"Title Text" @(50,270) size=24 bold
"Subtitle Text" @(50,300) size=16 c=#666
"Emphasized Text" @(50,330) italic c=#999

// Opacity demo
["Full"] @(50,380) w=80 h=40 bg=#333 c=white opacity=1
["Half"] @(150,380) w=80 h=40 bg=#333 c=white opacity=0.5
["Light"] @(250,380) w=80 h=40 bg=#333 c=white opacity=0.2

// Table with attributes
## @(50,450) w=500 border=1 note="[Table] User data"
  # bg=#eee bold
    "ID"
    "Name"
    "Status"
  # bg=#fff
    "1"
    "John Doe"
    "Active" c=#27ae60
  # bg=#f9f9f9
    "2"
    "Jane Smith"
    "Inactive" c=#e74c3c
```
