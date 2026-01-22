# 🎨 RED LOTUS VISUAL DESIGN REFERENCE

## Design System Overview

### Color Palette

#### Primary Colors
```
Primary Black:     #000000  (Header background)
Secondary Grey:    #f5f5f5  (Page background)
Dark Grey:         #333333  (Text emphasis)
Light Grey:        #e8e8e8  (Borders/dividers)
```

#### Accent Colors (Tribe-Based)
```
Red Lotus:         #b71c1c  (Winter - Focus & Motivation)
Yellow Lotus:      #fbc02d  (Summer - Joy & Positivity)
Blue Lotus:        #1976d2  (Spring - Renewal & Peace)
Green Lotus:       #388e3c  (Growth & Harmony)
Brown Lotus:       #5d4037  (Stability & Grounding)
Pink Lotus:        #c2185b  (Energy & Passion)
```

#### Accent Bar Gradient
```
Left (0%):    Red (#b71c1c)
25%:          Yellow (#fbc02d)
50%:          Blue (#1976d2)
75%:          Green (#388e3c)
Right (100%): Pink (#c2185b)
```

#### Text Colors
```
Primary Text:      #000000  (Black on light backgrounds)
Secondary Text:    #666666  (Grey for descriptions)
Light Text:        #ffffff  (White on dark backgrounds)
Muted Text:        rgba(0, 0, 0, 0.6)  (Disabled/secondary)
```

---

## Layout Grid

### Desktop Layout (1024px+)
```
┌─────────────────────────────────────────────────────────────┐
│  BLACK HEADER (sticky) - Text Navigation Links             │
├─────────────────────────────────────────────────────────────┤
│           HORIZONTAL ACCENT BAR (60px tall)                 │
├─────────────────────────────────────────────────────────────┤
│                    FLOATING LOGO (right, 15% opacity)      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Product Card │  │ Product Card │  │ Product Card │      │
│  │ [image]      │  │ [image]      │  │ [image]      │      │
│  │ [accent bar] │  │ [accent bar] │  │ [accent bar] │      │
│  │ Title        │  │ Title        │  │ Title        │      │
│  │ Description  │  │ Description  │  │ Description  │      │
│  │ [Button]     │  │ [Button]     │  │ [Button]     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Product Card │  │ Product Card │  │ Product Card │      │
│  │ [image]      │  │ [image]      │  │ [image]      │      │
│  │ [accent bar] │  │ [accent bar] │  │ [accent bar] │      │
│  │ Title        │  │ Title        │  │ Title        │      │
│  │ Description  │  │ Description  │  │ Description  │      │
│  │ [Button]     │  │ [Button]     │  │ [Button]     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  BLACK FOOTER - Light Text on Dark Background              │
└─────────────────────────────────────────────────────────────┘
```

### Tablet Layout (640px - 1024px)
```
┌────────────────────────────────────────┐
│  BLACK HEADER - Minimal Navigation     │
├────────────────────────────────────────┤
│    HORIZONTAL ACCENT BAR (50px)        │
├────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐     │
│  │   Product   │  │   Product   │  ◇  │ (floating logo)
│  │    Card     │  │    Card     │     │
│  └─────────────┘  └─────────────┘     │
│                                        │
│  ┌─────────────┐  ┌─────────────┐     │
│  │   Product   │  │   Product   │     │
│  │    Card     │  │    Card     │     │
│  └─────────────┘  └─────────────┘     │
└────────────────────────────────────────┘
```

### Mobile Layout (< 640px)
```
┌──────────────────┐
│  BLACK HEADER    │
├──────────────────┤
│  ACCENT BAR      │
│   (40px)         │
├──────────────────┤
│ ◇ (logo, right)  │
│                  │
│  ┌────────────┐  │
│  │  Product   │  │
│  │   Card     │  │
│  │            │  │
│  └────────────┘  │
│                  │
│  ┌────────────┐  │
│  │  Product   │  │
│  │   Card     │  │
│  │            │  │
│  └────────────┘  │
│                  │
└──────────────────┘
```

---

## Component Specifications

### Header Component
```
Height: 60px (sticky)
Background: #000000
Text Color: #ffffff (rgba(255,255,255,0.8))
Padding: 16px (mobile) / 24px (desktop)

Navigation Links:
- Size: 14px (mobile) / 16px (desktop)
- Weight: 400
- Hover: rgba(255,255,255,0.1) background
- Active: rgba(255,255,255,0.1) background + full opacity
- Spacing: 16px (mobile) / 24px (desktop)
```

### Accent Bar
```
Height: 40px (mobile) / 50px (tablet) / 60px (desktop)
Width: 100%
Gradient: Red → Yellow → Blue → Green → Pink
Position: Between header and main content
Margin: 48px 0 (desktop) / 32px 0 (tablet) / 24px 0 (mobile)
Box-shadow: 0 2px 8px rgba(0,0,0,0.1)
```

### Floating Logo
```
Position: Fixed (right side)
Size: 200px (mobile) / 300px (tablet) / 350px (desktop)
Opacity: 15% (0.15)
Pointer-events: none (doesn't block clicks)
Animation: Float 6s ease-in-out infinite
  - 0% and 100%: translateY(0px)
  - 50%: translateY(-20px)
Z-index: 10 (behind content)
Top: 50% (vertically centered)
Right: 16px from edge
```

### Product Card
```
Background: #ffffff
Border-radius: 8px
Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
Hover: Box-shadow: 0 4px 12px rgba(0,0,0,0.15) + translateY(-2px)
Margin-bottom: 24px
Transition: all 0.3s ease

Image:
- Width: 100%
- Height: auto
- Display: block
- Background: #f5f5f5

Info Section:
- Padding: 24px
- Background: #ffffff

Accent Bar:
- Height: 3px
- Margin: 16px 0
- Border-radius: 1.5px
- Colors: By tribe/product (red, yellow, blue, etc.)

Title:
- Font-size: 18px
- Font-weight: 600
- Color: #000000
- Margin-bottom: 8px

Description:
- Font-size: 14px
- Color: #666666
- Margin-bottom: 16px
- Line-height: 1.5
- Text-transform: none
```

### Button Styles
```
Primary Button (.btn):
- Background: #000000
- Color: #ffffff
- Padding: 12px 24px
- Font-size: 14px
- Font-weight: 500
- Border-radius: 6px
- Border: none
- Cursor: pointer
- Transition: all 0.2s ease
- Hover: background-color: #333333, transform: scale(1.02)

Secondary Button (.btn-secondary):
- Background: transparent
- Color: #000000
- Border: 1px solid #000000
- Padding: 12px 24px
- Font-size: 14px
- Font-weight: 500
- Border-radius: 6px
- Cursor: pointer
- Transition: all 0.2s ease
- Hover: background-color: #000000, color: #ffffff
```

### Typography
```
System Font Stack:
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
Oxygen, Ubuntu, Cantarell, sans-serif

Font Sizes:
- H1 (Section Title): 32px (mobile) / 40px (tablet) / 48px (desktop)
- H2: 24px (mobile) / 32px (tablet) / 40px (desktop)
- H3: 18px
- Body: 14-16px
- Small: 12px

Font Weights:
- Regular: 400
- Medium: 500
- Semi-bold: 600
- Bold: 700

Line Heights:
- Headers: 1.2
- Body: 1.6

Letter-spacing:
- Headers: -0.5px
- Nav: 0.3px
- Default: normal
```

---

## Spacing System

```
Base Unit: 16px (1rem)

Spacing Scale:
- Tiny: 8px (0.5 rem)
- Small: 16px (1 rem)   [--spacing-base]
- Medium: 24px (1.5 rem) [--spacing-lg]
- Large: 32px (2 rem)    [--spacing-xl]
- XL: 48px (3 rem)       [--spacing-2xl]

Margins:
- Section padding: 24px (mobile) / 32px (tablet) / 48px (desktop)
- Card margin-bottom: 24px
- Element spacing: 16px

Gaps:
- Flex/Grid gap: 16px (mobile) / 24px (tablet) / 32px (desktop)
```

---

## Responsive Breakpoints

```
Mobile First (< 640px):
- 1 column layout
- 100% width cards
- Smaller padding: 16px
- Smaller font sizes
- Stacked navigation (if mobile menu)

Tablet (640px - 1024px):
- 2 column grids
- Padding: 24px
- Medium font sizes
- Increased spacing

Desktop (1024px - 1280px):
- 3 column grids
- Padding: 32px
- Full size fonts
- Extended spacing

Large Desktop (1280px+):
- 3 column grids
- Max-width container (1200px)
- Full spacing
- Largest fonts
```

---

## Animation Effects

### Hover Effects
```
Product Card Hover:
- Box-shadow: 0 1px 3px → 0 4px 12px
- Transform: translateY(0) → translateY(-2px)
- Duration: 0.3s
- Easing: ease

Button Hover:
- Background: darker shade
- Transform: scale(1.02)
- Duration: 0.2s
- Easing: ease

Link Hover:
- Opacity: 0.8 → 1
- Duration: 0.2s
```

### Floating Animation
```
Logo Float:
- Animation: float 6s ease-in-out infinite
- 0%, 100%: translateY(0px)
- 50%: translateY(-20px)
- Smooth, gentle motion

Fade In:
- Duration: 0.6s
- From: opacity 0, translateY(10px)
- To: opacity 1, translateY(0)
```

---

## Color Usage Examples

### Red Lotus
- Header accent
- Primary buttons
- High-energy sections
- Call-to-action elements

### Yellow Lotus
- Secondary accent
- Highlight elements
- Positive messaging
- Complementary accents

### Blue Lotus
- Information elements
- Trust/reliability signals
- Calming sections
- Link states (possible)

---

## Icons & Graphics

- **No Emojis**: Professional appearance
- **No Clipart**: Original content focus
- **Professional Images Only**: High-quality photography
- **Simple Geometry**: Minimal shape accents (like the accent bar)
- **Brand Logo**: Floating element for recognition

---

## Accessibility Colors

### Contrast Ratios
```
Black (#000000) on Light Grey (#f5f5f5):
- Ratio: 17.4:1 ✅ (AAA standard: 7:1)

White (#ffffff) on Black (#000000):
- Ratio: 21:1 ✅ (AAA standard: 7:1)

Blue (#1976d2) on Light Grey (#f5f5f5):
- Ratio: 4.8:1 ⚠️ (Use for non-critical elements)
```

---

## Print Styling (Optional)

```
@media print {
  - Hide navigation
  - Hide floating logo
  - Optimize colors for print
  - Increase font sizes
  - Remove animations
}
```

---

## Dark Mode (Future Consideration)

```
If implementing dark mode:
- Invert grey background to dark
- Invert header to light (or keep black)
- Increase text contrast
- Adjust shadows for visibility
```

---

## Usage Guide by Section

### Home Section
- Large hero title
- Subtitle text
- Two CTA buttons
- Subtle background
- Clean, welcoming

### Music Section
- Album cards in grid
- Professional album artwork
- Accent color indication
- Stream buttons
- 3-column layout (desktop)

### Tribe Section
- Member cards
- Tribe images
- Join/Switch buttons
- Color-coded by tribe
- Clear membership status

### Store Section
- Product grid
- Professional images
- Pricing information
- Add to cart buttons
- Organized layout

---

## Final Design Notes

1. **Whitespace is Important**: Leave plenty of room between elements
2. **Consistency**: Use the design system consistently across all sections
3. **Color Hierarchy**: Use accent colors strategically to guide attention
4. **Image Quality**: All images should be professional and optimized
5. **Typography**: Stick to the font stack and size scale
6. **Responsive**: Always test on mobile, tablet, and desktop
7. **Performance**: Minimize animations, optimize images
8. **Accessibility**: Maintain high contrast, readable text, proper sizing

---

**This design system ensures a cohesive, professional, and modern appearance across the entire Red Lotus website.**

---

**Last Updated**: January 21, 2026
**Version**: 1.0
