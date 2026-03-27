# Login Form Example

A complete login form with all best practices demonstrated.

## Complete Code

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
["Enter your email"] @(50,205) w=300 h=44 bg=#fff b=#ddd note="[Input Field]
- Supports phone number or email login
- Automatically trims leading/trailing spaces
- Format validation: 11-digit phone or email format
- Error message: 'Please enter a valid email'
- Max length: 50 characters"

"Password" @(50,280)
["Enter password"] @(50,305) w=300 h=44 bg=#fff b=#ddd note="[Password Field]
- Password displayed as dots
- Show/hide toggle icon on the right
- Min length: 6 characters, Max: 32 characters
- Must contain letters and numbers
- Error: 'Password must be 6-32 characters'"

// Remember Me
["Remember Me"] @(50,370) w=16 h=16 note="[Checkbox]
- When checked, stay logged in for 7 days
- Unchecked: Session expires on browser close"

"Remember me" @(74,372)

// Actions
["Sign In"] @(50,420) w=300 h=48 bg=#3498db c=white size=16 bold note="[Primary Button]
- Validates email and password on click
- Success: Redirect to dashboard, save login state
- Failure: Display 'Invalid credentials' error toast
- Disabled when: email or password is empty
- Debounce: Button disabled for 3 seconds after click"

// Divider
-- @(50,500)->(350,500) b=#eee

// Social Login
"Or continue with" @(145,520) c=#999

[?"WeChat"] @(120,560) w=40 h=40 note="[Third-party Login] WeChat QR code login"
[?"Google"] @(180,560) w=40 h=40 note="[Third-party Login] Google OAuth login"
[?"Apple"] @(240,560) w=40 h=40 note="[Third-party Login] Apple ID login"

// Footer
"Don't have an account?" @(100,640) c=#666
"Sign up" @(260,640) c=#3498db note="[Link] Navigate to registration page"
```

---

## Key Features Demonstrated

### 1. Container Pattern

Always start with a white background container:

```solarwire
[] @(0,0) w=400 h=600 bg=#fff
```

### 2. Form Field Pattern

Label + Input with consistent spacing:

```solarwire
"Email" @(50,180)
["Enter your email"] @(0,+25) w=300 h=44 bg=#fff b=#ddd
```

### 3. Detailed Notes

Include all functional information:

```solarwire
note="[Input Field]
- Validation rules
- Error messages
- Max length
- Behavior"
```

### 4. Action Buttons

Primary action with full description:

```solarwire
["Sign In"] @(50,420) w=300 h=48 bg=#3498db c=white bold note="[Primary Button]
- What happens on click
- Success case
- Failure case
- Disabled states"
```

### 5. Third-party Options

Group related options:

```solarwire
[?"WeChat"] @(120,560) w=40 h=40
[?"Google"] @(+60,0) w=40 h=40
[?"Apple"] @(+60,0) w=40 h=40
```

---

## Variations

### Minimal Version

```solarwire
!title="Login"

[] @(0,0) w=300 h=400 bg=#fff

"Email" @(50,100)
["Enter email"] @(50,125) w=200 h=40

"Password" @(50,190)
["Enter password"] @(50,215) w=200 h=40

["Login"] @(50,280) w=200 h=44 bg=#3498db c=white
```

### With Logo

```solarwire
!title="Login"

[] @(0,0) w=400 h=600 bg=#fff

// Logo
<https://example.com/logo.png> @(150,50) w=100 h=60

"Welcome" @(170,140) size=24 bold

// Form...
```

### With Error State

```solarwire
!title="Login - Error State"

[] @(0,0) w=400 h=600 bg=#fff

"Email" @(50,180)
["invalid-email"] @(50,205) w=300 h=44 bg=#fff b=#e74c3c
"Please enter a valid email address" @(50,255) c=#e74c3c size=12

// ... rest of form
```

### With Loading State

```solarwire
!title="Login - Loading"

// ... form fields ...

["Signing in..."] @(50,420) w=300 h=48 bg=#95a5a6 c=white opacity=0.7 note="[Primary Button - Loading State]
- Button disabled during authentication
- Show loading spinner
- Prevent double-click"
```

---

## Responsive Considerations

### Mobile Version

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

### Desktop Version

```solarwire
!title="Login - Desktop"

// Split layout
[] @(0,0) w=800 h=600 bg=#f5f5f5

// Left panel - branding
[] @(0,0) w=400 h=600 bg=#3498db
"Your App" @(150,250) size=32 bold c=white
"Welcome to our platform" @(120,300) c=white

// Right panel - form
[] @(400,0) w=400 h=600 bg=#fff
// ... form fields ...
```

---

## Best Practices Applied

1. ✅ Container rectangle as first element
2. ✅ All elements have coordinates
3. ✅ Notes describe function, not visuals
4. ✅ Consistent spacing using relative coordinates
5. ✅ Meaningful placeholder text
6. ✅ Clear visual hierarchy
7. ✅ Accessible color contrast
