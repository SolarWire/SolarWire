# Coordinates System

SolarWire uses a flexible coordinate system for positioning elements.

## Overview

Every element must have coordinates specified using `@(x,y)` syntax:

```solarwire
["Button"] @(100,50)
```

Coordinates are relative to the top-left corner of the canvas (0,0).

---

## Coordinate Types

### 1. Absolute Coordinates

Position relative to the canvas origin.

```solarwire
["Button 1"] @(0,0)      // Top-left corner
["Button 2"] @(100,50)   // 100px right, 50px down
["Button 3"] @(200,100)  // 200px right, 100px down
```

### 2. Relative Coordinates

Position relative to the previous element.

```solarwire
["Button 1"] @(100,50)
["Button 2"] @(0,+60)     // Same X, 60px below Button 1
["Button 3"] @(0,+60)     // Same X, 60px below Button 2
["Button 4"] @(+120,0)    // 120px right of Button 3, same Y
["Button 5"] @(-60,+30)   // 60px left, 30px down
```

**Syntax:**
- `@(0,+60)` - Same X, add 60 to Y
- `@(+120,0)` - Add 120 to X, same Y
- `@(-60,+30)` - Subtract 60 from X, add 30 to Y

### 3. Edge Coordinates

Position relative to the edges of the previous element.

```solarwire
["Card"] @(100,100) w=200 h=150

// Position inside the card
"Title" @(L+10, T+10)      // 10px from left edge, 10px from top edge
"Content" @(L+10, T+40)    // 10px from left, 40px from top
"Footer" @(L+10, B-30)     // 10px from left, 30px above bottom
"Badge" @(R-50, T+10)      // 50px from right, 10px from top
```

**Edge References:**
| Symbol | Description |
|--------|-------------|
| `L` | Left edge of previous element |
| `R` | Right edge of previous element |
| `T` | Top edge of previous element |
| `B` | Bottom edge of previous element |

**Syntax:**
- `@(L+10, T+10)` - 10px from left, 10px from top
- `@(R-20, B-20)` - 20px from right, 20px from bottom
- `@(L+0, B+10)` - At left edge, 10px below bottom

---

## Coordinate Expressions

You can combine coordinate types:

```solarwire
["Card"] @(100,100) w=200 h=150

// Mix absolute and edge coordinates
"Label" @(L+10, 200)      // 10px from card's left, absolute Y=200

// Mix relative and edge coordinates
"Text" @(L+10, +50)       // 10px from card's left, 50px below previous
```

---

## Practical Examples

### Form Layout

Using relative coordinates for consistent spacing:

```solarwire
!title="Form Layout"

[] @(0,0) w=400 h=500 bg=#fff

"Username" @(50,100)
["Enter username"] @(0,+25) w=300 h=44 bg=#fff b=#ddd

"Password" @(0,+30)
["Enter password"] @(0,+25) w=300 h=44 bg=#fff b=#ddd

"Confirm Password" @(0,+30)
["Confirm password"] @(0,+25) w=300 h=44 bg=#fff b=#ddd

["Register"] @(0,+40) w=300 h=48 bg=#3498db c=white
```

### Card with Content

Using edge coordinates for internal positioning:

```solarwire
!title="Card Layout"

("Card") @(100,50) w=300 h=200 bg=#fff r=8

// Content inside card
"Card Title" @(L+16, T+16) size=18 bold
"Card description text goes here." @(L+16, T+48) c=#666
["Action"] @(L+16, B-56) w=80 h=36 bg=#3498db c=white
["Cancel"] @(R-96, B-56) w=80 h=36 bg=#fff b=#ddd
```

### List Items

Using relative coordinates for repeating patterns:

```solarwire
!title="List Layout"

[] @(0,0) w=400 h=500 bg=#fff

// List item 1
(("JD")) @(50,50) w=40 h=40 bg=#3498db c=white
"John Doe" @(L+50, T+5) bold
"Software Engineer" @(L+50, T+24) c=#666 size=12

// List item 2 (relative to item 1)
(("JS")) @(0,+30) w=40 h=40 bg=#27ae60 c=white
"Jane Smith" @(L+50, T+5) bold
"Product Manager" @(L+50, T+24) c=#666 size=12

// List item 3
(("MJ")) @(0,+30) w=40 h=40 bg=#9b59b6 c=white
"Mike Johnson" @(L+50, T+5) bold
"Designer" @(L+50, T+24) c=#666 size=12
```

---

## Best Practices

### 1. Use Relative Coordinates for Repeated Patterns

```solarwire
// Good: Easy to maintain spacing
["Item 1"] @(100,50)
["Item 2"] @(0,+60)
["Item 3"] @(0,+60)

// Bad: Hard to maintain
["Item 1"] @(100,50)
["Item 2"] @(100,110)
["Item 3"] @(100,170)
```

### 2. Use Edge Coordinates for Container Content

```solarwire
// Good: Content stays inside container
["Card"] @(100,100) w=200 h=150
"Title" @(L+10, T+10)
"Footer" @(L+10, B-30)

// Bad: Content position breaks if container moves
["Card"] @(100,100) w=200 h=150
"Title" @(110,110)      // Hard-coded position
"Footer" @(110,270)     // Hard-coded position
```

### 3. Combine Types Appropriately

```solarwire
// Container at absolute position
[] @(100,100) w=400 h=300 bg=#fff

// Content relative to container
"Header" @(L+20, T+20)
"Content" @(L+20, T+60)
["Button"] @(L+20, B-60)
```

---

## Coordinate System Reference

### Absolute Coordinates

| Syntax | Description |
|--------|-------------|
| `@(x,y)` | Position at (x, y) from origin |

### Relative Coordinates

| Syntax | Description |
|--------|-------------|
| `@(+x,+y)` | Move x right, y down from previous |
| `@(-x,+y)` | Move x left, y down from previous |
| `@(+x,-y)` | Move x right, y up from previous |
| `@(-x,-y)` | Move x left, y up from previous |
| `@(0,+y)` | Same X, move y down |
| `@(+x,0)` | Move x right, same Y |

### Edge Coordinates

| Syntax | Description |
|--------|-------------|
| `@(L+n, T+n)` | n pixels from left and top edges |
| `@(R-n, T+n)` | n pixels from right and top edges |
| `@(L+n, B-n)` | n pixels from left and bottom edges |
| `@(R-n, B-n)` | n pixels from right and bottom edges |
| `@(L+0, B+n)` | At left edge, n pixels below bottom |

---

## Debugging Tips

### Visual Debugging

Add borders to see element boundaries:

```solarwire
["Container"] @(100,100) w=200 h=150 b=#f00 s=2
["Inner"] @(L+10, T+10) w=80 h=40 b=#0f0 s=2
```

### Coordinate Labels

Use text to show coordinates:

```solarwire
["Button"] @(100,50)
"(100,50)" @(L+0, B+15) c=#999 size=10
```

---

## Common Patterns

### Centering Elements

```solarwire
// Center a button in a container
[] @(0,0) w=400 h=300 bg=#fff
["Centered"] @(150,130) w=100 h=40  // (400-100)/2, (300-40)/2
```

### Grid Layout

```solarwire
// 3x3 grid
["1,1"] @(50,50) w=80 h=80
["1,2"] @(+100,0) w=80 h=80
["1,3"] @(+100,0) w=80 h=80

["2,1"] @(-200,+100) w=80 h=80
["2,2"] @(+100,0) w=80 h=80
["2,3"] @(+100,0) w=80 h=80

["3,1"] @(-200,+100) w=80 h=80
["3,2"] @(+100,0) w=80 h=80
["3,3"] @(+100,0) w=80 h=80
```

### Responsive Layout

Using relative coordinates for flexible layouts:

```solarwire
// Sidebar + Content
["Sidebar"] @(0,0) w=200 h=600 bg=#f5f5f5
["Content"] @(R+0, T+0) w=800 h=600 bg=#fff
```
