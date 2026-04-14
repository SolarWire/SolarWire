# Examples Gallery

Complete examples demonstrating SolarWire features and best practices.

## Quick Navigation

- [Login Form](#login-form)
- [Dashboard](#dashboard)
- [Mobile App](#mobile-app)
- [Data Tables](#data-tables)

---

## Login Form

Complete login form with all best practices demonstrated.

### Complete Code

```solarwire
!title="Login Page"
!bg=#f5f5f5

// Container
[] @(0,0) w=400 h=600 bg=#fff

// Header
"Welcome Back" @(130,80) size=24 bold
"Please sign in to continue" @(115,115) c=#666

// Form Fields
"Email" @(50,180)
["Enter your email"] @(50,205) w=300 h=44 bg=#fff b=#ddd note="""[Input Field]
- Supports phone number or email login
- Automatically trims leading/trailing spaces
- Format validation: 11-digit phone or email format
- Error message: 'Please enter a valid email'
- Max length: 50 characters"""

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44 bg=#fff b=#ddd note="""[Password Field]
- Password displayed as dots
- Show/hide toggle icon on the right
- Min length: 6 characters, Max: 32 characters
- Must contain letters and numbers
- Error: 'Password must be 6-32 characters'"""

// Remember Me
["Remember Me"] @(50,370) w=16 h=16 note="""[Checkbox]
- When checked, stay logged in for 7 days
- Unchecked: Session expires on browser close"""

"Remember me" @(74,372)

// Actions
["Sign In"] @(50,420) w=300 h=48 bg=#3498db c=white size=16 bold note="""[Primary Button]
- Validates email and password on click
- Success: Redirect to dashboard, save login state
- Failure: Display 'Invalid credentials' error toast
- Disabled when: email or password is empty
- Debounce: Button disabled for 3 seconds after click"""

// Divider
-- @(50,500)->(350,500) b=#eee

// Social Login
"Or continue with" @(145,520) c=#999

[?"WeChat"] @(120,560) w=40 h=40 note="""[Third-party Login] WeChat QR code login"""
[?"Google"] @(180,560) w=40 h=40 note="""[Third-party Login] Google OAuth login"""
[?"Apple"] @(240,560) w=40 h=40 note="""[Third-party Login] Apple ID login"""

// Footer
"Don't have an account?" @(100,640) c=#666
"Sign up" @(260,640) c=#3498db note="[Link] Navigate to registration page"
```

### Key Features

| Feature | Description |
|---------|-------------|
| Container Pattern | White background container as first element |
| Form Field Pattern | Label + Input with consistent spacing |
| Detailed Notes | All functional information included |
| Action Buttons | Primary action with full description |
| Third-party Options | Grouped related options |

### Variations

#### Minimal Version

```solarwire
!title="Login"

[] @(0,0) w=300 h=400 bg=#fff

"Email" @(50,100)
["Enter email"] @(50,125) w=200 h=40

"Password" @(50,190)
["Enter password"] @(50,215) w=200 h=40

["Login"] @(50,280) w=200 h=44 bg=#3498db c=white
```

#### With Error State

```solarwire
!title="Login - Error State"

[] @(0,0) w=400 h=600 bg=#fff

"Email" @(50,180)
["invalid-email"] @(50,205) w=300 h=44 bg=#fff b=#e74c3c
"Please enter a valid email address" @(50,255) c=#e74c3c size=12
```

#### Mobile Version

```solarwire
!title="Login - Mobile"

[] @(0,0) w=375 h=812 bg=#fff

"Welcome" @(140,100) size=24 bold

"Email" @(24,200)
["Enter email"] @(24,225) w=327 h=50 bg=#fff b=#ddd

"Password" @(24,310)
["Enter password"] @(24,335) w=327 h=50 bg=#fff b=#ddd

["Sign In"] @(24,420) w=327 h=50 bg=#3498db c=white
```

---

## Dashboard

Complete admin dashboard with statistics, charts, and data tables.

### Complete Code

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

### Key Features

| Feature | Description |
|---------|-------------|
| Dashboard Layout | Sidebar, header, stats, content |
| Statistics Cards | Icon, title, number, trend |
| Data Tables | Sortable, status badges, actions |
| Charts Placeholder | Reserved space for visualizations |

---

## Mobile App

Complete mobile app wireframes with bottom navigation.

### Home Screen

```solarwire
!title="Mobile App - Home"
!bg=#f5f5f5

// Phone Frame
[] @(0,0) w=375 h=812 bg=#fff

// Status Bar
[] @(0,0) w=375 h=44 bg=#3498db
"9:41" @(170,12) c=white bold
[?"Signal"] @(30,12) w=16 h=16
[?"Battery"] @(330,12) w=24 h=12

// Header
[] @(0,44) w=375 h=60 bg=#3498db
"Home" @(165,64) c=white size=18 bold
[?"Menu"] @(20,64) w=24 h=24
[?"Search"] @(330,64) w=24 h=24

// Welcome Section
"Good Morning, John!" @(20,130) size=20 bold
"Here's your daily summary" @(20,160) c=#666

// Quick Stats
[] @(20,200) w=160 h=80 bg=#e8f5e9 r=12
"Balance" @(40,215) c=#666 size=12
"$12,345" @(40,240) size=20 bold c=#27ae60

[] @(195,200) w=160 h=80 bg=#e3f2fd r=12
"Points" @(215,215) c=#666 size=12
"2,450" @(215,240) size=20 bold c=#2196f3

// Featured Section
"Featured" @(20,310) bold
["See All"] @(290,310) c=#3498db

// Featured Card
("Special Offer") @(20,340) w=335 h=150 bg=#fff r=12 note="[Card] Promotional banner"
"50% OFF" @(40,370) size=24 bold c=#e74c3c
"On your first purchase" @(40,410) c=#666
["Shop Now"] @(40,440) w=100 h=36 bg=#3498db c=white r=18

// Categories
"Categories" @(20,520) bold

[] @(20,560) w=70 h=70 bg=#fff r=12
[?"👗"] @(35,575) w=40 h=40
"Fashion" @(30,640) size=10 c=#666

[] @(105,560) w=70 h=70 bg=#fff r=12
[?"📱"] @(120,575) w=40 h=40
"Electronics" @(108,640) size=10 c=#666

[] @(190,560) w=70 h=70 bg=#fff r=12
[?"🏠"] @(205,575) w=40 h=40
"Home" @(205,640) size=10 c=#666

[] @(275,560) w=70 h=70 bg=#fff r=12
[?"🍔"] @(290,575) w=40 h=40
"Food" @(295,640) size=10 c=#666

// Bottom Navigation
[] @(0,730) w=375 h=82 bg=#fff
-- @(0,730)->(375,730) b=#eee

[?"Home"] @(40,755) w=24 h=24 c=#3498db
"Home" @(40,785) size=10 c=#3498db

[?"Search"] @(120,755) w=24 h=24 c=#999
"Search" @(115,785) size=10 c=#999

[?"Cart"] @(200,755) w=24 h=24 c=#999
"Cart" @(200,785) size=10 c=#999

[?"Profile"] @(280,755) w=24 h=24 c=#999
"Profile" @(275,785) size=10 c=#999
```

### Mobile Dimensions

| Element | Size |
|---------|------|
| Canvas | 375x812 (iPhone X) |
| Button height | 44-50px |
| Touch targets | min 44x44px |
| Status bar | 44px |
| Bottom nav | 82px |

---

## Data Tables

Complete examples of data tables with various features.

### Basic Table

```solarwire
!title="Basic Data Table"

[] @(0,0) w=800 h=400 bg=#fff

## @(50,50) w=700 border=1 note="[Table] User list"
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
```

### Table with Status

```solarwire
!title="Table with Status"

[] @(0,0) w=900 h=500 bg=#fff

## @(50,50) w=800 border=1
  # bg=#fafafa bold
    "Order ID"
    "Customer"
    "Amount"
    "Status"
    "Actions"
  # bg=#fff
    "#12345"
    "John Doe"
    "$125.00"
    "Completed" c=#27ae60
    ["View"] ["Edit"]
  # bg=#f9f9f9
    "#12346"
    "Jane Smith"
    "$89.00"
    "Pending" c=#f39c12
    ["View"] ["Edit"]
  # bg=#fff
    "#12347"
    "Bob Wilson"
    "$234.00"
    "Cancelled" c=#e74c3c
    ["View"] ["Edit"]
```

### Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| Success/Active | Green | `#27ae60` |
| Warning/Pending | Yellow | `#f39c12` |
| Error/Cancelled | Red | `#e74c3c` |
| Info/Processing | Blue | `#3498db` |

### Table with Pagination

```solarwire
!title="Table with Pagination"

[] @(0,0) w=900 h=600 bg=#fff

// Header
"User Management" @(50,30) size=20 bold
["Add User"] @(750,25) w=100 h=36 bg=#3498db c=white r=4

// Search
[?"Search users..."] @(50,70) w=250 h=36 bg=#f5f5f5 r=4
["Filter"] @(320,70) w=80 h=36 bg=#fff b=#ddd r=4
["Export"] @(410,70) w=80 h=36 bg=#fff b=#ddd r=4

// Table
## @(50,120) w=800 border=1
  # bg=#fafafa bold
    "ID"
    "Name"
    "Email"
    "Status"
    "Actions"
  # bg=#fff
    "1"
    "John Doe"
    "john@example.com"
    "Active" c=#27ae60
    ["Edit"] ["Delete"]
  # bg=#f9f9f9
    "2"
    "Jane Smith"
    "jane@example.com"
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

## Best Practices Summary

### 1. Container Pattern
Always start with a white background container:
```solarwire
[] @(0,0) w=400 h=600 bg=#fff
```

### 2. Consistent Spacing
Use relative coordinates for consistent spacing:
```solarwire
"Email" @(50,180)
["Enter email"] @(0,+25) w=300 h=44
```

### 3. Meaningful Notes
Notes should describe function, not visuals:
```solarwire
note="[Primary Button]
- What happens on click
- Success/failure cases
- Disabled states"
```

### 4. Status Colors
Use consistent colors for status indicators:
- ✅ Green = Success/Active
- ⚠️ Yellow = Warning/Pending
- ❌ Red = Error/Cancelled
- ℹ️ Blue = Info/Processing

### 5. Touch-Friendly (Mobile)
Minimum touch target size: 44x44px
