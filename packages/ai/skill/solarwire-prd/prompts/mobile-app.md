# SolarWire PRD - Mobile App

This is the specific configuration for mobile app scenarios.

## 1. Scenario Characteristics

Mobile apps typically have the following characteristics:
- Narrow canvas (375-430px)
- Primarily vertical layout
- Common bottom navigation bar
- Content area fills the width
- Touch-friendly large buttons
- Vertical scrolling is the primary navigation method

## 2. Size Specifications

### Canvas Size
- Recommended width: 375-430px (iPhone standard width)
- Height adjusts automatically based on content

### Element Sizes (Touch-friendly)
- Minimum button size: 44x44px (Apple recommended)
- Button height: 44-56px
- Button width: Fill available width or minimum 44px
- Input field height: 44-52px
- Input field width: Fill available width
- Minimum text size: 14px
- Title text size: 18-22px

### Spacing Specifications
- Element spacing: 8-16px
- Page margins: 16-24px

## 3. Layout Best Practices

### 1. Common Layout Structure

```solarwire
!title="Mobile App"
!size=14
!gap=12

// Container Rectangle - iPhone 12 size
[] @(0,0) w=390 h=844 bg=#fff hide

// Top status bar/navigation bar
["<"] @(16,44) w=44 h=44 note="[Icon] Return to previous page"
"Page Title" @(68,58) size=18 note="Page title"

// Main content area
"Welcome Back" @(24,120) size=24 bold note="Welcome text"
"Username" @(24,180) note="Input field label"
["Enter username"] @(24,205) w=342 h=48 bg=#fff b=#ddd note="[Input Field]
- Supports phone number or email login
- Automatically trims leading/trailing spaces
- Format validation: 11-digit phone number or email format
- Error message: Display 'Please enter a valid phone number or email' on format error
- Max length: 50 characters"

"Password" @(24,270) note="Input field label"
["Enter password"] @(24,295) w=342 h=48 bg=#fff b=#ddd note="[Input Field]
- Password displayed as dots
- Show/hide toggle icon on the right
- Min length: 6 characters, Max: 32 characters"

["Login"] @(24,370) w=342 h=52 bg=#4CAF50 c=white note="[Primary Button]
- Validates username and password on click
- Success: Redirect to homepage, save login state
- Failure: Display 'Invalid username or password' modal, clear password field
- Disabled when: username or password is empty
- Debounce: Button disabled for 3 seconds after click, or until request returns"

"Forgot Password?" @(145,442) c=#2196F3 note="[Link] Click to go to password recovery page"

// Bottom navigation bar
["Home"] @(0,500) w=97 h=60 bg=#f5f5f5 note="[Icon] Switch to homepage"
["Discover"] @(98,500) w=97 h=60 bg=#f5f5f5 note="[Icon] Switch to discover page"
["Messages"] @(195,500) w=97 h=60 bg=#f5f5f5 note="[Icon] Switch to messages page"
["Profile"] @(293,500) w=97 h=60 bg=#f5f5f5 note="[Icon] Switch to profile center"
```

### 2. Top Navigation Bar
- Usually placed at the top of the page
- Back button on the left `@(16,44)`, title in the center, action button on the right
- Height: 56-64px
- Touch elements at least 44x44px

### 3. Form Layout
- Label + input field combination, vertically arranged
- Buttons fill the width, placed at the bottom
- Input field height at least 44px

### 4. Card Layout
- Use rounded rectangle `()` as cards
- Card width fills available width
- Elements inside cards positioned with absolute coordinates
- Maintain appropriate spacing between cards

### 5. List Layout
- Each list item at least 44px height
- Vertically arranged, using absolute coordinates
- Can have left icon, center text, right arrow/switch

## 4. Common Patterns

### Login Page
- Vertically centered layout
- Logo + Title + Form + Button (full width)

### List Page
- Top search bar
- List items (vertically arranged, each at least 44px height)
- Pull to refresh / load more

### Detail Page
- Top back button + title
- Detail content (vertical scrolling)
- Bottom action button (full width)

### Profile Center
- Top user information area
- Settings list
- Bottom logout button

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

### Content Forbidden in Notes

- ❌ Visual details: Colors, fonts, border-radius, shadows, animation effects
- ❌ Technical implementation: API names, database fields, encryption methods
- ❌ Size values: Width, height, spacing

## 7. PRD Specific Requirements

### Mobile-specific Field Definitions

```markdown
### Mobile Adaptation Fields

| Field Name | Type | Description |
|------------|------|-------------|
| deviceToken | string | Device push token |
| deviceId | string | Device unique identifier |
| osType | string | OS type: iOS/Android |
| osVersion | string | OS version |
| appVersion | string | App version |
```

### Mobile-specific Business Rules

```markdown
### Mobile Business Rules

1. **Login Rules**
   - Support one-tap login with phone number
   - Support third-party login (WeChat, Apple ID)
   - Token validity: 7 days

2. **Push Notification Rules**
   - Users can disable push notifications
   - Push click navigates to corresponding page
```
