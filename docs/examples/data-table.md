# Data Table Example

Complete examples of data tables with various features.

## Basic Data Table

```solarwire
!title="Basic Data Table"

[] @(0,0) w=800 h=400 bg=#fff

## @(50,50) w=700 border=1 note="[Table] User list
- Data source: /api/users
- Default sort: Name ascending
- Pagination: 10 items per page"
  # bg=#f5f5f5 bold
    "ID"
    "Name"
    "Email"
    "Role"
    "Actions"
  #
    "1"
    "John Doe"
    "john@example.com"
    "Admin"
    ["Edit"] ["Delete"]
  #
    "2"
    "Jane Smith"
    "jane@example.com"
    "User"
    ["Edit"] ["Delete"]
  #
    "3"
    "Bob Wilson"
    "bob@example.com"
    "User"
    ["Edit"] ["Delete"]
```

---

## Table with Status Badges

```solarwire
!title="Table with Status"

[] @(0,0) w=900 h=500 bg=#fff

## @(50,50) w=800 border=1 note="[Table] Order management"
  # bg=#fafafa bold
    "Order ID"
    "Customer"
    "Amount"
    "Status"
    "Date"
    "Actions"
  # bg=#fff
    "#12345"
    "John Doe"
    "$125.00"
    "Completed" c=#27ae60
    "2024-01-15"
    ["View"] ["Edit"]
  # bg=#f9f9f9
    "#12346"
    "Jane Smith"
    "$89.00"
    "Pending" c=#f39c12
    "2024-01-15"
    ["View"] ["Edit"]
  # bg=#fff
    "#12347"
    "Bob Wilson"
    "$234.00"
    "Processing" c=#3498db
    "2024-01-14"
    ["View"] ["Edit"]
  # bg=#f9f9f9
    "#12348"
    "Alice Brown"
    "$56.00"
    "Cancelled" c=#e74c3c
    "2024-01-14"
    ["View"] ["Edit"]
  # bg=#fff
    "#12349"
    "Charlie Davis"
    "$178.00"
    "Completed" c=#27ae60
    "2024-01-13"
    ["View"] ["Edit"]
```

---

## Table with Row Inheritance

```solarwire
!title="Table with Row Styles"

[] @(0,0) w=800 h=400 bg=#fff

## @(50,50) w=700 border=1
  # bg=#3498db c=white bold
    "Product"
    "Category"
    "Price"
    "Stock"
  # bg=#e8f5e9 c=#2e7d32
    "Laptop Pro"
    "Electronics"
    "$1,299"
    "In Stock"
  # bg=#fff3e0 c=#e65100
    "Wireless Mouse"
    "Electronics"
    "$49"
    "Low Stock"
  # bg=#ffebee c=#c62828
    "USB Cable"
    "Accessories"
    "$15"
    "Out of Stock"
  # bg=#fff c=#333
    "Monitor 27\""
    "Electronics"
    "$399"
    "In Stock"
```

---

## Table with Cell Span

```solarwire
!title="Table with Span"

[] @(0,0) w=800 h=400 bg=#fff

## @(50,50) w=700 border=1
  # bg=#eee bold
    "Category"
    "Product"
    "Price"
  #
    "Electronics" rowspan=3
    "Laptop"
    "$1,299"
  #
    "Mouse"
    "$49"
  #
    "Keyboard"
    "$89"
  # bg=#f9f9f9
    "Clothing" rowspan=2
    "T-Shirt"
    "$29"
  # bg=#f9f9f9
    "Jeans"
    "$59"
```

---

## Table with Pagination

```solarwire
!title="Table with Pagination"

[] @(0,0) w=900 h=600 bg=#fff

// Header
"User Management" @(50,30) size=20 bold
["Add User"] @(750,25) w=100 h=36 bg=#3498db c=white r=4

// Search and Filter
[?"Search users..."] @(50,70) w=250 h=36 bg=#f5f5f5 r=4
["Filter"] @(320,70) w=80 h=36 bg=#fff b=#ddd r=4
["Export"] @(410,70) w=80 h=36 bg=#fff b=#ddd r=4

// Table
## @(50,120) w=800 border=1 note="[Table] User list with pagination"
  # bg=#fafafa bold
    "☐"
    "ID"
    "Name"
    "Email"
    "Role"
    "Status"
    "Actions"
  # bg=#fff
    "☐"
    "1"
    "John Doe"
    "john@example.com"
    "Admin"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]
  # bg=#f9f9f9
    "☐"
    "2"
    "Jane Smith"
    "jane@example.com"
    "User"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]
  # bg=#fff
    "☐"
    "3"
    "Bob Wilson"
    "bob@example.com"
    "User"
    "Inactive" c=#e74c3c
    ["Edit"] ["Delete"]
  # bg=#f9f9f9
    "☐"
    "4"
    "Alice Brown"
    "alice@example.com"
    "Editor"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]
  # bg=#fff
    "☐"
    "5"
    "Charlie Davis"
    "charlie@example.com"
    "User"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]

// Pagination
"Showing 1-5 of 50 results" @(50,520) c=#666

["Previous"] @(550,515) w=80 h=32 bg=#fff b=#ddd r=4
["1"] @(640,515) w=32 h=32 bg=#3498db c=white r=4
["2"] @(680,515) w=32 h=32 bg=#fff b=#ddd r=4
["3"] @(720,515) w=32 h=32 bg=#fff b=#ddd r=4
["Next"] @(760,515) w=60 h=32 bg=#fff b=#ddd r=4
```

---

## Compact Table

```solarwire
!title="Compact Table"

[] @(0,0) w=600 h=300 bg=#fff

## @(50,50) w=500 border=0
  # bg=#f5f5f5 size=10
    "Name"
    "Status"
    "Score"
  # size=11
    "Project A"
    "Active" c=#27ae60
    "95%"
  # size=11
    "Project B"
    "Pending" c=#f39c12
    "72%"
  # size=11
    "Project C"
    "Complete" c=#3498db
    "100%"
```

---

## Comparison Table

```solarwire
!title="Pricing Comparison"

[] @(0,0) w=900 h=500 bg=#fff

// Header
"Choose Your Plan" @(350,30) size=24 bold

// Plans
[] @(50,80) w=250 h=380 bg=#f9f9f9 r=8
"Basic" @(130,100) size=20 bold
"$9/mo" @(140,140) size=24
"✓ 5 Users" @(80,200)
"✓ 10GB Storage" @(80,230)
"✓ Basic Support" @(80,260)
["Get Started"] @(100,340) w=150 h=40 bg=#95a5a6 c=white r=4

[] @(330,80) w=250 h=380 bg=#3498db r=8
"Pro" @(420,100) size=20 bold c=white
"$29/mo" @(415,140) size=24 c=white
"✓ 25 Users" @(360,200) c=white
"✓ 100GB Storage" @(360,230) c=white
"✓ Priority Support" @(360,260) c=white
"✓ API Access" @(360,290) c=white
["Get Started"] @(380,340) w=150 h=40 bg=white c=#3498db r=4

[] @(610,80) w=250 h=380 bg=#f9f9f9 r=8
"Enterprise" @(680,100) size=20 bold
"$99/mo" @(690,140) size=24
"✓ Unlimited Users" @(640,200)
"✓ 1TB Storage" @(640,230)
"✓ 24/7 Support" @(640,260)
"✓ Custom Integrations" @(640,290)
["Contact Sales"] @(660,340) w=150 h=40 bg=#2c3e50 c=white r=4
```

---

## Best Practices

### 1. Alternating Row Colors

```solarwire
// Good: Easy to scan
# bg=#fff
  ...
# bg=#f9f9f9
  ...
# bg=#fff
  ...
```

### 2. Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| Success/Active | Green | `#27ae60` |
| Warning/Pending | Yellow | `#f39c12` |
| Error/Cancelled | Red | `#e74c3c` |
| Info/Processing | Blue | `#3498db` |

### 3. Action Buttons

```solarwire
// Good: Clear actions
["View"] ["Edit"] ["Delete"]

// Better: With confirmation note
["Delete"] @(0,0) note="[Button] Requires confirmation dialog"
```

### 4. Table Header

Always use bold and distinct background:

```solarwire
# bg=#f5f5f5 bold
  "Column 1"
  "Column 2"
```
