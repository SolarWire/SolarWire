# Basic Syntax

SolarWire uses a simple, Markdown-style syntax. Let's learn the fundamentals.

## Document Structure

A SolarWire document consists of:

1. **Declarations** (optional) - Set default values
2. **Elements** - UI components with coordinates and attributes

```solarwire
!title="My Page"
!bg=#fff
!c=#333

[] @(0,0) w=400 h=600 bg=#fff

"Hello" @(100,50)
["Click Me"] @(100,100) w=100 h=40
```

## Declarations

Declarations start with `!` and set default values for the document:

```solarwire
!title="Page Title"
!bg=#ffffff
!c=#333333
!size=14
!bold
```

| Declaration | Description | Example |
|-------------|-------------|---------|
| `!title` | Page title | `!title="Login Page"` |
| `!bg` | Default background | `!bg=#fff` |
| `!c` | Default text color | `!c=#333` |
| `!size` | Default font size | `!size=14` |
| `!bold` | Default bold text | `!bold` |
| `!italic` | Default italic text | `!italic` |

## Elements

### Rectangle

Use `[]` for buttons, containers, and rectangular elements:

```solarwire
["Button Text"] @(x,y) w=100 h=40
```

### Rounded Rectangle

Use `()` for cards and rounded containers:

```solarwire
("Card Title") @(x,y) w=200 h=100 r=8
```

### Circle

Use `(())` for avatars and circular elements:

```solarwire
(("Avatar")) @(x,y) w=40 h=40
```

### Plain Text

Use `""` for labels and text:

```solarwire
"Label Text" @(x,y)
```

### Placeholder

Use `[?]` for icons and placeholders:

```solarwire
[?"Icon Name"] @(x,y) w=32 h=32
```

### Image

Use `<>` for real images:

```solarwire
<https://example.com/image.png> @(x,y) w=100 h=100
```

### Line

Use `--` for divider lines:

```solarwire
-- @(x1,y1)->(x2,y2)
```

### Table

Use `##` for tables and `#` for rows:

```solarwire
## @(x,y) w=500 border=1
  # bg=#eee
    "Header 1"
    "Header 2"
  #
    "Cell 1"
    "Cell 2"
```

## Coordinates

Every element must have coordinates using `@(x,y)`:

### Absolute Coordinates

Position relative to the canvas origin:

```solarwire
["Button"] @(100,50)
```

### Relative Coordinates

Position relative to the previous element:

```solarwire
["Button 1"] @(100,50)
["Button 2"] @(0,+60)    // 60px below Button 1
["Button 3"] @(+120,0)   // 120px to the right of Button 2
```

### Edge Coordinates

Position relative to edges of the previous element:

```solarwire
["Card"] @(100,100) w=200 h=150
"Title" @(L+10, T+10)     // 10px from left and top edges
"Footer" @(L+10, B-30)    // 10px from left, 30px from bottom
```

| Edge | Description |
|------|-------------|
| `L` | Left edge |
| `R` | Right edge |
| `T` | Top edge |
| `B` | Bottom edge |

## Attributes

Attributes are written as `key=value` pairs:

```solarwire
["Button"] @(100,50) w=100 h=40 bg=#3498db c=white r=8 bold
```

### Common Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `w` | Width | `w=100` |
| `h` | Height | `h=40` |
| `bg` | Background color | `bg=#3498db` |
| `c` | Text color | `c=white` |
| `b` | Border color | `b=#ddd` |
| `s` | Border width | `s=1` |
| `r` | Border radius | `r=8` |
| `size` | Font size | `size=16` |
| `bold` | Bold text | `bold` |
| `italic` | Italic text | `italic` |
| `note` | Functional description | `note="Click to submit"` |
| `opacity` | Element opacity (0-1) | `opacity=0.5` |

### Color Formats

```solarwire
bg=#3498db        // Hex
bg=red            // Named color
bg=rgb(52,152,219)    // RGB
bg=rgba(52,152,219,0.5)  // RGBA
```

## Notes

Notes add functional descriptions to elements:

```solarwire
["Login"] @(100,50) w=100 h=40 note="[Primary Button]
- Validates form on click
- Success: Redirect to dashboard
- Failure: Show error message"
```

::: tip
Notes are essential for AI understanding. They describe behavior, not visual details.
:::

## Comments

Use `//` for comments:

```solarwire
// This is a comment
["Button"] @(100,50)  // Inline comment
```

## Complete Example

```solarwire
!title="Login Page"
!bg=#fff

// Container
[] @(0,0) w=400 h=500 bg=#fff

// Header
"Welcome Back" @(130,80) size=24 bold

// Form
"Email" @(50,180)
["Enter your email"] @(50,205) w=300 h=44 bg=#fff b=#ddd note="[Input Field]
- Email format validation
- Max 50 characters"

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44 bg=#fff b=#ddd note="[Password Field]
- Min 6 characters
- Show/hide toggle"

// Actions
["Remember me"] @(50,370) w=16 h=16 note="[Checkbox] Stay logged in for 7 days"
"Remember me" @(74,372)

["Sign In"] @(50,420) w=300 h=48 bg=#3498db c=white size=16 note="[Primary Button]
- Validates credentials
- Success: Redirect to dashboard
- Failure: Show error toast"

// Footer
"Don't have an account?" @(115,500) c=#666
"Sign up" @(270,500) c=#3498db note="[Link] Navigate to registration"
```

## Next Steps

- [Elements Reference](/reference/elements) - Detailed element documentation
- [Attributes Reference](/reference/attributes) - All available attributes
- [Examples](/examples/login-form) - Real-world examples
