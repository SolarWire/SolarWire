# SolarWire PRD - Web Admin

This is the specific configuration for admin dashboard scenarios.

## 1. Scenario Characteristics

Admin dashboards typically have the following characteristics:
- Very wide canvas (1440-1920px)
- Fixed left sidebar
- Top navigation/breadcrumb
- Data-intensive (tables, charts, statistics cards)
- Multi-column layout
- Many action buttons (Add, Edit, Delete, Export, etc.)

## 2. Size Specifications

### Canvas Size
- Recommended width: 1440-1920px
- Height adjusts automatically based on content

### Element Sizes
- Button height: 32-40px
- Button width: Based on content, minimum 64px
- Input field height: 32-36px
- Input field width: 160-320px (depending on usage)
- Table row height: 40-48px
- Sidebar width: 200-280px
- Text size: 12-14px
- Title text size: 16-20px

### Spacing Specifications
- Element spacing: 16-32px
- Page margins: 24-32px
- Table cell padding: 8-12px

## 3. Layout Best Practices

### 1. Common Layout Structure

```solarwire
!title="Admin Web"
!size=13
!gap=16

// Container Rectangle - Admin Dashboard
[] @(0,0) w=1920 h=1080 bg=#fff hide

// Left sidebar
["Logo"] @(0,0) w=240 h=60 bg=#f5f5f5 note="[Icon] Click to return to homepage"
["Dashboard"] @(0,60) w=240 h=44 note="[Link] Switch to dashboard page"
["User Management"] @(0,104) w=240 h=44 bg=#e0e0e0 note="[Link] Currently selected menu, click to refresh user list"
["Order Management"] @(0,148) w=240 h=44 note="[Link] Switch to order management page"
["System Settings"] @(0,192) w=240 h=44 note="[Link] Switch to system settings page"

// Top bar
"Breadcrumb / User Management / List" @(264,24) note="Breadcrumb navigation"
["Notifications"] @(1600,12) w=80 h=36 note="[Icon] Click to open notification list"
["User"] @(1690,12) w=80 h=36 note="[Icon] Current logged-in user info. Click to open user menu"

// Statistics cards
("Total Users") @(264,100) w=280 h=120 note="[Card] Display total system users"
("New Today") @(560,100) w=280 h=120 note="[Card] Display new users today"
("Active Users") @(856,100) w=280 h=120 note="[Card] Display active users"
("Retention Rate") @(1152,100) w=280 h=120 note="[Card] Display user retention rate"

// Search and action bar
["Search Users"] @(264,252) w=240 h=36 note="[Input Field] Search users by keyword.
- Press Enter or click search button to trigger
- Supports searching by name, email, phone number
- Max 50 characters"
["Status Filter"] @(520,252) w=120 h=36 note="[Dropdown] Filter by user status.
- Dropdown options: All/Active/Inactive
- Auto-refresh list on selection"
["Export"] @(660,252) w=80 h=36 note="[Secondary Button] Export user list.
- Export current filtered results
- Download as Excel file"
["Add User"] @(1576,252) w=120 h=36 bg=#4CAF50 c=white note="[Primary Button] Open add user modal.
- Click to trigger add user modal
- Fill in user info and save in modal"

// Data table
## @(264,316) w=1632 h=400 border=1 note="[Table] User list table.
- Data source: User management module, sorted by creation time descending
- Default 20 items per page, supports pagination
- Supports search by name, email, phone number
- Supports filter by status (All/Active/Inactive)"
  # bg=#eee
    "ID" @(0,0) w=80 note="User unique identifier"
    "Name" @(80,0) w=200 note="Display user full name"
    "Email" @(280,0) w=300 note="User email address"
    "Phone" @(580,0) w=150 note="User phone number"
    "Role" @(730,0) w=120 note="User role type"
    "Status" @(850,0) w=100 note="User status"
    "Created" @(950,0) w=200 note="Account creation time"
    "Actions" @(1150,0) w=200 note="Action buttons"
  #
    "1" @(0,0) w=80
    "John Doe" @(80,0) w=200
    "john@example.com" @(280,0) w=300
    "13800138001" @(580,0) w=150
    "Admin" @(730,0) w=120
    "Active" @(850,0) w=100 c=#4CAF50
    "2024-01-15" @(950,0) w=200
    ["Edit"] @(1150,0) w=60 h=32 note="[Secondary Button] Open edit user modal. Pre-fill current user info"
    ["Delete"] @(1220,0) w=60 h=32 bg=#f44336 c=white note="[Secondary Button] Delete this user.
- Show confirmation dialog
- Delete user after confirmation"
```

### 2. Sidebar
- Fixed on the left side of the page `@(0,0)`
- Logo at the top, menu items vertically arranged
- Width: 200-280px
- Menu item height: 40-48px

### 3. Top Bar
- Fixed at the top of the content area
- Breadcrumb on the left, action buttons on the right
- Height: 56-64px

### 4. Statistics Cards
- Use rounded rectangle `()`
- Horizontally arranged, using absolute coordinates
- Contains title and number
- Size: 200-300px wide, 100-140px high

### 5. Data Table
- Core of admin dashboard
- Width fills available space
- Header with background color distinction
- Actions column on the rightmost
- Row height: 40-48px

### 6. Form Layout
- Two or three column layout, using absolute coordinates
- Label + input field combination
- Important fields in the top left
- Buttons placed at the bottom, right-aligned

## 4. Common Patterns

### User List Page
- Top search/filter bar
- Batch action buttons
- Data table (multi-select, actions column)
- Pagination controls

### Data Statistics Page
- Multiple statistics cards
- Chart placeholders
- Time range selector

### Form Edit Page
- Breadcrumb navigation
- Form (multi-column layout)
- Save/Cancel buttons

### Settings Page
- Grouped settings items
- Switch, dropdown, input field combinations
- Save button

## 5. Page Organization Rules

**Each SolarWire code block handles only one independent view:**

| Situation | Handling Method |
|-----------|-----------------|
| Modals/Dialogs | Separate SolarWire fragment |
| Different Page States | Separate fragment for each state |
| Tab Switching | Separate fragment for each tab |

## 6. Note Writing Guidelines

**Core Principle: All element descriptions integrated into wireframe notes for "what you see is what you read"**

### Element-level Note

Every UI element should have detailed note description, use 【】 tags to identify element types:

- [Primary Button], [Secondary Button]: Action buttons
- [Input Field], [Dropdown]: Input elements
- [Link]: Text links
- [Icon]: Icon buttons
- [Card]: Card containers
- [Table]: Data tables

### Content Forbidden in Notes

- ❌ Visual details: Colors, fonts, border-radius, shadows, animation effects
- ❌ Technical implementation: API names, database fields, encryption methods
- ❌ Size values: Width, height, spacing

## 7. PRD Specific Requirements

### Admin-specific Field Definitions

```markdown
### Admin Dashboard Fields

| Field Name | Type | Description |
|------------|------|-------------|
| operatorId | string | Operator ID |
| operateTime | datetime | Operation time |
| operateType | string | Operation type: Add/Edit/Delete/Export |
| ipAddress | string | Operation IP address |
```

### Admin-specific Business Rules

```markdown
### Admin Dashboard Business Rules

1. **Permission Rules**
   - Super Admin: Full permissions
   - Admin: Can view and edit, cannot delete
   - Operator: Can only view and export
   - Operation Log: All operations are logged

2. **Data Rules**
   - Pagination: Default 20 items per page
   - Sorting: Default by creation time descending
   - Filtering: Supports multi-condition combined filtering
   - Export: Maximum 10000 items per export

3. **Security Rules**
   - Sensitive operations require secondary confirmation
   - Batch deletion requires verification code
   - Login timeout: Auto logout after 30 minutes of inactivity
```
