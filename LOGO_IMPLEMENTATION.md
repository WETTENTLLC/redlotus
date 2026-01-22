# Logo Implementation Guide

## Current Placeholder
The redesigned site currently uses a placeholder emoji "🔷" for the floating logo.

**Location in code**: `src/components/MinimalLayout.tsx` line 15

---

## How to Replace with Your Logo

### Option 1: Using an Image File (Recommended)

#### Step 1: Add Logo File
Place your logo image in the assets folder:
```
src/assets/red-lotus-main-logo.png  (or .svg, .jpg, etc.)
```

#### Step 2: Import in MinimalLayout.tsx
Edit `src/components/MinimalLayout.tsx`:

**Find this (around line 1):**
```tsx
import React from 'react';
```

**Add this import:**
```tsx
import redLotusMainLogo from '../assets/red-lotus-main-logo.png';
```

#### Step 3: Replace Placeholder
**Find this (around line 15-18):**
```tsx
<div className="floating-logo" style={{ fontSize: '80px', textAlign: 'center' }}>
  {logoPlaceholder}
</div>
```

**Replace with:**
```tsx
<img 
  src={redLotusMainLogo} 
  alt="Red Lotus Logo" 
  className="floating-logo"
  style={{ 
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }} 
/>
```

#### Step 4: Test
- The logo will now float on the right side with 15% opacity
- It won't interfere with content
- It maintains aspect ratio properly

---

### Option 2: Using a Public URL

If your logo is hosted online, you can skip the import and directly use the URL:

**In MinimalLayout.tsx:**
```tsx
<img 
  src="https://example.com/your-logo.png" 
  alt="Red Lotus Logo" 
  className="floating-logo"
/>
```

---

### Option 3: Keeping Text Logo (Alternative)

If you prefer a text-based logo instead:

**In MinimalLayout.tsx:**
```tsx
<div className="floating-logo" style={{ 
  fontSize: '60px', 
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#000'
}}>
  RL
</div>
```

Or with custom font:
```tsx
<div className="floating-logo" style={{ 
  fontSize: '60px', 
  textAlign: 'center',
  fontFamily: 'SUNSHINE, serif',
  fontWeight: 'bold'
}}>
  Red Lotus
</div>
```

---

## Logo Display Characteristics

The floating logo will:

### Visual Properties
- **Position**: Fixed on right side of screen
- **Opacity**: 15% (subtle, doesn't block content)
- **Animation**: Gentle floating motion while scrolling
- **Z-index**: 10 (behind main content)
- **Pointer events**: Disabled (doesn't block clicks)

### Responsive Sizing
```css
/* Mobile: < 640px */
max-width: 200px;
max-height: 200px;

/* Tablet: 640px+ */
max-width: 300px;
max-height: 300px;

/* Desktop: 1024px+ */
max-width: 350px;
max-height: 350px;
```

---

## Logo Design Recommendations

### For Best Results:
1. **Format**: PNG with transparency or SVG (recommended)
2. **Size**: 1000x1000px or larger
3. **Transparency**: Should have transparent background
4. **Simplicity**: Clean, recognizable at 15% opacity
5. **Aspect Ratio**: Square or 1:1 ratio works best

### What Works Well:
- ✅ Geometric/minimalist logos
- ✅ Simple symbol marks
- ✅ Line-based designs
- ✅ Monochrome or solid color logos
- ✅ Company wordmarks

### What to Avoid:
- ❌ Complex, detailed graphics
- ❌ Very small logos (hard to see at 15% opacity)
- ❌ Logos with thin lines (may not render well)
- ❌ Full-color gradients (too busy at background)
- ❌ Very dark logos (disappear on grey background)

---

## Testing After Implementation

### Mobile Device Testing
1. Open site on iPhone/Android
2. Scroll up and down
3. Logo should float gently on right
4. Logo should not cover text

### Desktop Testing
1. Open site on desktop (1024px+)
2. Logo larger, still subtle at 15% opacity
3. Content should be readable
4. Logo doesn't interfere with buttons/links

### Different Breakpoints
```
Mobile (< 640px):   200x200px logo
Tablet (640-1024):  300x300px logo
Desktop (1024+):    350x350px logo
```

---

## CSS Customization (If Needed)

All logo styling is in `src/styles/minimalist.css` lines 132-146:

### To Change Opacity:
```css
.floating-logo-container {
  opacity: 0.15;  /* Change 0.15 to desired value (0-1) */
}
```

### To Change Animation Speed:
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);  /* Adjust -20px for distance */
  }
}
```
Animation takes 6 seconds: `animation: float 6s ease-in-out infinite;`

### To Change Position:
```css
.floating-logo-container {
  right: 16px;    /* Distance from right edge */
  top: 50%;       /* Vertical center (50%) or adjust as needed */
}
```

---

## Logo File Naming

Suggested naming for easy identification:
```
red-lotus-main-logo.png
red-lotus-brand-mark.svg
red-lotus-symbol.png
redlotus-wordmark.svg
```

Keep it descriptive!

---

## Full Example: SVG Logo

If you want to embed an SVG directly (no image file needed):

**In MinimalLayout.tsx:**
```tsx
<svg className="floating-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="none" stroke="#000" strokeWidth="2"/>
  <path d="M 50 10 Q 90 50 50 90 Q 10 50 50 10" fill="#000"/>
  {/* Add your SVG paths here */}
</svg>
```

---

## Quick Checklist

- [ ] Logo file ready (PNG or SVG)
- [ ] Logo placed in `src/assets/` folder
- [ ] Import statement added to MinimalLayout.tsx
- [ ] Placeholder replaced with image/logo element
- [ ] Tested on mobile device
- [ ] Tested on desktop
- [ ] Verified opacity is subtle (15%)
- [ ] Confirmed logo doesn't block content
- [ ] Checked all screen sizes (mobile, tablet, desktop)

---

## Troubleshooting

### Logo not appearing?
1. Check file path in import statement
2. Verify file exists in assets folder
3. Check browser console for errors
4. Try refreshing page (Cmd+Shift+R / Ctrl+Shift+R)

### Logo too bright or too dark?
1. Adjust opacity in CSS (0.05 to 0.30 range usually works)
2. Try inverting colors if too dark

### Logo interfering with content?
1. Check z-index (should be 10, content is higher)
2. Verify pointer-events: none; is set
3. Adjust max-width/max-height values

### Logo looks pixelated?
1. Use vector format (SVG) for crisp quality
2. Ensure image resolution is at least 1000x1000px
3. Use PNG with transparency instead of JPG

### Animation seems jittery?
1. Try `animation: float 8s ease-in-out infinite;` (slower)
2. Reduce translate distance: `translateY(-10px);` (less movement)

---

## Examples

### Example 1: PNG Logo
```tsx
// At top of file
import redLotusLogo from '../assets/red-lotus-logo.png';

// In JSX
<img 
  src={redLotusLogo} 
  alt="Red Lotus" 
  className="floating-logo"
/>
```

### Example 2: SVG Logo
```tsx
// At top of file
import RedLotusLogoSvg from '../assets/red-lotus-logo.svg?react';

// In JSX
<RedLotusLogoSvg className="floating-logo" />
```

### Example 3: URL-based Logo
```tsx
<img 
  src="https://cdn.example.com/red-lotus-logo.png" 
  alt="Red Lotus" 
  className="floating-logo"
/>
```

---

## Performance Considerations

- **PNG**: ~50-200KB (depends on complexity)
- **SVG**: ~5-50KB (generally smaller)
- **WebP**: ~30-100KB (better compression)

**Recommendation**: Use SVG or optimized PNG for best performance.

---

## Next Steps After Logo Implementation

1. ✅ Add logo image
2. ✅ Update MinimalLayout.tsx
3. ✅ Test on all devices
4. ✅ Adjust opacity if needed
5. Build and deploy:
   ```bash
   npm run build
   ```

---

**Questions?** Refer back to this guide or adjust CSS values in `minimalist.css` as needed!

---

**Last Updated**: January 21, 2026
**Status**: Ready for Logo Implementation
