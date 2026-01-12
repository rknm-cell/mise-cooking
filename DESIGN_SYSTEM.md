# Mise Design System

## Overview

Mise is a recipe generation app with a warm, culinary-inspired design system. The design emphasizes accessibility, usability, and a delightful cooking experience through carefully chosen colors, typography, and component patterns.

## Brand Identity

### Name & Pronunciation
- **Name**: Mise (pronounced "meez")
- **Origin**: Short for "mise en place" - the French culinary term for "everything in its place"
- **Brand Voice**: Welcoming, helpful, and encouraging for home cooks

### Logo & Typography
- **Primary Font**: Nanum Pen Script (cursive, handwritten style)
- **Secondary Font**: System fonts for body text
- **Logo Treatment**: Handwritten style with warm yellow accent

## Color Palette

### Primary Colors
```css
/* Ocean Teal */
--primary-ocean: #1d7b86
--primary-ocean-light: #426b70
--primary-ocean-medium: #428a93

/* Warm Yellow */
--accent-yellow: #fcf45a
--accent-yellow-light: #fcf45a/70
--accent-yellow-dark: #fcf45a/90
```

### Background Gradients
```css
/* Main Background */
background: linear-gradient(to bottom, #1d7b86, #426b70)

/* Card Backgrounds */
--card-bg: #428a93
--card-border: #fcf45a
```

### Text Colors
```css
/* Primary Text */
--text-white: #ffffff
--text-black: #000000

/* Accent Text */
--text-yellow: #fcf45a
--text-ocean: #1d7b86
```

### Status Colors
```css
/* Success */
--success-bg: #dcfce7
--success-border: #22c55e
--success-text: #166534

/* Error */
--error-bg: #fef2f2
--error-border: #ef4444
--error-text: #dc2626

/* Loading */
--loading-bg: #fcf45a/20
--loading-fill: #fcf45a/80
```

## Typography

### Font Hierarchy
```css
/* Display Headings */
.nanum-pen-script-regular {
  font-family: "Nanum Pen Script", cursive;
  font-weight: 400;
  font-style: normal;
}

/* Logo Sizes */
.logo-primary { font-size: 5rem; } /* 80px */
.logo-secondary { font-size: 2.5rem; } /* 40px */

/* Body Text */
body {
  font-family: system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
}
```

### Text Sizes
- **Logo Primary**: 5rem (80px)
- **Logo Secondary**: 2.5rem (40px)
- **Heading Large**: 2rem (32px)
- **Heading Medium**: 1.5rem (24px)
- **Heading Small**: 1.25rem (20px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)
- **Extra Small**: 0.75rem (12px)

## Component Library

### Buttons

#### Primary Button
```tsx
<Button className="bg-[#fcf45a]/70 text-black hover:bg-[#fcf45a] font-semibold">
  Send
</Button>
```

#### Secondary Button
```tsx
<Button className="bg-white text-[#1d7b86] hover:bg-gray-100 font-semibold">
  Save Recipe
</Button>
```

#### Outline Button
```tsx
<Button variant="outline" className="border-[#fcf45a] text-[#fcf45a] hover:bg-[#fcf45a]/20">
  Keep for Now
</Button>
```

#### Ghost Button
```tsx
<Button variant="ghost" className="text-[#fcf45a] hover:bg-[#fcf45a]/20">
  Clear
</Button>
```

### Input Fields

#### Primary Input
```tsx
<Input 
  className="bg-zinc-500 text-white focus:outline-none focus:ring-0"
  placeholder="What do you want to make?"
/>
```

### Cards

#### Primary Card
```tsx
<Card className="bg-[#428a93] border-[#fcf45a]">
  <CardHeader>
    <CardTitle className="text-[#fcf45a]">Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Progress Bar

#### Loading Progress
```tsx
<Progress 
  value={progress} 
  className="bg-[#fcf45a]/20"
/>
```

## Layout Patterns

### Main Container
```tsx
<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1d7b86] to-[#426b70] text-white">
  <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
    {/* Content */}
  </div>
</main>
```

### Recipe Generator Container
```tsx
<div className="flex h-[100px] w-full max-w-2xl flex-col rounded-xl bg-[#428a93] p-4">
  {/* Input and controls */}
</div>
```

### Recipe Actions Container
```tsx
<Card className="w-full max-w-2xl mx-auto mt-4 bg-[#428a93] border-[#fcf45a]">
  <CardHeader className="pb-2">
    <CardTitle className="text-[#fcf45a] text-lg">Recipe Actions</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    {/* Action buttons */}
  </CardContent>
</Card>
```

## Interactive States

### Loading States
- **Progress Bar**: Animated fill with yellow accent
- **Button Loading**: Spinner with "Saving..." text
- **Input Disabled**: Reduced opacity and disabled cursor

### Success States
- **Save Success**: Green background with checkmark
- **Recipe Generated**: Smooth animation with motion

### Error States
- **Save Error**: Red background with retry button
- **Input Error**: Red border and ring focus

## Spacing System

### Container Spacing
- **Main Container**: `gap-12` (48px)
- **Card Spacing**: `space-y-3` (12px)
- **Button Groups**: `gap-2` (8px)

### Padding
- **Main Container**: `px-4 py-16`
- **Cards**: `p-4` or `px-6 py-6`
- **Buttons**: `px-4 py-2`

### Margins
- **Section Spacing**: `mt-4` (16px)
- **Component Spacing**: `mb-4` (16px)

## Responsive Design

### Breakpoints
- **Mobile**: Default (320px+)
- **Small**: `sm:` (640px+)
- **Medium**: `md:` (768px+)
- **Large**: `lg:` (1024px+)

### Responsive Text
```tsx
// Logo responsive sizing
<span className="nanum-pen-script-regular text-8xl text-[#fcf45a]">
  Mise
</span>

// Card title responsive sizing
<CardTitle className="text-lg sm:text-xl lg:text-2xl">
  {name}
</CardTitle>
```

### Responsive Layout
```tsx
// Container responsive width
<div className="w-full max-w-2xl mx-auto">

// Card responsive sizing
<Card className="flex w-full sm:m-4 lg:w-3/4">
```

## Accessibility

### Focus States
- **Buttons**: Ring focus with yellow accent
- **Inputs**: Ring focus with proper contrast
- **Cards**: Subtle focus indicators

### Color Contrast
- **Primary Text**: High contrast white on dark backgrounds
- **Accent Text**: Yellow on dark backgrounds for visibility
- **Interactive Elements**: Clear hover and focus states

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Descriptive labels for interactive elements
- **Loading States**: Announcements for dynamic content

## Animation & Motion

### Loading Animations
```tsx
// Progress bar animation
const timer = setInterval(() => {
  setProgress((prevProgress) => {
    const newProgress = prevProgress + increment;
    return newProgress >= 100 ? 100 : newProgress;
  });
}, updateInterval);
```

### Button Loading States
```tsx
// Spinner animation
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1d7b86]"></div>
```

### Recipe Generation
- **Smooth transitions** between states
- **Motion animations** for recipe cards
- **Progressive disclosure** of content

## Iconography

### Emoji Usage
- **Cooking**: 🍳 (Start Recipe Session)
- **Book**: 📖 (Save Recipe)
- **Checkmark**: ✓ (Success states)
- **Refresh**: 🔄 (Retry actions)

### Custom Icons
- **Loading Spinner**: Custom CSS animation
- **Progress Indicator**: Custom styled progress bar

## Best Practices

### Component Usage
1. **Consistent Spacing**: Use the defined spacing system
2. **Color Consistency**: Always use the defined color palette
3. **Typography Hierarchy**: Follow the established font sizes
4. **Responsive Design**: Ensure components work across all breakpoints

### Performance
1. **Optimized Animations**: Use CSS transforms and opacity
2. **Lazy Loading**: Load components as needed
3. **Efficient Re-renders**: Use proper React patterns

### Accessibility
1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **Screen Reader Support**: Proper ARIA labels and semantic HTML
3. **Color Contrast**: Meets WCAG AA standards
4. **Focus Management**: Clear focus indicators

## Implementation Notes

### CSS Custom Properties
The design system uses CSS custom properties for consistent theming and easy maintenance.

### Tailwind Integration
All components are built with Tailwind CSS classes for consistency and maintainability.

### Component Variants
Use the `cva` (class-variance-authority) pattern for component variants to ensure consistency across the application.

---

*This design system is living documentation and should be updated as the application evolves.* 