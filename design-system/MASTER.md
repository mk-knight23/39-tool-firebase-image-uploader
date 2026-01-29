# Visual Gallery/Creator Design System

**Theme Identity:** Artistic, visually-focused image management platform

## Color Palette

### Primary Colors
```css
--gallery-primary: #6366f1;      /* Indigo - creative accent */
--gallery-secondary: #ec4899;    /* Pink - artistic flair */
--gallery-accent: #14b8a6;       /* Teal - fresh highlight */
```

### Background & Surface
```css
--gallery-bg: #fafafa;           /* Light gray background */
--gallery-surface: #ffffff;      /* White cards */
--gallery-surface-alt: #f3f4f6;  /* Light gray alt */
```

### Text Colors
```css
--gallery-text-primary: #111827; /* Near black */
--gallery-text-secondary: #6b7280; /* Gray */
--gallery-text-muted: #9ca3af;   /* Light gray */
```

## Typography

### Font Families
```css
--font-display: 'Outfit', sans-serif;  /* Headings */
--font-body: 'Inter', sans-serif;      /* Body text */
```

### Type Scale
```css
--text-xs: 0.75rem;    /* 12px - captions, badges */
--text-sm: 0.875rem;   /* 14px - secondary text */
--text-base: 1rem;     /* 16px - body */
--text-lg: 1.125rem;   /* 18px - emphasized */
--text-xl: 1.25rem;    /* 20px - small headings */
--text-2xl: 1.5rem;    /* 24px - section headings */
--text-4xl: 2.25rem;   /* 36px - hero text */
```

### Font Weights
```css
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;
```

## Spacing System

```css
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

## Border Radius

```css
--radius-sm: 0.5rem;   /* 8px - small elements */
--radius-md: 1rem;     /* 16px - cards */
--radius-lg: 1.5rem;   /* 24px - large cards */
--radius-xl: 2rem;     /* 32px - hero elements */
--radius-2xl: 2.5rem;  /* 40px - special elements */
```

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
--shadow-card: 0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08);
```

## Component Patterns

### Gallery Grid
- Masonry-style responsive layout
- Cards with hover lift effect
- Subtle border and elegant shadows

### Image Cards
```css
.gallery-card {
  background: var(--gallery-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### Upload Zone
```css
.upload-zone {
  background: linear-gradient(135deg, var(--gallery-surface) 0%, var(--gallery-surface-alt) 100%);
  border: 2px dashed #d1d5db;
  border-radius: var(--radius-2xl);
  transition: all 0.3s ease;
}

.upload-zone:hover {
  border-color: var(--gallery-primary);
  background: linear-gradient(135deg, #eef2ff 0%, #fae8ff 100%);
}
```

### Action Buttons
```css
.btn-primary {
  background: var(--gallery-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-weight: var(--font-bold);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

## Animation Presets

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}
```

## Layout Patterns

### Masonry Grid
```css
.masonry-grid {
  column-count: 1;
  column-gap: 1.5rem;
}

@media (min-width: 640px) {
  .masonry-grid { column-count: 2; }
}

@media (min-width: 1024px) {
  .masonry-grid { column-count: 3; }
}

@media (min-width: 1280px) {
  .masonry-grid { column-count: 4; }
}
```

## Dark Mode Overrides

```css
.dark {
  --gallery-bg: #0a0a0a;
  --gallery-surface: #171717;
  --gallery-surface-alt: #262626;
  --gallery-text-primary: #fafafa;
  --gallery-text-secondary: #a1a1aa;
  --gallery-text-muted: #737373;
}
```

## Design Tokens Summary

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Background | #fafafa | #0a0a0a |
| Surface | #ffffff | #171717 |
| Primary | #6366f1 | #818cf8 |
| Secondary | #ec4899 | #f472b6 |
| Text Primary | #111827 | #fafafa |
| Text Secondary | #6b7280 | #a1a1aa |
