# Mobile App Example

Complete mobile app wireframes with bottom navigation and touch-friendly elements.

## Home Screen

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
("Special Offer") @(20,340) w=335 h=150 bg=#fff r=12 note="[Card] Promotional banner
- Tap to view details
- Limited time offer"
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

---

## Profile Screen

```solarwire
!title="Mobile App - Profile"
!bg=#f5f5f5

// Phone Frame
[] @(0,0) w=375 h=812 bg=#fff

// Status Bar
[] @(0,0) w=375 h=44 bg=#fff
"9:41" @(170,12) bold
[?"Signal"] @(30,12) w=16 h=16
[?"Battery"] @(330,12) w=24 h=12

// Header
"Profile" @(165,64) size=18 bold
[?"Settings"] @(330,64) w=24 h=24

// Profile Card
(("JD")) @(147,120) w=80 h=80 bg=#3498db c=white size=32
"John Doe" @(140,215) size=20 bold
"john.doe@example.com" @(115,245) c=#666

["Edit Profile"] @(120,280) w=135 h=40 bg=#3498db c=white r=20

// Stats
[] @(30,350) w=100 h=60 bg=#f9f9f9 r=8
"Orders" @(55,365) c=#666 size=12
"24" @(65,385) bold

[] @(137,350) w=100 h=60 bg=#f9f9f9 r=8
"Wishlist" @(155,365) c=#666 size=12
"12" @(175,385) bold

[] @(245,350) w=100 h=60 bg=#f9f9f9 r=8
"Reviews" @(265,365) c=#666 size=12
"8" @(285,385) bold

// Menu Items
[] @(20,440) w=335 h=50 bg=#fff
[?"📦"] @(30,455) w=24 h=24
"My Orders" @(70,458)
[?">"] @(330,455) w=16 h=16 c=#ccc

[] @(20,500) w=335 h=50 bg=#fff
[?"❤️"] @(30,515) w=24 h=24
"Wishlist" @(70,518)
[?">"] @(330,515) w=16 h=16 c=#ccc

[] @(20,560) w=335 h=50 bg=#fff
[?"📍"] @(30,575) w=24 h=24
"Addresses" @(70,578)
[?">"] @(330,575) w=16 h=16 c=#ccc

[] @(20,620) w=335 h=50 bg=#fff
[?"💳"] @(30,635) w=24 h=24
"Payment Methods" @(70,638)
[?">"] @(330,635) w=16 h=16 c=#ccc

[] @(20,680) w=335 h=50 bg=#fff
[?"⚙️"] @(30,695) w=24 h=24
"Settings" @(70,698)
[?">"] @(330,695) w=16 h=16 c=#ccc

// Bottom Navigation
[] @(0,730) w=375 h=82 bg=#fff
-- @(0,730)->(375,730) b=#eee

[?"Home"] @(40,755) w=24 h=24 c=#999
"Home" @(40,785) size=10 c=#999

[?"Search"] @(120,755) w=24 h=24 c=#999
"Search" @(115,785) size=10 c=#999

[?"Cart"] @(200,755) w=24 h=24 c=#999
"Cart" @(200,785) size=10 c=#999

[?"Profile"] @(280,755) w=24 h=24 c=#3498db
"Profile" @(275,785) size=10 c=#3498db
```

---

## Product Detail Screen

```solarwire
!title="Mobile App - Product Detail"
!bg=#fff

// Phone Frame
[] @(0,0) w=375 h=812 bg=#fff

// Status Bar
[] @(0,0) w=375 h=44 bg=#fff
"9:41" @(170,12) bold

// Header
["<"] @(20,64) w=24 h=24
"Product Details" @(130,64) bold
[?"❤️"] @(330,64) w=24 h=24

// Product Image
[?"Product Image"] @(0,100) w=375 h=300 bg=#f5f5f5

// Product Info
"Wireless Headphones" @(20,420) size=20 bold
"$199.99" @(20,460) size=24 bold c=#3498db

// Rating
"★★★★★" @(20,500) c=#f39c12
"(128 reviews)" @(100,500) c=#666

// Description
"Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design." @(20,540) c=#666

// Color Options
"Color" @(20,600) bold

[] @(20,630) w=30 h=30 bg=#000 r=15
[] @(60,630) w=30 h=30 bg=#fff b=#333 r=15
[] @(100,630) w=30 h=30 bg=#3498db r=15

// Quantity
"Quantity" @(200,600) bold
["-"] @(200,630) w=30 h=30 bg=#f5f5f5 r=4
"1" @(245,635) bold
["+"] @(270,630) w=30 h=30 bg=#f5f5f5 r=4

// Add to Cart Button
["Add to Cart"] @(20,700) w=335 h=50 bg=#3498db c=white r=25 bold note="[Primary Button] Add item to shopping cart"

// Bottom Navigation
[] @(0,730) w=375 h=82 bg=#fff
-- @(0,730)->(375,730) b=#eee

[?"Home"] @(40,755) w=24 h=24 c=#999
"Home" @(40,785) size=10 c=#999

[?"Search"] @(120,755) w=24 h=24 c=#999
"Search" @(115,785) size=10 c=#999

[?"Cart"] @(200,755) w=24 h=24 c=#3498db
"Cart" @(200,785) size=10 c=#3498db

[?"Profile"] @(280,755) w=24 h=24 c=#999
"Profile" @(275,785) size=10 c=#999
```

---

## Key Features Demonstrated

### 1. Mobile-Specific Elements
- Status bar (time, signal, battery)
- Bottom navigation
- Touch-friendly button sizes (min 44x44px)

### 2. Mobile Layout Patterns
- Card-based content
- Horizontal scrolling categories
- Profile with stats

### 3. Mobile Dimensions
- Canvas: 375x812 (iPhone X)
- Button height: 44-50px
- Touch targets: min 44x44px

---

## Best Practices

1. ✅ Touch-friendly element sizes (min 44x44px)
2. ✅ Bottom navigation for easy thumb access
3. ✅ Clear visual hierarchy
4. ✅ Adequate spacing between elements
5. ✅ Status bar simulation
