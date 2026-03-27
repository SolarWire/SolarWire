# Dashboard Example

Complete admin dashboard with statistics, charts, and data tables.

## Complete Code

```solarwire
!title="Admin Dashboard"
!bg=#f5f5f5

// Main Container
[] @(0,0) w=1440 h=900 bg=#f5f5f5

// Sidebar
[] @(0,0) w=240 h=900 bg=#1a1a2e

// Logo
(("SW")) @(20,20) w=40 h=40 bg=#3498db c=white
"SolarWire" @(70,28) c=white bold

// Sidebar Menu
"📊 Dashboard" @(20,100) c=#3498db bold
"👥 Users" @(20,140) c=#aaa
"📦 Products" @(20,180) c=#aaa
"📈 Analytics" @(20,220) c=#aaa
"⚙️ Settings" @(20,260) c=#aaa
"❓ Help" @(20,300) c=#aaa

// User Profile
(("JD")) @(20,850) w=40 h=40 bg=#3498db c=white
"John Doe" @(70,855) c=white size=12
"Admin" @(70,875) c=#888 size=10

// Header
[] @(240,0) w=1200 h=60 bg=#fff

"Dashboard" @(260,18) size=20 bold

[?"Search"] @(700,15) w=200 h=30 bg=#f5f5f5
[?"Notifications"] @(1100,15) w=30 h=30
(("AV")) @(1150,15) w=30 h=30 bg=#3498db c=white

// Stats Cards
[] @(260,80) w=270 h=120 bg=#fff r=8
"Total Users" @(280,100) c=#666
"12,345" @(280,140) size=32 bold
"+12%" @(460,160) c=#27ae60 size=12

[] @(550,80) w=270 h=120 bg=#fff r=8
"Revenue" @(570,100) c=#666
"$45,678" @(570,140) size=32 bold
"+8%" @(750,160) c=#27ae60 size=12

[] @(840,80) w=270 h=120 bg=#fff r=8
"Orders" @(860,100) c=#666
"1,234" @(860,140) size=32 bold
"-3%" @(1050,160) c=#e74c3c size=12

[] @(1130,80) w=270 h=120 bg=#fff r=8
"Conversion" @(1150,100) c=#666
"3.24%" @(1150,140) size=32 bold
"+0.5%" @(1340,160) c=#27ae60 size=12

// Chart Area
[] @(260,220) w=560 h=350 bg=#fff r=8
"Revenue Overview" @(280,240) bold

// Chart placeholder
[?"Line Chart"] @(280,280) w=520 h=260 bg=#f9f9f9

// Recent Orders
[] @(840,220) w=560 h=350 bg=#fff r=8
"Recent Orders" @(860,240) bold

## @(860,280) w=520 border=0
  # bg=#f9f9f9
    "Order ID"
    "Customer"
    "Amount"
    "Status"
  #
    "#12345"
    "John Doe"
    "$125.00"
    "Completed" c=#27ae60
  #
    "#12346"
    "Jane Smith"
    "$89.00"
    "Pending" c=#f39c12
  #
    "#12347"
    "Bob Wilson"
    "$234.00"
    "Completed" c=#27ae60
  #
    "#12348"
    "Alice Brown"
    "$56.00"
    "Cancelled" c=#e74c3c

// Activity Table
[] @(260,590) w=1140 h=280 bg=#fff r=8
"All Orders" @(280,610) bold

["Export"] @(1300,600) w=80 h=32 bg=#3498db c=white r=4 note="[Button] Export to CSV"

## @(280,650) w=1100 border=1 note="[Table] Order list with pagination"
  # bg=#f9f9f9 bold
    "Order ID"
    "Customer"
    "Email"
    "Amount"
    "Status"
    "Date"
    "Actions"
  # bg=#fff
    "#12345"
    "John Doe"
    "john@example.com"
    "$125.00"
    "Completed" c=#27ae60
    "2024-01-15"
    ["View"] ["Edit"]
  # bg=#f9f9f9
    "#12346"
    "Jane Smith"
    "jane@example.com"
    "$89.00"
    "Pending" c=#f39c12
    "2024-01-15"
    ["View"] ["Edit"]
  # bg=#fff
    "#12347"
    "Bob Wilson"
    "bob@example.com"
    "$234.00"
    "Completed" c=#27ae60
    "2024-01-14"
    ["View"] ["Edit"]
```

---

## Key Features Demonstrated

### 1. Dashboard Layout
- Sidebar navigation
- Header with search and profile
- Stats cards row
- Main content area

### 2. Statistics Cards
- Icon + Title
- Large number
- Trend indicator

### 3. Data Tables
- Sortable columns
- Status badges with colors
- Action buttons

### 4. Charts Placeholder
- Reserved space for charts
- Clear labeling

---

## Variations

### Dark Theme Dashboard

```solarwire
!title="Dark Dashboard"
!bg=#1a1a2e

[] @(0,0) w=1440 h=900 bg=#1a1a2e

// Stats Cards - Dark Theme
[] @(260,80) w=270 h=120 bg=#16213e r=8
"Total Users" @(280,100) c=#888
"12,345" @(280,140) size=32 bold c=white
"+12%" @(460,160) c=#27ae60 size=12
```

### Minimal Dashboard

```solarwire
!title="Minimal Dashboard"
!bg=#fff

[] @(0,0) w=1200 h=800 bg=#fff

// Simple stats
"12,345 Users" @(50,50) size=24 bold
"$45,678 Revenue" @(300,50) size=24 bold
"1,234 Orders" @(600,50) size=24 bold
```

---

## Best Practices

1. ✅ Consistent spacing and alignment
2. ✅ Clear visual hierarchy
3. ✅ Status colors (green=success, yellow=pending, red=error)
4. ✅ Action buttons in table rows
5. ✅ Export functionality for data tables
