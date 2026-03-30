---
name: "solarwire-code-to-prd"
description: "Reverse engineers frontend and backend code into complete PRD documents with SolarWire wireframes. Invoke when user wants to generate PRD from existing codebase, understand project structure, or create documentation from code."
---

# Code to PRD Converter

This skill analyzes existing frontend and backend code to generate comprehensive PRD documents with SolarWire wireframes.

## Overview

**Core Capability**: Read and understand the entire codebase, then reverse engineer into structured PRD documents.

### What This Skill Does

1. **Frontend Analysis**
   - Parse HTML/JSX/Vue components
   - Extract UI structure and layouts
   - Identify user interactions and flows

2. **Backend Analysis**
   - Parse API endpoints and routes
   - Extract data models and schemas
   - Identify business logic and rules

3. **PRD Generation**
   - Generate complete PRD documents
   - Create SolarWire wireframes
   - Document all features and interactions

## When to Invoke

- User wants to "reverse engineer" code to PRD
- User asks to "generate PRD from existing code"
- User provides a codebase and wants documentation
- User wants to understand an existing project's requirements

---

## Workflow

### Phase 1: Codebase Discovery

**Goal: Understand the project structure**

```
1. Ask user for codebase location or files
2. Scan project structure:
   - Frontend directory (src/, pages/, components/)
   - Backend directory (api/, routes/, models/)
   - Configuration files (package.json, tsconfig.json)
3. Identify tech stack:
   - Frontend: React/Vue/Angular/HTML
   - Backend: Node.js/Python/Java/Go
   - Database: MySQL/MongoDB/PostgreSQL
```

### Phase 2: Frontend Analysis

**Goal: Extract UI structure and interactions**

#### 2.1 Component Structure

Analyze frontend code to identify:

| Analysis Target | What to Extract |
|-----------------|-----------------|
| Pages/Routes | All page components and their routes |
| Components | Reusable UI components |
| Layouts | Page layout patterns |
| Navigation | Menu, tabs, breadcrumbs |

#### 2.2 UI Elements

For each page/component, identify:

| Element Type | What to Extract |
|--------------|-----------------|
| Forms | Input fields, validation rules, submit actions |
| Buttons | Click handlers, disabled conditions |
| Tables | Columns, data source, actions |
| Modals | Trigger conditions, content, actions |
| Lists | Data source, item structure, interactions |

#### 2.3 Interactions

Extract interaction patterns:

```
- Event handlers (onClick, onChange, onSubmit)
- State changes (useState, Vuex, Redux)
- Navigation flows (router.push, href)
- API calls (fetch, axios, graphql)
```

### Phase 3: Backend Analysis

**Goal: Extract API and business logic**

#### 3.1 API Endpoints

Analyze backend routes to identify:

| Analysis Target | What to Extract |
|-----------------|-----------------|
| Routes | All API endpoints (method, path) |
| Parameters | Request params, body, query |
| Responses | Response structure, status codes |
| Authentication | Auth requirements, permissions |

#### 3.2 Data Models

Analyze database schemas/models:

| Analysis Target | What to Extract |
|-----------------|-----------------|
| Entities | All data entities/tables |
| Fields | Field names, types, constraints |
| Relations | Entity relationships |
| Validation | Field validation rules |

#### 3.3 Business Logic

Extract business rules from code:

```
- Validation rules
- Calculation formulas
- State transitions
- Permission checks
- Error handling
```

### Phase 4: PRD Generation

**Goal: Generate complete PRD document**

Follow the exact PRD structure from `solarwire-prd` skill:

```markdown
# Product Requirements Document - [Project Name]

## Document Information
| Project Name | [Project Name] |
|-------------|----------------|
| Version | v1.0 |
| Created Date | [Date] |
| Author | Generated from codebase |

---

## 1. Product Overview

### 1.1 Product Background
[Inferred from codebase structure and comments]

### 1.2 Target Users
[Inferred from authentication and user-related code]

### 1.3 Core Value
[Inferred from main features]

### 1.4 User Stories
[Generated from user interactions found in code]

---

## 2. Feature Scope

### 2.1 Feature List
[Generated from pages/components and API endpoints]

### 2.2 Feature Boundary
[Inferred from what is implemented vs not]

---

## 3. Business Flow

### 3.1 Core Business Flowchart
[Generated from user interaction flows]

### 3.2 Interaction Sequence Diagram
[Generated from frontend-backend interactions]

---

## 4. Page Design

### 4.1 Page List
[Generated from frontend routes/pages]

---

## 5. Page Details

[For each page, generate SolarWire wireframe with notes]

---

## 6. Non-functional Requirements

[Inferred from codebase patterns]

---

## 7. Appendix

### 7.1 API Reference
[Generated from backend routes]

### 7.2 Data Models
[Generated from database schemas]
```

---

## SolarWire Wireframe Generation

**CRITICAL: Follow all SolarWire syntax rules from `solarwire-prd` skill**

### Core Syntax Rules

```
1. All elements must have coordinates @(x,y)
2. Write attributes directly without brackets: w=100 h=40
3. Text content MUST use double quotes: "Login" (not Login)
4. Attribute order: Content → Coordinates → Size → Other attributes → note
```

### Element Mapping

| Frontend Code | SolarWire Element |
|---------------|-------------------|
| `<button>Submit</button>` | `["Submit"] @(x,y) w=100 h=40` |
| `<input type="text" placeholder="Enter...">` | `["Enter..."] @(x,y) w=200 h=40 c=#AAAAAA` |
| `<input type="password">` | `["••••••"] @(x,y) w=200 h=40` |
| `<input type="checkbox">` | `[☑ "Label"] @(x,y)` |
| `<input type="radio">` | `[○ "Label"] @(x,y)` |
| `<select>` | `[▼ "Selected"] @(x,y) w=200 h=40` |
| `<textarea>` | `["Multi-line text..."] @(x,y) w=300 h=100` |
| `<h1>Title</h1>` | `"Title" @(x,y) size=24 bold` |
| `<p>Text</p>` | `"Text" @(x,y)` |
| `<a href="...">Link</a>` | `"Link" @(x,y) c=#1890FF` |
| `<img alt="Logo">` | `[🖼 "Logo"] @(x,y) w=100 h=100` |
| `<table>` | `## @(x,y) w=500 border=1` |
| `<hr>` | `-- @(x1,y1)->(x2,y2) b=#F2F2F2` |
| `<div class="card">` | `("Card Title") @(x,y) w=300 h=200` |

### Layout Inference Rules

When analyzing code, infer reasonable positions:

```
1. Container Size
   - Mobile: w=375 h=812
   - Web: w=1440 h=900
   - Admin: w=1920 h=1080

2. Element Spacing
   - Vertical: 10px between elements
   - Horizontal: 10px between related elements
   - Form groups: 50-60px vertical spacing

3. Element Sizes
   - Buttons: h=40-48px, w=80-300px
   - Inputs: h=40-44px, w=200-400px
   - Labels: h=22px (line height)
   - Tables: row h=40-48px

4. Colors
   - Primary: #1890FF
   - Error: #D9001B
   - Success: #52C41A
   - Warning: #FAAD14
   - Text: #333333
   - Secondary: #AAAAAA
   - Border: #F2F2F2
   - Background: #FFFFFF
```

### Note Generation Rules

**Generate notes from code analysis:**

| Code Pattern | Note Content |
|--------------|--------------|
| `onClick={handleSubmit}` | "Click action - Submit form data" |
| `required` attribute | "Validation - Required field" |
| `disabled={condition}` | "Disabled conditions - [condition]" |
| `onChange={handleChange}` | "Interaction - Update state on change" |
| `errorMessage` state | "Error handling - Display: [message]" |
| API call in handler | "API - Call [endpoint] on [action]" |

**Note format:**
```
note="[Element description]
1. [Category 1]
   - [Detail 1]
   - [Detail 2]
2. [Category 2]
   - [Detail 1]"
```

---

## Example: Full Codebase Analysis

### Input: Project Structure

```
my-app/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Users.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   └── Table.tsx
│   │   └── api/
│   │       └── auth.ts
├── backend/
│   ├── routes/
│   │   ├── auth.ts
│   │   └── users.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Session.ts
│   └── middleware/
│       └── auth.ts
└── package.json
```

### Analysis Steps

1. **Read Login.tsx** → Extract login form structure, validation, API calls
2. **Read Dashboard.tsx** → Extract dashboard layout, widgets, data sources
3. **Read Users.tsx** → Extract user list table, actions, filters
4. **Read auth.ts (frontend)** → Extract API client methods
5. **Read auth.ts (backend)** → Extract authentication endpoints
6. **Read users.ts** → Extract user management endpoints
7. **Read User.ts** → Extract user data model
8. **Read Session.ts** → Extract session data model

### Output: Generated PRD

```markdown
# User Management System - Product Requirements Document

## Document Information
| Project Name | User Management System |
|-------------|------------------------|
| Version | v1.0 |
| Created Date | 2024-01-15 |
| Author | Generated from codebase |

---

## 1. Product Overview

### 1.1 Product Background
A web-based user management system with authentication and user administration capabilities.

### 1.2 Target Users
- Administrators: Full access to user management
- Regular Users: Access to personal profile

### 1.3 Core Value
Secure user authentication and efficient user administration.

### 1.4 User Stories

| ID | User Story | Acceptance Criteria | Priority |
|----|------------|---------------------|----------|
| US-001 | As a user, I want to log in, so that I can access the system | - Given valid credentials, when I submit, then I'm redirected to dashboard | P0 |
| US-002 | As an admin, I want to view users, so that I can manage them | - Given I'm logged in as admin, when I visit users page, then I see user list | P0 |

---

## 2. Feature Scope

### 2.1 Feature List
| Module | Feature | Priority | Description |
|--------|---------|----------|-------------|
| Authentication | Login | P0 | User authentication with email/password |
| Authentication | Session | P0 | Session management with remember me |
| User Management | User List | P0 | View and search users |
| User Management | User Actions | P1 | Edit, delete users |

---

## 3. Business Flow

### 3.1 Authentication Flow
```mermaid
flowchart TD
    A[Login Page] --> B{Valid Credentials?}
    B -->|Yes| C[Create Session]
    B -->|No| D[Show Error]
    C --> E[Redirect to Dashboard]
    D --> A
```

---

## 4. Page Design

### 4.1 Page List
| Page Name | Page Type | Description |
|-----------|-----------|-------------|
| Login | Main Page | User authentication |
| Dashboard | Main Page | System overview |
| Users | Main Page | User management |

---

## 5. Page Details

### 5.1 Login Page

**Page Overview**: User authentication page with email/password login

```solarwire
!title="Login"
!c=#333333
!size=13
!bg=#F2F2F2

[] @(0,0) w=1440 h=900 bg=#FFFFFF

"Welcome Back" @(600,200) size=24 bold
"Please sign in to continue" @(580,235) c=#AAAAAA

"Email" @(520,320)
["Enter your email"] @(520,345) w=400 h=44 bg=#FFFFFF b=#F2F2F2 c=#AAAAAA note="Email input
1. Input rules
   - Valid email format required
   - Max length: 100 characters
2. Validation
   - Error: 'Please enter a valid email'"

"Password" @(520,420)
["Enter password"] @(520,445) w=400 h=44 bg=#FFFFFF b=#F2F2F2 c=#AAAAAA note="Password input
1. Input rules
   - Min 6 characters
   - Displayed as dots
2. Interaction
   - Show/hide toggle on right"

[☑ "Remember me"] @(520,520) note="Remember me checkbox
1. Behavior
   - Checked: Session valid for 7 days
   - Unchecked: Session expires on browser close"

["Sign In"] @(520,590) w=400 h=48 bg=#1890FF c=#FFFFFF size=16 note="Sign in button
1. Click action
   - Validate email and password
   - Call POST /api/auth/login
2. Success handling
   - Store session token
   - Redirect to dashboard
3. Failure handling
   - Display: 'Invalid credentials'
   - Clear password field
4. Disabled conditions
   - Disabled when email or password is empty"
```

---

## 6. Non-functional Requirements

### 6.1 Performance Requirements
- Page load time: < 2 seconds
- API response time: < 500ms

### 6.2 Security Requirements
- Password hashing: bcrypt
- Session: JWT with 7-day expiry
- HTTPS required

---

## 7. Appendix

### 7.1 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/login | User login | No |
| POST | /api/auth/logout | User logout | Yes |
| GET | /api/users | Get user list | Admin |
| GET | /api/users/:id | Get user detail | Admin |
| PUT | /api/users/:id | Update user | Admin |
| DELETE | /api/users/:id | Delete user | Admin |

### 7.2 Data Models

**User Model:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| email | string | Yes | User email |
| password | string | Yes | Hashed password |
| name | string | No | Display name |
| role | enum | Yes | 'admin' or 'user' |
| createdAt | datetime | Yes | Creation time |

**Session Model:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Session ID |
| userId | string | Yes | User reference |
| token | string | Yes | JWT token |
| expiresAt | datetime | Yes | Expiry time |
```

---

## Important Reminders

1. **Read All Code** - Analyze entire codebase, not just entry files
2. **Understand Context** - Infer business meaning from code patterns
3. **Follow SolarWire Syntax** - All elements must have coordinates, text in quotes
4. **Generate Complete PRD** - Include all sections from solarwire-prd skill
5. **Document APIs** - Extract all endpoints from backend routes
6. **Document Data Models** - Extract all schemas from database models
7. **Infer Business Logic** - Extract rules from validation and processing code
8. **Generate Wireframes** - Create SolarWire for every page/component
9. **Add Notes** - Document functionality from code analysis
10. **Output to .solarwire** - Save PRD to `.solarwire/[project-name]/solarwire-prd.md`
