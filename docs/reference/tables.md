# Tables

Tables are a powerful feature in SolarWire for displaying data in rows and columns.

## Basic Syntax

Tables use `##` for the table element and `#` for rows:

```solarwire
## @(x,y) w=width [attributes...]
  # [row attributes...]
    "Cell 1"
    "Cell 2"
  #
    "Cell 3"
    "Cell 4"
```

::: warning Important
Rows must be indented with **2 spaces**. Cells must be indented with **4 spaces**.
:::

---

## Simple Table

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "ID"
    "Name"
    "Email"
  #
    "1"
    "John Doe"
    "john@example.com"
  #
    "2"
    "Jane Smith"
    "jane@example.com"
```

---

## Table Attributes

### Table-Level Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `w` | Table width | auto (based on content) |
| `border` | Border width | 1 |
| `cellspacing` | Space between cells | 0 |
| `cellpadding` | Cell padding | 8 |
| `note` | Table description | - |

```solarwire
## @(100,50) w=600 border=2 cellspacing=1 cellpadding=16
```

### Row-Level Attributes

| Attribute | Description |
|-----------|-------------|
| `bg` | Row background color |
| `c` | Default text color for all cells |
| `size` | Default font size for all cells |
| `bold` | Bold text for all cells |
| `italic` | Italic text for all cells |
| `align` | Text alignment for all cells |

::: warning
`note` attribute is **NOT supported** on table rows. Add `note` to the table element instead.
:::

```solarwire
## @(100,50) w=500 border=1
  # bg=#4CAF50 c=white bold
    "ID"
    "Name"
    "Actions"
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
    "Product" colspan=2
  #
    "Name"
    "Price"
```

---

## Row Attribute Inheritance

Row-level attributes serve as defaults for all cells in that row. Individual cells can override these defaults.

```solarwire
## @(100,50) w=500 border=1
  # bg=#4CAF50 c=white bold
    "ID"           // Inherits: white, bold
    "Name"         // Inherits: white, bold
    "Actions"      // Inherits: white, bold
  # bg=#f5f5f5 c=#666
    "1"            // Inherits: #666
    "John Doe" c=#333 bold  // Override: #333, bold
    ["Edit"] ["Delete"]
```

---

## Cell Span

### Column Span

Merge cells horizontally using `colspan`:

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "Header spanning 2 columns" colspan=2
  #
    "Cell 1"
    "Cell 2"
```

### Row Span

Merge cells vertically using `rowspan`:

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "Category"
    "Item"
  #
    "Electronics" rowspan=2
    "Phone"
  #
    "Laptop"
```

---

## Cell Types

Cells can contain different element types:

### Text Cells

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "Name"
    "Email"
  #
    "John Doe"
    "john@example.com"
```

### Button Cells

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "Name"
    "Actions"
  #
    "John Doe"
    ["Edit"] ["Delete"]
```

### Mixed Cells

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "User"
    "Status"
    "Actions"
  #
    (("JD")) "John Doe"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]
```

---

## Table with Notes

Add functional descriptions using `note`:

```solarwire
## @(100,50) w=600 border=1 note="""[Table] User management
- Data source: User API
- Default sort: Name ascending
- Pagination: 20 items per page"""
  # bg=#fafafa bold
    "ID"
    "Name"
    "Email"
    "Status"
    "Actions"
  #
    "1"
    "John Doe"
    "john@example.com"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]
```

::: tip
Use `note` on the table element (`##`), not on rows (`#`).
:::

---

## Styling Tables

### Alternating Row Colors

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee bold
    "ID"
    "Name"
    "Status"
  # bg=#fff
    "1"
    "John Doe"
    "Active"
  # bg=#f9f9f9
    "2"
    "Jane Smith"
    "Inactive"
  # bg=#fff
    "3"
    "Bob Wilson"
    "Active"
```

### Highlighted Rows

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "ID"
    "Name"
    "Status"
  # bg=#e8f5e9
    "1"
    "John Doe"
    "Active" c=#27ae60
  # bg=#ffebee
    "2"
    "Jane Smith"
    "Inactive" c=#e74c3c
```

### Minimal Table

```solarwire
## @(100,50) w=500 border=0
  #
    "ID"
    "Name"
    "Email"
  #
    "1"
    "John Doe"
    "john@example.com"
```

---

## Complete Examples

### User Management Table

```solarwire
## @(50,100) w=900 border=1 note="""[Table] User list with actions
- Data source: /api/users
- Default 20 items per page
- Sortable columns: Name, Email, Created"""
  # bg=#fafafa bold
    "ID"
    "User"
    "Email"
    "Role"
    "Status"
    "Actions"
  # bg=#fff
    "1"
    (("JD")) "John Doe"
    "john@example.com"
    "Admin"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]
  # bg=#f9f9f9
    "2"
    (("JS")) "Jane Smith"
    "jane@example.com"
    "User"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]
  # bg=#fff
    "3"
    (("MJ")) "Mike Johnson"
    "mike@example.com"
    "User"
    "Inactive" c=#e74c3c
    ["Edit"] ["Delete"]
```

### Product Catalog Table

```solarwire
## @(50,100) w=800 border=1 note="""[Table] Product catalog
- Image thumbnails: 60x60px
- Click row to view details"""
  # bg=#eee bold
    "Image"
    "Product Name"
    "Category"
    "Price"
    "Stock"
  #
    [?"Product"] w=60 h=60
    "Wireless Headphones"
    "Electronics"
    "$99.99"
    "In Stock" c=#27ae60
  #
    [?"Product"] w=60 h=60
    "Running Shoes"
    "Sports"
    "$129.99"
    "Low Stock" c=#f39c12
```

### Dashboard Stats Table

```solarwire
## @(50,100) w=600 border=1
  # bg=#3498db c=white bold
    "Metric"
    "Value"
    "Change"
  # bg=#fff
    "Total Users"
    "12,345"
    "+12%" c=#27ae60
  # bg=#f9f9f9
    "Active Users"
    "8,901"
    "+8%" c=#27ae60
  # bg=#fff
    "Revenue"
    "$45,678"
    "-3%" c=#e74c3c
```

---

## Best Practices

### 1. Always Use Consistent Indentation

```solarwire
// Good: Consistent 2-space for rows, 4-space for cells
## @(100,50) w=500 border=1
  # bg=#eee
    "Cell 1"
    "Cell 2"

// Bad: Inconsistent indentation
## @(100,50) w=500 border=1
# bg=#eee
  "Cell 1"
    "Cell 2"
```

### 2. Add Notes to Tables, Not Rows

```solarwire
// Good
## @(100,50) w=500 border=1 note="""[Table] User list"""
  # bg=#eee
    "Name"
    "Email"

// Bad: note on row will cause error
## @(100,50) w=500 border=1
  # bg=#eee note="""Header row"""  // ❌ Error!
    "Name"
    "Email"
```

### 3. Use Row Inheritance for Consistent Styling

```solarwire
// Good: Row-level defaults
## @(100,50) w=500 border=1
  # bg=#eee c=#333 bold
    "Name"
    "Email"
    "Actions"

// Bad: Repeating attributes
## @(100,50) w=500 border=1
  # bg=#eee
    "Name" c=#333 bold
    "Email" c=#333 bold
    "Actions" c=#333 bold
```

### 4. Use Meaningful Cell Content

```solarwire
// Good: Descriptive content
["Edit"] @(0,0) w=60 h=32 note="""Edit user details"""
["Delete"] @(0,0) w=60 h=32 note="""Delete user (with confirmation)"""

// Bad: Generic content
["..."]
["X"]
```

---

## Common Patterns

### Action Column

```solarwire
## @(100,50) w=600 border=1
  # bg=#eee
    "Name"
    "Email"
    "Actions"
  #
    "John Doe"
    "john@example.com"
    ["View"] ["Edit"] ["Delete"]
```

### Status Column

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "Order ID"
    "Customer"
    "Status"
  #
    "#12345"
    "John Doe"
    "Pending" c=#f39c12
  #
    "#12346"
    "Jane Smith"
    "Completed" c=#27ae60
```

### Checkbox Column

```solarwire
## @(100,50) w=500 border=1
  # bg=#eee
    "☐"
    "Name"
    "Email"
  #
    "☐"
    "John Doe"
    "john@example.com"
  #
    "☐"
    "Jane Smith"
    "jane@example.com"
```

---

## Troubleshooting

### Common Errors

**Error: Row not recognized**
```
Solution: Ensure rows are indented with 2 spaces
```

**Error: Cells not recognized**
```
Solution: Ensure cells are indented with 4 spaces
```

**Error: note attribute on row**
```
Solution: Move note to table element (##), remove from row (#)
```

### Debug Tips

Add borders to see table structure:

```solarwire
## @(100,50) w=500 border=2 cellspacing=1
```
