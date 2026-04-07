# Elements Reference

Complete reference for all SolarWire elements.

## Overview

| Element | Syntax | Usage |
|---------|--------|-------|
| Rectangle | `["text"]` | Buttons, containers |
| Rounded Rectangle | `("text")` | Cards, modals |
| Circle | `(("text"))` | Avatars, icons |
| Plain Text | `"text"` | Labels, titles |
| Placeholder | `[?"text"]` | Icons, images |
| Image | `<url>` | Real images |
| Line | `--` | Dividers |
| Table | `##` | Data tables |
| Table Row | `#` | Table rows |

---

## Rectangle `[]`

Rectangles are the most common element, used for buttons, containers, and boxes.

### Syntax

```solarwire
["text"] @(x,y) w=width h=height [attributes...]
```

### Examples

```solarwire
// Simple button
["Click Me"] @(100,50) w=100 h=40

// Container
[] @(0,0) w=400 h=600 bg=#fff

// Button with styles
["Submit"] @(100,50) w=120 h=44 bg=#3498db c=white r=8 bold
```

### Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `w` | Width | 100 |
| `h` | Height | 40 |
| `bg` | Background color | #ffffff |
| `c` | Text color | #000000 |
| `b` | Border color | #333333 |
| `s` | Border width | 1 |
| `r` | Border radius | 0 |
| `size` | Font size | 12 |
| `bold` | Bold text | false |
| `italic` | Italic text | false |
| `note` | Functional description | - |
| `opacity` | Element opacity | 1 |

**⚠️ IMPORTANT: Always use triple quotes `"""` for notes**
- Triple quotes allow any characters inside, including newlines and double quotes
- No need to escape anything inside triple quotes
- DO NOT use single quotes `'` or double quotes `"` for notes

---

## Rounded Rectangle `()`

Rounded rectangles are used for cards, modals, and containers with rounded corners.

### Syntax

```solarwire
("text") @(x,y) w=width h=height [attributes...]
```

### Examples

```solarwire
// Card
("Card Title") @(100,50) w=200 h=150

// Modal
("Modal Title") @(50,50) w=300 h=400 bg=#fff r=12
```

### Attributes

Same as Rectangle, with default `r=6`.

---

## Circle `(())`

Circles are used for avatars, icons, and circular elements.

### Syntax

```solarwire
(("text")) @(x,y) w=diameter h=diameter [attributes...]
```

### Examples

```solarwire
// Avatar
(("JD")) @(100,50) w=40 h=40 bg=#3498db c=white

// Icon button
(("+")) @(100,50) w=32 h=32 bg=#27ae60 c=white
```

### Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `w` | Width (diameter) | 100 |
| `h` | Height (diameter) | 40 |
| `bg` | Background color | transparent |
| `c` | Text color | #000000 |
| `b` | Border color | #333333 |
| `s` | Border width | 1 |

---

## Plain Text `""`

Plain text elements are used for labels, titles, and text content.

### Syntax

```solarwire
"text" @(x,y) [attributes...]
```

### Examples

```solarwire
// Label
"Username" @(100,50)

// Title
"Welcome Back" @(100,50) size=24 bold

// Multi-line text
"Line 1\nLine 2\nLine 3" @(100,50)
```

### Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `c` | Text color | #000000 |
| `size` | Font size | 12 |
| `bold` | Bold text | false |
| `italic` | Italic text | false |
| `align` | Text alignment (l/c/r) | l |
| `line-height` | Line height | 22 |

---

## Placeholder `[?]`

Placeholders are used for icons and images that don't need specific content.

### Syntax

```solarwire
[?"text"] @(x,y) w=width h=height [attributes...]
```

### Examples

```solarwire
// Icon placeholder
[?"Search"] @(100,50) w=32 h=32

// Image placeholder
[?"Logo"] @(100,50) w=120 h=60
```

---

## Image `<>`

Images display real images from URLs.

### Syntax

```solarwire
<url> @(x,y) w=width h=height [attributes...]
```

### Examples

```solarwire
// Logo
<https://example.com/logo.png> @(100,50) w=120 h=60

// Avatar
<https://example.com/avatar.jpg> @(100,50) w=40 h=40
```

---

## Line `--`

Lines are used for dividers and separators.

### Syntax

```solarwire
-- @(x1,y1)->(x2,y2) [attributes...]
```

### Examples

```solarwire
// Horizontal line
-- @(0,100)->(400,100)

// Vertical line
-- @(100,0)->(100,500)

// Styled line
-- @(0,100)->(400,100) b=#ddd s=2
```

### Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `b` | Line color | #333333 |
| `s` | Line width | 1 |

---

## Table `##`

Tables display data in rows and columns.

### Syntax

```solarwire
## @(x,y) w=width [attributes...]
  # [row attributes...]
    "Cell 1"
    "Cell 2"
  #
    "Cell 3"
    "Cell 4"
```

### Examples

```solarwire
## @(100,50) w=500 border=1 note="[Table] User list"
  # bg=#eee bold
    "ID"
    "Name"
    "Email"
    "Actions"
  # bg=#fff
    "1"
    "John Doe"
    "john@example.com"
    ["Edit"] ["Delete"]
```

### Table Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `w` | Table width | auto |
| `border` | Border width | 1 |
| `cellspacing` | Space between cells | 0 |
| `cellpadding` | Cell padding | 8 |
| `note` | Table description | - |

### Row Attributes

| Attribute | Description |
|-----------|-------------|
| `bg` | Row background color |
| `c` | Default text color for cells |
| `size` | Default font size for cells |
| `bold` | Bold text for all cells |
| `italic` | Italic text for all cells |

::: warning
`note` attribute is **NOT supported** on table rows. Add `note` to the table element instead.
:::

---

## Table Row `#`

Table rows are indented under table elements.

### Cell Span

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "Header 1"
    "Header 2"
  #
    "Cell spanning 2 columns" colspan=2
```

### Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `colspan` | Column span | 1 |
| `rowspan` | Row span | 1 |
| `bg` | Background color | - |
| `c` | Text color | - |
| `size` | Font size | - |
| `bold` | Bold text | false |
| `note` | Cell description | - |

---

## Best Practices

### Element Selection

| Use Case | Element |
|----------|---------|
| Buttons | `["Button Text"]` |
| Cards/Modals | `("Card Title")` |
| Avatars | `(("Avatar"))` |
| Labels | `"Label Text"` |
| Icons | `[?"Icon Name"]` |
| Dividers | `--` |
| Data Tables | `##` with `#` rows |

### Naming Conventions

```solarwire
// Good: Descriptive text
["Sign In"] @(100,50)
["Add to Cart"] @(100,100)

// Bad: Generic text
["Button"] @(100,50)
["Submit"] @(100,100)
```

### Accessibility

Always add `note` for interactive elements:

```solarwire
["Submit"] @(100,50) w=100 h=40 note="[Primary Button]
- Validates form on click
- Success: Redirect to dashboard
- Failure: Show error message
- Disabled when form is invalid"
```
