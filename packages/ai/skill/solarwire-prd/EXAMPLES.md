# SolarWire PRD - Note Writing Examples

> This file contains detailed examples for writing notes in SolarWire wireframes.
> Read this file when you need reference for specific element types or complex scenarios.

---

## Quick Navigation

- [SolarWire PRD - Note Writing Examples](#solarwire-prd---note-writing-examples)
  - [Quick Navigation](#quick-navigation)
  - [Interactive Elements](#interactive-elements)
    - [Button with Permission Control](#button-with-permission-control)
    - [Batch Operations](#batch-operations)
    - [Form Submission](#form-submission)
  - [Input Elements](#input-elements)
    - [Input Field with Validation](#input-field-with-validation)
    - [Search Bar with Filters](#search-bar-with-filters)
    - [Data Linkage (Cascading Select)](#data-linkage-cascading-select)
  - [Data Display Elements](#data-display-elements)
    - [Data Table](#data-table)
    - [Table with Actions Column](#table-with-actions-column)
    - [Statistics Card](#statistics-card)
    - [Status Badge](#status-badge)
    - [Dropdown Options](#dropdown-options)
    - [Calculated Field](#calculated-field)
  - [Navigation Elements](#navigation-elements)
    - [Pagination Component](#pagination-component)
  - [State Handling](#state-handling)
    - [Loading States](#loading-states)
    - [Empty State Handling](#empty-state-handling)
  - [Common Mistakes](#common-mistakes)
    - [Missing Permission Control](#missing-permission-control)
    - [Incomplete Error Handling](#incomplete-error-handling)
    - [Missing Data Source Details](#missing-data-source-details)
  - [Tooltip/Toast Examples](#tooltiptoast-examples)
  - [Chart Elements](#chart-elements)
    - [Key Syntax Rules](#key-syntax-rules)
    - [Line Chart](#line-chart)
    - [Bar Chart](#bar-chart)
    - [Pie Chart](#pie-chart)
    - [Area Chart](#area-chart)
    - [Simple Chart Notation](#simple-chart-notation)
    - [Chart Element Summary](#chart-element-summary)
    - [Anchor Point Calculation for Circles](#anchor-point-calculation-for-circles)
    - [Chart Color Palette](#chart-color-palette)
  - [Timeline \& Log Elements](#timeline--log-elements)
    - [Timeline](#timeline)
    - [Activity Log](#activity-log)
    - [Notification List](#notification-list)
    - [Comment Thread](#comment-thread)
    - [Timeline \& Log Element Summary](#timeline--log-element-summary)
    - [Timeline Status Colors](#timeline-status-colors)
    - [Activity Log Action Types](#activity-log-action-types)

---

## Interactive Elements

### Button with Permission Control

```solarwire
["Delete"] @(100,50) w=80 h=36 note="Delete button
1. Permission control
   - Visible: Users with 'delete_permission' role
   - Hidden: Users without permission (not just disabled)
   - Disabled: When item status is 'locked' or 'archived'
2. Click action
   - Show confirmation modal: 'Are you sure you want to delete?'
   - Execute delete on confirmation
3. Success handling
   - Display Toast: 'Deleted successfully'
   - Refresh list data
   - Update related statistics
4. Failure handling
   - Permission denied: 'You do not have permission to delete'
   - Item locked: 'This item is locked and cannot be deleted'
   - Network error: 'Network error, please try again'
   - Server error: 'Operation failed, please contact support'
5. Loading state
   - Show loading spinner while deleting
   - Disable button during operation
   - Prevent double-click"
```

---

### Batch Operations

```solarwire
["Batch Delete"] @(100,50) w=100 h=36 note="Batch delete button
1. Visibility conditions
   - Show: When ≥ 1 items selected
   - Hide: When no items selected
   - Disabled: When selected items include locked/archived items
2. Selection rules
   - Select all: Checkbox in table header
   - Max selection: 100 items at once
   - Show count: 'Selected 5 items'
3. Permission control
   - Visible: Users with 'batch_delete' permission
   - Can only delete items user has permission for
   - Show warning for items without permission
4. Click action
   - Show confirmation: 'Delete 5 selected items?'
   - List items to be deleted
   - Warn about locked items if any
5. Execution
   - Process one by one or in batch
   - Show progress: 'Deleting 3/5...'
   - Allow cancel during execution
6. Result handling
   - Success: 'Successfully deleted 5 items'
   - Partial: 'Deleted 3 items, 2 failed'
   - Failed items: List reasons for failure
   - Refresh list after completion"
```

---

### Form Submission

```solarwire
["Submit"] @(100,50) w=120 h=40 note="Submit form button
1. Pre-submission validation
   - Validate all required fields
   - Validate field formats (email, phone, etc.)
   - Validate business rules (date range, dependencies)
   - Scroll to first error field if validation fails
2. Submission state
   - Disable button during submission
   - Show loading spinner
   - Prevent form resubmission (double-click protection)
   - Disable all form inputs during submission
3. Success handling
   - Show success Toast: 'Submitted successfully'
   - Redirect to list page or detail page
   - Pass new record ID if creating
4. Failure handling
   - Validation error: Highlight fields, show error messages
   - Network error: 'Network error, please try again'
   - Server error: Show error message from server
   - Timeout: 'Request timeout, please try again'
   - Permission denied: 'You do not have permission'
5. Retry mechanism
   - Allow retry on network/timeout errors
   - Preserve form data for retry
   - Do not retry on validation/permission errors"
```

---

## Input Elements

### Input Field with Validation

```solarwire
["请输入手机号"] @(100,50) w=280 h=40 note="Phone number input
1. Input rules
   - Format: 11-digit Chinese mobile number
   - Allowed characters: Digits only
   - Max length: 11 characters
   - Auto-format: None (no spaces or dashes)
2. Validation
   - Required: Cannot be empty
   - Format check: Must start with 1, second digit 3-9
   - Error message: '请输入正确的手机号'
   - Validate on: Blur (not on every keystroke)
3. Display rules
   - Placeholder: '请输入手机号' (gray, italic)
   - Focus: Blue border highlight
   - Error: Red border + error message below
   - Valid: Green checkmark icon on right
4. Business rules
   - Unique: Phone number must not already exist in system
   - Duplicate check: On blur, show '该手机号已存在' if duplicate"
```

---

### Search Bar with Filters

```solarwire
["Search by name, phone..."] @(100,50) w=300 h=40 note="Search input
1. Input rules
   - Min length: 2 characters to trigger search
   - Max length: 50 characters
   - Allowed characters: Letters, numbers, Chinese, spaces
2. Search behavior
   - Debounce: 500ms delay after last keystroke
   - Trigger: Enter key or click search icon
   - Clear: Click X icon to clear and reset results
3. Search scope
   - Fields: Name, phone, email, company name
   - Match: Partial match, case-insensitive
   - Highlight: Matched text highlighted in results
4. No results
   - Show: 'No results found for [keyword]'
   - Suggest: 'Try different keywords or check spelling'
5. History
   - Save last 10 search terms
   - Show history on focus when input is empty"
```

---

### Data Linkage (Cascading Select)

```solarwire
["Select City"] @(100,50) w=200 h=36 note="City dropdown
1. Data source
   - Options depend on selected Province
   - Load cities dynamically when province changes
   - Cache: Store loaded cities for 5 minutes
2. Loading behavior
   - Show loading spinner while fetching
   - Disable until province is selected
   - Clear selection when province changes
3. Default behavior
   - Default: Show 'Please select province first'
   - After province selected: Show 'Select city'
   - Auto-select: If only one city, auto-select it
4. Error handling
   - Load failed: 'Failed to load cities, click to retry'
   - No cities: 'No cities available for this province'
5. Business rules
   - Required field
   - Save both province and city IDs
   - City must belong to selected province"
```

---

## Data Display Elements

### Data Table

```solarwire
## @(100,50) w=600 border=1 note="Customer list table
1. Data source
   - Customer data from Customer Management module
   - Filter: Current user's customers (based on data permission)
   - Default sort: Last follow-up time descending
2. Display rules
   - Customer name: Company name, required field
   - Contact: Primary contact name, show '-' if not set
   - Phone: Format as '138****8000' (mask middle 4 digits)
   - Status: Show as tag with color (Active=green, Frozen=red, Public Pool=gray)
   - Created: Format as YYYY-MM-DD, show relative time within 7 days (e.g., '3 days ago')
   - Empty state: Show 'No data' with illustration when list is empty
3. Business rules
   - Status mapping: 1=Active, 2=Frozen, 3=Public Pool
   - VIP customers: Show gold star icon before name
   - Overdue follow-up: Highlight row in yellow if >7 days since last follow-up
4. Sorting
   - Support sorting by: Created time, Last follow-up time, Customer level
   - Click column header to toggle ascending/descending"
```

---

### Table with Actions Column

```solarwire
## @(100,50) w=600 border=1 note="Order list table
1. Data source
   - Order data from Order Management module
   - Filter: Current user's accessible orders
   - Default sort: Created time descending
2. Display rules
   - Order ID: Click to view detail
   - Status: Show as colored tag
   - Amount: Format as ¥X,XXX.XX
   - Created: YYYY-MM-DD HH:mm
3. Actions column
   - View: Always visible, opens detail page
   - Edit: Visible for 'draft' and 'pending' status
   - Cancel: Visible for 'pending' status only
   - Delete: Visible for 'draft' status only, requires permission
   - Actions grouped in dropdown if > 3 actions
4. Permission control
   - Each action checks user permission
   - Hide actions user cannot perform
   - Show disabled state for conditionally unavailable actions
5. Row behavior
   - Click row: View detail
   - Checkbox: Select for batch operations
   - Highlight: Hover effect, selected state
6. Sorting
   - Click column header to sort
   - Show sort indicator (↑/↓)
   - Support: Order ID, Amount, Created time, Status"
```

---

### Statistics Card

Modern card design with visual hierarchy and icon support.

```solarwire
!title="Statistics Card"
!c=#111827
!size=13
!bg=#F9FAFB

// Page background
[] @(0,0) w=600 h=200 bg=#F5F7FA

// Statistics Card 1 - Revenue
[] @(20,20) w=180 h=160 bg=#FFFFFF radius=12 note="Revenue statistics card
1. Data source
   - Sum of completed project amounts for current month
   - Filter: status='Completed' AND completion date in current month
2. Display rules
   - Format: ¥ with thousand separators
   - Large numbers: Show as '¥123.45万' if ≥ 10,000
   - Comparison: Show percentage change vs last month
3. Interactions
   - Click: Navigate to revenue detail page"

// Icon background
(()) @(40,40) w=40 h=40 bg=#EFF6FF radius=8
"💰" @(50,48) size=20

// Label
"本月营收" @(40,90) size=13 c=#6B7280

// Value
"¥ 1,234,567" @(40,115) size=24 bold c=#111827

// Trend
"↑ 15.2%" @(40,145) size=12 c=#22C55E
"较上月" @(90,145) size=12 c=#8C8C8C

// Statistics Card 2 - Orders
[] @(220,20) w=180 h=160 bg=#FFFFFF radius=12

(()) @(240,40) w=40 h=40 bg=#F0FDF4 radius=8
"📦" @(250,48) size=20

"本月订单" @(240,90) size=13 c=#8C8C8C
"1,234" @(240,115) size=24 bold c=#1A1A1A
"↑ 8.5%" @(240,145) size=12 c=#52C41A
"较上月" @(290,145) size=12 c=#8C8C8C

// Statistics Card 3 - Customers
[] @(420,20) w=160 h=160 bg=#FFFFFF radius=12

(()) @(440,40) w=40 h=40 bg=#FFFBEB radius=8
"👥" @(450,48) size=20

"新增客户" @(440,90) size=13 c=#8C8C8C
"256" @(440,115) size=24 bold c=#1A1A1A
"↓ 3.2%" @(440,145) size=12 c=#EF4444
"较上月" @(490,145) size=12 c=#8C8C8C
```

---

### Status Badge

Modern tag design with rounded corners and color coding.

```solarwire
!title="Status Badges"
!c=#333333
!size=13
!bg=#F5F7FA

// Page background
[] @(0,0) w=500 h=200 bg=#F5F7FA

// Section title
"Status Badge Styles" @(20,20) size=16 bold c=#1A1A1A

// Row 1 - Solid badges (filled background)
"Solid Style:" @(20,50) size=12 c=#8C8C8C

// Active - Green
[] @(20,75) w=70 h=28 bg=#52C41A radius=14 note="Active status
1. Data source: Status field = 1
2. Display: Green background, white text
3. Click: Filter by this status"
"Active" @(38,81) size=12 c=#FFFFFF bold center

// Pending - Blue
[] @(100,75) w=80 h=28 bg=#3B82F6 radius=14
"Pending" @(118,81) size=12 c=#FFFFFF bold center

// Frozen - Orange
[] @(190,75) w=70 h=28 bg=#F59E0B radius=14
"Frozen" @(208,81) size=12 c=#FFFFFF bold center

// Disabled - Red
[] @(270,75) w=80 h=28 bg=#D9001B radius=14
"Disabled" @(288,81) size=12 c=#FFFFFF bold center

// Row 2 - Outlined badges (border only)
"Outlined Style:" @(20,120) size=12 c=#8C8C8C

// Active - Green outline
[] @(20,145) w=70 h=28 bg=#FFFFFF radius=14 b=#52C41A
"Active" @(38,151) size=12 c=#52C41A bold center

// Pending - Blue outline
[] @(100,145) w=80 h=28 bg=#FFFFFF radius=14 b=#1890FF
"Pending" @(118,151) size=12 c=#1890FF bold center

// Frozen - Orange outline
[] @(190,145) w=70 h=28 bg=#FFFFFF radius=14 b=#FA8C16
"Frozen" @(208,151) size=12 c=#FA8C16 bold center

// Disabled - Red outline
[] @(270,145) w=80 h=28 bg=#FFFFFF radius=14 b=#D9001B
"Disabled" @(288,151) size=12 c=#D9001B bold center

// Row 3 - Subtle badges (light background)
"Subtle Style:" @(20,190) size=12 c=#8C8C8C

// Active - Light green
[] @(20,215) w=70 h=28 bg=#F6FFED radius=4
"Active" @(38,221) size=12 c=#52C41A bold center

// Pending - Light blue
[] @(100,215) w=80 h=28 bg=#E6F7FF radius=4
"Pending" @(118,221) size=12 c=#1890FF bold center

// Frozen - Light orange
[] @(190,215) w=70 h=28 bg=#FFF7E6 radius=4
"Frozen" @(208,221) size=12 c=#FA8C16 bold center

// Disabled - Light red
[] @(270,215) w=80 h=28 bg=#FFF1F0 radius=4
"Disabled" @(288,221) size=12 c=#D9001B bold center

// Status color mapping reference
"Status Color Mapping:" @(380,50) size=12 bold c=#1A1A1A
"Active → Green (#52C41A)" @(380,75) size=11 c=#8C8C8C
"Pending → Blue (#1890FF)" @(380,95) size=11 c=#8C8C8C
"Frozen → Orange (#FA8C16)" @(380,115) size=11 c=#8C8C8C
"Disabled → Red (#D9001B)" @(380,135) size=11 c=#8C8C8C
```

---

### Dropdown Options

```solarwire
["请选择客户级别"] @(100,50) w=200 h=36 note="Customer level dropdown
1. Data source
   - Options from system dictionary 'customer_level'
   - Values: VIP, Important, Normal
2. Display rules
   - Default: Show placeholder '请选择客户级别'
   - Selected: Show selected option text
   - Options list: Show all options with icons (VIP=⭐, Important=●, Normal=○)
3. Business rules
   - Required field: Must select one option
   - Default value for new customer: Normal
   - VIP level requires manager approval to assign"
```

---

### Calculated Field

```solarwire
"¥ 12,345.00" @(100,50) note="Order total amount
1. Data source
   - Calculation formula: Subtotal + Shipping - Discount
   - Subtotal = Sum of (Unit price × Quantity) for all items
   - Shipping: Based on delivery method and region
   - Discount: Applied coupon or promotional discount
2. Display rules
   - Format: ¥ with 2 decimal places
   - Currency symbol: ¥ for CNY, $ for USD
   - Zero: Show '¥ 0.00'
3. Business rules
   - Minimum order: ¥ 100.00
   - Free shipping: Orders over ¥ 500.00
   - Discount cap: Maximum 50% off"
```

---

## Navigation Elements

### Pagination Component

```solarwire
["< 1 2 3 ... 10 >"] @(100,50) w=400 h=32 note="Pagination
1. Data source
   - Total count from API response
   - Current page from URL parameter or state
2. Display rules
   - Show: Total count, page numbers, page size selector
   - Format: 'Showing 1-20 of 156 items'
   - Page numbers: Show 5 adjacent pages max
   - Ellipsis: Use '...' for skipped pages
3. Page size options
   - Options: 10, 20, 50, 100 items per page
   - Default: 20 items
   - Remember: Save preference to user settings
4. Navigation
   - First/Last: Jump to first/last page
   - Prev/Next: Go to previous/next page
   - Page number: Click to jump to specific page
   - Jump: Input page number and press Enter
5. Behavior
   - Reset to page 1 when filters change
   - Reset to page 1 when page size changes
   - Disable Prev on first page, Next on last page
   - Preserve page state when navigating away and back"
```

---

## State Handling

### Loading States

```solarwire
["Loading..."] @(100,50) w=200 h=40 note="Loading state
1. When to show
   - Initial page load
   - Data refresh
   - After filter/search change
   - After pagination
2. Display options
   - Skeleton: Show placeholder structure
   - Spinner: Centered loading spinner
   - Overlay: Semi-transparent overlay with spinner
3. Behavior
   - Minimum display time: 300ms (avoid flash)
   - Timeout: Show retry after 30 seconds
   - Cancel: Allow user to cancel long operations
4. Error state
   - Show error message with retry button
   - Preserve filter/search conditions
   - Allow user to modify and retry"
```

---

### Empty State Handling

```solarwire
[] @(100,50) w=400 h=200 note="Empty state placeholder
1. Display rules
   - Show when: List is empty or no search results
   - Content: Illustration + 'No data' + 'Add new' button
   - Illustration: Generic empty state icon
2. Business rules
   - Different messages for different scenarios:
     - Empty list: 'No customers yet, add your first customer'
     - No search results: 'No results found for your search'
     - Filtered empty: 'No data matches current filters'"
```

**Empty Value Display Reference:**

| Data Type | Empty Display | Example |
|-----------|---------------|---------|
| Text | '-' or 'Not set' | "Contact: -" |
| Number | '0' or '--' | "Amount: ¥ --" |
| Date | '-' or 'Not specified' | "Last login: -" |
| Status | Default status | "Status: Pending" |
| List/Table | Empty state message | "No data available" |

---

## Common Mistakes

### Missing Permission Control

**❌ Bad:**
```solarwire
["Delete"] @(100,50) w=80 h=36 note="Delete button
1. Click action
   - Delete the item"
```

**✅ Good:**
```solarwire
["Delete"] @(100,50) w=80 h=36 note="Delete button
1. Permission control
   - Visible: Users with 'delete' permission
   - Hidden: Users without permission
   - Disabled: When item is locked
2. Click action
   - Show confirmation modal
   - Execute delete on confirmation
3. Failure handling
   - Permission denied: 'No permission to delete'
   - Item locked: 'Item is locked'
   - Network error: 'Network error, please retry'"
```

---

### Incomplete Error Handling

**❌ Bad:**
```solarwire
["Submit"] @(100,50) w=120 h=40 note="Submit button
1. Click action
   - Submit the form
2. Success handling
   - Show success message
3. Failure handling
   - Show error message"
```

**✅ Good:**
```solarwire
["Submit"] @(100,50) w=120 h=40 note="Submit button
1. Pre-submission validation
   - Validate all required fields
   - Validate field formats
   - Scroll to first error
2. Submission state
   - Disable button, show loading spinner
   - Prevent double-click
3. Success handling
   - Toast: 'Submitted successfully'
   - Redirect to list page
4. Failure handling
   - Validation error: Highlight fields
   - Network error: 'Network error, please retry'
   - Server error: Show server message
   - Timeout: 'Request timeout, please retry'
   - Permission denied: 'No permission'"
```

---

### Missing Data Source Details

**❌ Bad:**
```solarwire
## @(100,50) w=600 border=1 note="User list table
1. Data source
   - User data
2. Display rules
   - Name: User name
   - Status: User status"
```

**✅ Good:**
```solarwire
## @(100,50) w=600 border=1 note="User list table
1. Data source
   - User data from User Management module
   - Filter: Active users only (status=1)
   - Default sort: Created time descending
   - Permission: Current user's department users
2. Display rules
   - Name: Full name, required, click to view detail
   - Status: 1=Active (green), 0=Disabled (red)
   - Phone: Format as 138****8000
   - Created: YYYY-MM-DD HH:mm
   - Empty: Show 'No data' with illustration
3. Actions column
   - View: Always visible
   - Edit: Visible for Active status
   - Disable: Visible for Active status, requires permission
4. Sorting
   - Support: Name, Created time, Status
   - Click header to toggle sort"
```

---

## Tooltip/Toast Examples

**Tooltip:**
```solarwire
["?"] @(100,50) w=16 h=16 note="Help icon
1. Tooltip content
   - Hover to show: 'Supports phone number or email login'
   - Position: Top of icon
   - Max width: 200px, wrap text if needed"
```

**Toast (describe in button note):**
```solarwire
["Save"] @(100,50) w=80 h=36 note="Save button
1. Click action
   - Validate and save form data
2. Success handling
   - Toast: 'Saved successfully' (auto-dismiss after 3s)
3. Failure handling
   - Toast: 'Save failed, please retry' (manual dismiss)"
```

---

## Chart Elements

### Key Syntax Rules

| Rule | Description |
|------|-------------|
| Line syntax | `-- @(x1,y1)->(x2,y2)` (no spaces around arrow) |
| Circle | Use `(())` for circles, `()` for rounded rectangles |
| Rectangle | Use `[]` for rectangles |
| Anchor point | All elements use top-left corner as anchor |
| Circle center | To center circle at (cx,cy), use anchor `(cx-r, cy-r)` where r = radius |

---

### Line Chart

Use `--` (line) to connect data points, `(())` (circle) for data points.

```solarwire
!title="Sales Trend Chart"
!c=#333333
!size=13
!bg=#F5F7FA

// Page background
[] @(0,0) w=600 h=400 bg=#F5F7FA

// Card container
[] @(20,20) w=560 h=360 bg=#FFFFFF radius=12 note="Sales trend line chart
1. Data source
   - Monthly sales data from Sales module
   - Time range: Last 6 months
   - Blue line: Actual sales
   - Orange dashed line: Target
2. Display rules
   - Y-axis: Sales amount (0-100k)
   - X-axis: Month (Jan-Jun)
   - Hover: Show tooltip with exact value
3. Interactions
   - Hover on point: Show tooltip
   - Click point: Navigate to detail"

// Header
"Monthly Sales Trend" @(40,40) size=18 bold c=#1A1A1A
"(Last 6 months)" @(200,42) size=12 c=#8C8C8C

// Time range selector
["6 Months"] @(480,35) w=80 h=28 bg=#1890FF radius=4 c=#FFFFFF

// Y-axis labels
"100k" @(25,80) c=#8C8C8C size=11
"80k" @(25,130) c=#8C8C8C size=11
"60k" @(25,180) c=#8C8C8C size=11
"40k" @(25,230) c=#8C8C8C size=11
"20k" @(25,280) c=#8C8C8C size=11
"0" @(35,330) c=#8C8C8C size=11

// X-axis labels
"Jan" @(70,345) c=#6B7280 size=11
"Feb" @(150,345) c=#595959 size=11
"Mar" @(230,345) c=#595959 size=11
"Apr" @(310,345) c=#595959 size=11
"May" @(390,345) c=#595959 size=11
"Jun" @(470,345) c=#595959 size=11

// Grid lines (horizontal)
-- @(60,90)->(540,90) c=#E5E7EB
-- @(60,140)->(540,140) c=#F0F0F0
-- @(60,190)->(540,190) c=#F0F0F0
-- @(60,240)->(540,240) c=#F0F0F0
-- @(60,290)->(540,290) c=#F0F0F0

// Line 1 (Sales) - Blue line
-- @(80,280)->(160,250) c=#1890FF
-- @(160,250)->(240,220) c=#1890FF
-- @(240,220)->(320,180) c=#1890FF
-- @(320,180)->(400,200) c=#1890FF
-- @(400,200)->(480,150) c=#1890FF

// Data points (circles centered at line endpoints)
// Anchor = center - radius = (80-4, 280-4) = (76, 276)
(()) @(76,276) w=8 h=8 bg=#1890FF radius=4
(()) @(156,246) w=8 h=8 bg=#1890FF radius=4
(()) @(236,216) w=8 h=8 bg=#1890FF radius=4
(()) @(316,176) w=8 h=8 bg=#1890FF radius=4
(()) @(396,196) w=8 h=8 bg=#1890FF radius=4
(()) @(476,146) w=8 h=8 bg=#1890FF radius=4

// Line 2 (Target) - Orange dashed line
-- @(80,260)->(160,240) c=#FA8C16 dash=5,5
-- @(160,240)->(240,220) c=#FA8C16 dash=5,5
-- @(240,220)->(320,200) c=#FA8C16 dash=5,5
-- @(320,200)->(400,180) c=#FA8C16 dash=5,5
-- @(400,180)->(480,160) c=#FA8C16 dash=5,5

// Legend
-- @(400,55)->(430,55) c=#1890FF
"Sales" @(440,50) size=11 c=#595959
-- @(480,55)->(510,55) c=#FA8C16 dash=5,5
"Target" @(520,50) size=11 c=#595959
```

---

### Bar Chart

Modern bar chart with card container and visual hierarchy.

```solarwire
!title="Department Performance"
!c=#333333
!size=13
!bg=#F5F7FA

// Page background
[] @(0,0) w=600 h=450 bg=#F5F7FA

// Chart container
[] @(20,20) w=560 h=410 bg=#FFFFFF radius=12 note="Department performance bar chart
1. Data source
   - Department KPI data from HR module
   - Time period: Current quarter
   - Blue: Target completion rate
   - Green: Actual completion rate
2. Display rules
   - Y-axis: Completion rate (0-100%)
   - X-axis: Department names
   - Bar width: 40px
3. Interactions
   - Hover: Show tooltip with percentage
   - Click bar: Navigate to department detail"

// Header
"Department Performance" @(40,40) size=18 bold c=#1A1A1A
"(Q4 2024)" @(200,42) size=12 c=#8C8C8C

// Filter pills
["All Depts"] @(420,35) w=70 h=28 bg=#1890FF radius=14 c=#FFFFFF
["This Year"] @(500,35) w=70 h=28 bg=#FFFFFF radius=14 c=#595959 b=#E5E7EB

// Y-axis labels
"100%" @(35,90) c=#8C8C8C size=11
"80%" @(35,140) c=#8C8C8C size=11
"60%" @(35,190) c=#8C8C8C size=11
"40%" @(35,240) c=#8C8C8C size=11
"20%" @(35,290) c=#8C8C8C size=11
"0%" @(40,340) c=#8C8C8C size=11

// Grid lines (horizontal)
-- @(70,100)->(540,100) c=#F0F0F0
-- @(70,150)->(540,150) c=#F0F0F0
-- @(70,200)->(540,200) c=#F0F0F0
-- @(70,250)->(540,250) c=#F0F0F0
-- @(70,300)->(540,300) c=#F0F0F0
-- @(70,350)->(540,350) c=#E5E5E5

// Bars (anchor at top-left corner)
// Sales Dept: Target 90%, Actual 75%
[] @(100,120) w=40 h=180 bg=#1890FF radius=4
[] @(150,150) w=40 h=150 bg=#52C41A radius=4
"Sales" @(110,370) c=#1A1A1A size=12

// Marketing Dept: Target 80%, Actual 65%
[] @(220,140) w=40 h=160 bg=#1890FF radius=4
[] @(270,170) w=40 h=130 bg=#52C41A radius=4
"Marketing" @(215,370) c=#1A1A1A size=12

// Tech Dept: Target 100%, Actual 85%
[] @(340,100) w=40 h=200 bg=#1890FF radius=4
[] @(390,130) w=40 h=170 bg=#52C41A radius=4
"Tech" @(350,370) c=#1A1A1A size=12

// Operations Dept: Target 70%, Actual 55%
[] @(460,160) w=40 h=140 bg=#1890FF radius=4
[] @(510,190) w=40 h=110 bg=#52C41A radius=4
"Operations" @(450,370) c=#1A1A1A size=12

// Legend
[] @(380,55) w=12 h=12 bg=#1890FF radius=2
"Target" @(398,53) size=11 c=#595959
[] @(450,55) w=12 h=12 bg=#52C41A radius=2
"Actual" @(468,53) size=11 c=#595959
```

---

### Pie Chart

Use `(())` (circle) for pie/donut chart.

```solarwire
!title="Revenue Distribution"
!c=#333333
!size=13
!bg=#FFFFFF

// Chart container
[] @(50,50) w=400 h=350 bg=#FFFFFF b=#E5E5E5 note="Revenue distribution pie chart
1. Data source
   - Revenue data from Finance module
   - Time period: Current year
   - Currency: CNY
2. Display rules
   - Donut chart with center showing total
   - Segments sorted by value (descending)
   - Minimum segment: 5%
3. Interactions
   - Hover segment: Highlight and show tooltip
   - Click segment: Navigate to product detail"

// Chart title
"Revenue by Product Category" @(200,20) size=16 bold center

// Pie chart - using concentric circles
// Outer circle: center at (200,200), radius 100
// Anchor = (200-100, 200-100) = (100,100)
(()) @(100,100) w=200 h=200 bg=#1890FF

// Center circle (donut hole): radius 50
// Anchor = (200-50, 200-50) = (150,150)
(()) @(150,150) w=100 h=100 bg=#FFFFFF

// Center text
"Total" @(185,185) size=14 bold center
"¥1.2M" @(185,210) size=18 bold center c=#1890FF

// Legend
[] @(320,100) w=16 h=12 bg=#1890FF
"Product A 35%" @(340,98) size=12

[] @(320,130) w=16 h=12 bg=#52C41A
"Product B 25%" @(340,128) size=12

[] @(320,160) w=16 h=12 bg=#FA8C16
"Product C 20%" @(340,158) size=12

[] @(320,190) w=16 h=12 bg=#0EA5E9
"Product D 12%" @(340,188) size=12

[] @(320,220) w=16 h=12 bg=#A855F7
"Others 8%" @(340,218) size=12
```

---

### Area Chart

Use `[]` (rectangle) for area fill, `--` (line) for border.

```solarwire
!title="User Growth"
!c=#333333
!size=13
!bg=#FFFFFF

// Chart container
[] @(50,50) w=500 h=300 bg=#FFFFFF b=#E5E5E5 note="User growth area chart
1. Data source
   - User registration data from User module
   - Time range: Last 6 months
   - Metric: Total registered users
2. Display rules
   - Y-axis: User count (0-10k)
   - X-axis: Month (Jan-Jun)
   - Fill color: Blue with 20% opacity
   - Border: Solid blue line
3. Interactions
   - Hover: Show tooltip with exact count"

// Chart title
"User Growth Trend" @(250,20) size=16 bold center

// Y-axis labels
"10k" @(20,80) c=#9CA3AF size=12
"8k" @(20,130) c=#AAAAAA size=12
"6k" @(20,180) c=#AAAAAA size=12
"4k" @(20,230) c=#AAAAAA size=12
"2k" @(20,280) c=#AAAAAA size=12
"0" @(30,330) c=#AAAAAA size=12

// X-axis labels
"Jan" @(80,340) c=#AAAAAA size=12
"Feb" @(140,340) c=#AAAAAA size=12
"Mar" @(200,340) c=#AAAAAA size=12
"Apr" @(260,340) c=#AAAAAA size=12
"May" @(320,340) c=#AAAAAA size=12
"Jun" @(380,340) c=#AAAAAA size=12

// Grid lines (horizontal)
-- @(60,100)->(540,100) c=#F0F0F0
-- @(60,150)->(540,150) c=#F0F0F0
-- @(60,200)->(540,200) c=#F0F0F0
-- @(60,250)->(540,250) c=#F0F0F0
-- @(60,300)->(540,300) c=#F0F0F0

// Area fill (rectangles)
[] @(60,280) w=80 h=50 bg=#1890FF20
[] @(140,250) w=80 h=80 bg=#1890FF20
[] @(220,220) w=80 h=110 bg=#1890FF20
[] @(300,180) w=80 h=150 bg=#1890FF20
[] @(380,140) w=80 h=190 bg=#1890FF20

// Area border line
-- @(80,280)->(140,250) c=#1890FF
-- @(140,250)->(220,220) c=#1890FF
-- @(220,220)->(300,180) c=#1890FF
-- @(300,180)->(380,140) c=#1890FF
-- @(380,140)->(460,100) c=#1890FF

// Data points (circles)
(()) @(77,277) w=6 h=6 bg=#1890FF
(()) @(137,247) w=6 h=6 bg=#1890FF
(()) @(217,217) w=6 h=6 bg=#1890FF
(()) @(297,177) w=6 h=6 bg=#1890FF
(()) @(377,137) w=6 h=6 bg=#1890FF
(()) @(457,97) w=6 h=6 bg=#1890FF
```

---

### Simple Chart Notation

For quick wireframes, use simple placeholder:

```solarwire
"📈 Sales Trend" @(100,50) size=14 bold
[] @(50,100) w=200 h=100 bg=#E5E7EB note="Line chart placeholder
1. Data source: Monthly sales data
2. X-axis: Time
3. Y-axis: Amount"
```

```solarwire
"📊 Department Performance" @(100,50) size=14 bold
[] @(50,100) w=200 h=120 bg=#F5F5F5 note="Bar chart placeholder
1. Data source: Department KPI data
2. X-axis: Department
3. Y-axis: Completion rate"
```

```solarwire
"🥧 Revenue Distribution" @(100,50) size=14 bold
(()) @(100,120) w=100 h=100 bg=#F5F5F5 note="Pie chart placeholder
1. Data source: Revenue by category
2. Segments: Product A, B, C, Others"
```

---

### Chart Element Summary

| Chart Type | SolarWire Element | Description |
|------------|-------------------|-------------|
| Line Chart | `--` (line) | Connect data points: `-- @(x1,y1)->(x2,y2)` |
| Bar Chart | `[]` (rectangle) | Use rectangles for bars |
| Pie Chart | `(())` (circle) | Use circles for pie/donut |
| Area Chart | `[]` + `--` | Filled rectangles + border line |
| Scatter Plot | `(())` (small circles) | Small circles for data points |

---

### Anchor Point Calculation for Circles

Since all elements use top-left corner as anchor, to place a circle's center at a specific point:

```
Circle center: (cx, cy)
Circle diameter: d (width = height = d)
Radius: r = d / 2

Top-left anchor: (cx - r, cy - r)
```

**Example:**
```
// Want circle center at (80, 280) with diameter 8
// Radius = 4
// Anchor = (80-4, 280-4) = (76, 276)
(()) @(76,276) w=8 h=8 bg=#1890FF
```

---

### Chart Color Palette (Tailwind CSS)

| Purpose | Tailwind | Hex |
|---------|----------|-----|
| Primary | blue-500 | #3B82F6 |
| Primary light | blue-50 | #EFF6FF |
| Success | green-500 | #22C55E |
| Success light | green-50 | #F0FDF4 |
| Warning | amber-500 | #F59E0B |
| Warning light | amber-50 | #FFFBEB |
| Error | red-500 | #EF4444 |
| Error light | red-50 | #FEF2F2 |
| Info | sky-500 | #0EA5E9 |
| Info light | sky-50 | #F0F9FF |
| Secondary | purple-500 | #A855F7 |
| Secondary light | purple-50 | #FAF5FF |
| Neutral | gray-400 | #9CA3AF |

---

## Timeline & Log Elements

### Timeline

Modern vertical timeline with status indicators and visual hierarchy.

```solarwire
!title="Order Timeline"
!c=#333333
!size=13
!bg=#F5F7FA

// Page background
[] @(0,0) w=450 h=480 bg=#F5F7FA

// Card container
[] @(20,20) w=410 h=440 bg=#FFFFFF radius=12 note="Order timeline
1. Data source
   - Order status history from Order module
   - Sorted by time descending
2. Display rules
   - Latest status at top
   - Completed: Green circle with checkmark
   - Current: Blue circle with pulse animation
   - Pending: Gray circle
3. Interactions
   - Click node: Show detail popup"

// Header
"Order Progress" @(40,40) size=18 bold c=#1A1A1A
"Order #ORD-2024-001234" @(40,65) size=13 c=#8C8C8C

// Timeline container
[] @(40,90) w=370 h=340 bg=#F9FAFB radius=8

// Timeline vertical line
-- @(70,110)->(70,400) c=#E5E5E5 w=2

// Node 1 - Completed (Order Placed)
// Green circle with checkmark
(()) @(58,110) w=24 h=24 bg=#52C41A radius=12
"✓" @(64,115) size=14 c=#FFFFFF bold

// Content card
[] @(95,105) w=300 h=55 bg=#FFFFFF radius=8
"Order Placed" @(110,112) size=14 bold c=#1A1A1A
"2024-01-15 10:30" @(110,132) size=12 c=#8C8C8C
"Order created by user" @(200,132) size=12 c=#595959

// Node 2 - Completed (Payment Received)
(()) @(58,175) w=24 h=24 bg=#52C41A radius=12
"✓" @(64,180) size=14 c=#FFFFFF bold

[] @(95,170) w=300 h=55 bg=#FFFFFF radius=8
"Payment Received" @(110,177) size=14 bold c=#1A1A1A
"2024-01-15 10:35" @(110,197) size=12 c=#8C8C8C
"¥1,234.00 confirmed" @(200,197) size=12 c=#52C41A

// Node 3 - Current (Processing) - highlighted
// Blue circle with pulse effect (represented by light blue ring)
(()) @(50,240) w=24 h=24 bg=#E6F7FF radius=12
(()) @(54,244) w=16 h=16 bg=#1890FF radius=8
"3" @(58,248) size=10 c=#FFFFFF bold

// Content card - highlighted
[] @(95,235) w=300 h=70 bg=#E6F7FF radius=8 b=#1890FF
"Processing" @(110,242) size=14 bold c=#1890FF
"2024-01-15 11:00" @(110,262) size=12 c=#8C8C8C
"Order is being prepared" @(110,282) size=12 c=#595959

// Node 4 - Pending (Shipped)
(()) @(58,315) w=24 h=24 bg=#F5F5F5 radius=12
"4" @(64,320) size=10 c=#AAAAAA bold

[] @(95,310) w=300 h=45 bg=#FFFFFF radius=8
"Shipped" @(110,317) size=14 c=#AAAAAA
"Estimated: 2024-01-16" @(200,337) size=12 c=#AAAAAA

// Node 5 - Pending (Delivered)
(()) @(58,365) w=24 h=24 bg=#F5F5F5 radius=12
"5" @(64,370) size=10 c=#AAAAAA bold

[] @(95,360) w=300 h=45 bg=#FFFFFF radius=8
"Delivered" @(110,367) size=14 c=#AAAAAA
"Estimated: 2024-01-18" @(200,387) size=12 c=#AAAAAA
```

---

### Activity Log

Modern card-based activity feed with clear visual hierarchy.

```solarwire
!title="Activity Log"
!c=#333333
!size=13
!bg=#F5F7FA

// Page container with modern background
[] @(0,0) w=600 h=500 bg=#F5F7FA

// Header section
[] @(20,20) w=560 h=60 bg=#FFFFFF radius=8
"Recent Activity" @(40,40) size=18 bold c=#1A1A1A
"(24 actions today)" @(160,42) size=13 c=#8C8C8C

// Filter pills
["All Types"] @(400,35) w=80 h=28 bg=#1890FF c=#FFFFFF radius=14
["Users"] @(490,35) w=70 h=28 bg=#FFFFFF c=#666666 radius=14 b=#E5E5E5
["Date"] @(570,35) w=60 h=28 bg=#FFFFFF c=#666666 radius=14 b=#E5E5E5

// Activity Card 1 - Edit action
[] @(20,90) w=560 h=72 bg=#FFFFFF radius=8 note="Activity item - Edit
1. Data: User John Doe edited Customer Profile #123
2. Time: 5 minutes ago
3. Click: Navigate to item detail"

// Icon circle with edit symbol
(()) @(40,110) w=36 h=36 bg=#E6F7FF radius=18
"✏️" @(50,118) size=16

// Content
"John Doe" @(90,102) size=14 bold c=#1A1A1A
"edited" @(160,102) size=14 c=#8C8C8C
"Customer Profile #123" @(200,102) size=14 c=#1890FF
"Updated contact information and address" @(90,122) size=13 c=#595959
"5 minutes ago" @(90,142) size=12 c=#BFBFBF

// Action button
["View"] @(520,110) w=48 h=28 bg=#FFFFFF c=#1890FF radius=4 b=#1890FF

// Activity Card 2 - Create action
[] @(20,170) w=560 h=72 bg=#FFFFFF radius=8

(()) @(40,190) w=36 h=36 bg=#F6FFED radius=18
"➕" @(50,198) size=16

"Jane Smith" @(90,182) size=14 bold c=#1A1A1A
"created" @(165,182) size=14 c=#8C8C8C
"New Order #456" @(215,182) size=14 c=#1890FF
"Order total: ¥12,345.00" @(90,202) size=13 c=#595959
"15 minutes ago" @(90,222) size=12 c=#BFBFBF

["View"] @(520,190) w=48 h=28 bg=#FFFFFF c=#1890FF radius=4 b=#1890FF

// Activity Card 3 - Delete action
[] @(20,250) w=560 h=72 bg=#FFFFFF radius=8

(()) @(40,270) w=36 h=36 bg=#FFF7E6 radius=18
"🗑️" @(50,278) size=16

"Mike Johnson" @(90,262) size=14 bold c=#1A1A1A
"deleted" @(175,262) size=14 c=#8C8C8C
"Draft Report #789" @(225,262) size=14 c=#D9001B
"Permanently removed from system" @(90,282) size=13 c=#595959
"1 hour ago" @(90,302) size=12 c=#BFBFBF

["View"] @(520,270) w=48 h=28 bg=#FFFFFF c=#1890FF radius=4 b=#1890FF

// Activity Card 4 - Export action
[] @(20,330) w=560 h=72 bg=#FFFFFF radius=8

(()) @(40,350) w=36 h=36 bg=#FAF5FF radius=18
"📤" @(50,358) size=16

"Sarah Wilson" @(90,342) size=14 bold c=#1A1A1A
"exported" @(175,342) size=14 c=#8C8C8C
"Sales Report Q4" @(230,342) size=14 c=#1890FF
"Excel file, 2.3 MB" @(90,362) size=13 c=#595959
"2 hours ago" @(90,382) size=12 c=#BFBFBF

["View"] @(520,350) w=48 h=28 bg=#FFFFFF c=#1890FF radius=4 b=#1890FF

// Load more button
["Load More Activities"] @(220,420) w=160 h=40 bg=#FFFFFF c=#1890FF radius=8 b=#E5E5E5
```

---

### Notification List

Modern notification panel with unread indicators and clear visual hierarchy.

```solarwire
!title="Notifications"
!c=#333333
!size=13
!bg=#F5F7FA

// Panel container
[] @(0,0) w=420 h=520 bg=#FFFFFF radius=12

// Header
"Notifications" @(20,20) size=18 bold c=#1A1A1A
"(3 unread)" @(130,22) size=13 c=#1890FF
["Mark all as read"] @(280,15) w=100 h=28 bg=#FFFFFF c=#1890FF radius=4 b=#E5E5E5 size=11

// Divider
-- @(0,50)->(420,50) c=#F0F0F0

// Notification 1 - Unread with blue indicator
[] @(0,55) w=420 h=80 bg=#F6FAFF note="Unread notification
1. Type: Approval
2. Title: Order #123 approved
3. Click: Mark as read and navigate"

// Unread indicator (blue dot)
(()) @(15,90) w=8 h=8 bg=#1890FF radius=4

// Icon
(()) @(35,80) w=40 h=40 bg=#F6FFED radius=20
"✅" @(47,90) size=18

// Content
"Order #123 approved" @(90,70) size=14 bold c=#1A1A1A
"Your purchase request has been approved by manager" @(90,90) size=13 c=#595959
"2 minutes ago" @(90,110) size=12 c=#BFBFBF

// Notification 2 - Unread
[] @(0,135) w=420 h=80 bg=#F6FAFF

(()) @(15,170) w=8 h=8 bg=#1890FF radius=4

(()) @(35,160) w=40 h=40 bg=#FFF7E6 radius=20
"⚠️" @(47,170) size=18

"Low stock alert" @(90,150) size=14 bold c=#1A1A1A
"Product SKU-001 is running low (5 items remaining)" @(90,170) size=13 c=#595959
"15 minutes ago" @(90,190) size=12 c=#BFBFBF

// Notification 3 - Unread
[] @(0,215) w=420 h=80 bg=#F6FAFF

(()) @(15,250) w=8 h=8 bg=#1890FF radius=4

(()) @(35,240) w=40 h=40 bg=#F9F0FF radius=20
"💬" @(47,250) size=18

"New comment on your post" @(90,230) size=14 bold c=#1A1A1A
"Jane replied: 'Great work! Looking forward to it.'" @(90,250) size=13 c=#595959
"1 hour ago" @(90,270) size=12 c=#BFBFBF

// Divider
-- @(0,295)->(420,295) c=#F0F0F0

// Notification 4 - Read (no blue indicator, white background)
[] @(0,300) w=420 h=80 bg=#FFFFFF

(()) @(35,325) w=40 h=40 bg=#F5F5F5 radius=20
"📧" @(47,335) size=18

"Weekly report ready" @(90,315) size=14 c=#595959
"Your weekly sales report is ready to download" @(90,335) size=13 c=#8C8C8C
"Yesterday" @(90,355) size=12 c=#BFBFBF

// Notification 5 - Read
[] @(0,380) w=420 h=80 bg=#FFFFFF

(()) @(35,405) w=40 h=40 bg=#F5F5F5 radius=20
"👤" @(47,415) size=18

"New team member joined" @(90,395) size=14 c=#595959
"Mike Johnson joined your team as Developer" @(90,415) size=13 c=#8C8C8C
"2 days ago" @(90,435) size=12 c=#BFBFBF

// View all button
["View All Notifications"] @(110,475) w=200 h=36 bg=#1890FF c=#FFFFFF radius=8
```

---

### Comment Thread

Modern comment design with nested replies and visual hierarchy.

```solarwire
!title="Comments"
!c=#333333
!size=13
!bg=#F5F7FA

// Page background
[] @(0,0) w=550 h=480 bg=#F5F7FA

// Card container
[] @(20,20) w=510 h=440 bg=#FFFFFF radius=12 note="Comment thread
1. Data source
   - Comments from Comment module
   - Filter: Related to current item
   - Sort: Newest first
2. Display rules
   - Avatar: User profile image
   - Author: User name with role badge
   - Content: Comment text, max 500 chars
   - Time: Relative time
   - Actions: Reply, Edit (own), Delete (own/moderator)
3. Interactions
   - Reply: Expand reply input
   - Edit: Inline edit mode
   - Delete: Confirmation modal"

// Header
"Comments" @(40,40) size=18 bold c=#1A1A1A
"(12)" @(115,42) size=14 c=#8C8C8C

// Sort dropdown
["Newest First"] @(420,35) w=90 h=28 bg=#FFFFFF radius=4 b=#E5E5E5 c=#595959

// Comment 1 - Main comment with avatar
// Avatar circle
(()) @(40,80) w=40 h=40 bg=#1890FF radius=20
"JD" @(50,90) size=14 c=#FFFFFF bold

// Comment content
"John Doe" @(95,78) size=14 bold c=#1A1A1A
[] @(155,78) w=45 h=18 bg=#E6F7FF radius=4
"Admin" @(162,80) size=10 c=#1890FF
"2 hours ago" @(95,100) size=12 c=#8C8C8C
"This feature looks great! Can we add support for dark mode?" @(95,120) size=14 c=#333333

// Action buttons
["Reply"] @(95,145) w=50 h=24 bg=#FFFFFF radius=4 c=#1890FF b=#E5E5E5
["Edit"] @(155,145) w=40 h=24 bg=#FFFFFF radius=4 c=#8C8C8C b=#E5E5E5

// Reply to Comment 1 (indented)
// Vertical connector line
-- @(60,185)->(60,240) c=#E5E5E5

// Avatar (smaller)
(()) @(75,195) w=32 h=32 bg=#52C41A radius=16
"JS" @(83,203) size=12 c=#FFFFFF bold

// Reply content
"Jane Smith" @(120,193) size=13 bold c=#1A1A1A
[] @(190,193) w=70 h=18 bg=#F6FFED radius=4
"Developer" @(197,195) size=10 c=#52C41A
"1 hour ago" @(120,213) size=11 c=#8C8C8C
"Good idea! I'll add it to the backlog." @(120,230) size=13 c=#333333

["Reply"] @(120,250) w=50 h=22 bg=#FFFFFF radius=4 c=#1890FF b=#E5E5E5

// Divider
-- @(40,290)->(510,290) c=#F0F0F0

// Comment 2 - Main comment
(()) @(40,310) w=40 h=40 bg=#FA8C16 radius=20
"MK" @(50,320) size=14 c=#FFFFFF bold

"Mike Kim" @(95,308) size=14 bold c=#1A1A1A
"30 minutes ago" @(95,330) size=12 c=#8C8C8C
"When is the release date for this feature?" @(95,350) size=14 c=#333333

["Reply"] @(95,375) w=50 h=24 bg=#FFFFFF radius=4 c=#1890FF b=#E5E5E5

// Add comment input at bottom
[] @(40,420) w=430 h=40 bg=#FAFAFA radius=8 b=#E5E5E5
["Add a comment..."] @(55,428) w=200 h=24 bg=transparent c=#AAAAAA
["Post"] @(440,420) w=60 h=40 bg=#1890FF radius=8 c=#FFFFFF bold
```

---

### Timeline & Log Element Summary

| Element | SolarWire Components | Description |
|---------|---------------------|-------------|
| Timeline | `--` (vertical line) + `(())` (nodes) | Vertical line with status nodes |
| Activity Log | `(())` (icons) + text | List with icons, user, action, time |
| Comment Thread | `(())` (avatars) + nested text | Threaded comments with replies |
| Notification List | `(())` (icons) + badges | List with read/unread indicators |

---

### Timeline Status Colors (Tailwind CSS)

| Status | Tailwind | Hex | Icon |
|--------|----------|-----|------|
| Completed | green-500 | #22C55E | ✓ |
| In Progress | blue-500 | #3B82F6 | Number |
| Pending | gray-300 | #D1D5DB | Number |
| Error | red-500 | #EF4444 | ✗ |
| Warning | amber-500 | #F59E0B | ⚠ |

---

### Activity Log Action Types (Tailwind CSS)

| Action Type | Tailwind | Hex | Icon |
|-------------|----------|-----|------|
| Create | green-500 | #22C55E | ➕ |
| Edit | blue-500 | #3B82F6 | ✏️ |
| Delete | amber-500 | #F59E0B | 🗑️ |
| Export | purple-500 | #A855F7 | 📤 |
| Approve | sky-500 | #0EA5E9 | ✅ |
| Login | gray-400 | #9CA3AF | 🔐 |
