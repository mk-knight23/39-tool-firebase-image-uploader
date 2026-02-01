# VisualVault - Creative Asset Management Platform

A sophisticated, visually-focused image management and uploader platform built with Angular 19 and Firebase. Designed for creative professionals who demand both aesthetic excellence and functional power.

## Visual Gallery Theme

This application features a premium **"Visual Gallery/Creator"** design system:
- Light gray background with white cards featuring subtle, elegant shadows
- Masonry-style responsive grid layout for optimal visual presentation
- Large image previews with smooth hover interactions
- Indigo and pink gradient accents for creative flair
- Focus on visual content with minimal interface clutter

## Features

| Feature | Description |
|---------|-------------|
| **Drag & Drop Upload** | Elegant dropzone with gradient hover effects • **NEW: Multiple image selection** |
| **Masonry Gallery** | Responsive column-based layout that adapts to screen size |
| **Image Lightbox** | Full-screen preview with detailed metadata |
| **Category Filtering** | Filter by Photography, Design, 3D Art, Vectors |
| **Favorites System** | Like/unlike images with heart animations |
| **Dark Mode** | Automatic theme switching with proper contrast |
| **Search** | Real-time search through your visual library |
| **Stats Dashboard** | Track assets, favorites, and storage usage |

## Tech Stack

- **Framework:** Angular 19 (Standalone Components, Signals)
- **Styling:** Tailwind CSS v4 with custom design system
- **Backend:** Firebase (Firestore, Storage, Auth ready)
- **Icons:** Lucide Angular
- **Typography:** Inter (body), Outfit (headings)

## Design System

See `design-system/MASTER.md` for complete design token documentation.

### Color Palette
```css
--gallery-primary: #6366f1;      /* Indigo */
--gallery-secondary: #ec4899;    /* Pink */
--gallery-accent: #14b8a6;       /* Teal */
```

### Key Components
- `.gallery-card` - Image cards with hover lift effect
- `.upload-zone` - Gradient-bordered drag & drop area
- `.masonry-grid` - Responsive column layout
- `.lightbox-backdrop` - Full-screen image preview modal

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Configuration

1. Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'your-api-key',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '...',
    appId: '...'
  }
};
```

## Project Structure

```
src/
├── app/
│   ├── features/
│   │   ├── uploader/      # Upload components
│   │   └── gallery/       # Gallery components
│   ├── services/          # Settings, stats, audio
│   └── app.component.ts   # Main orchestration
├── design-system/
│   └── MASTER.md          # Design tokens
└── styles.css             # Global styles
```

## Deployment

This project is configured for deployment on three platforms:

### GitHub Pages
- **Workflow**: `.github/workflows/deploy.yml`
- **Build Command**: `npm run build -- --base-href=/39-tool-firebase-image-uploader/`
- **Output Directory**: `dist/firebase-uploader/browser`
- **Trigger**: Push to `main` branch
- **Action**: `actions/deploy-page@v4`

### Vercel
- **Config**: `vercel.json`
- **Framework**: Angular
- **Build Command**: `npm run build`
- **Output Directory**: `dist/firebase-uploader/browser`
- **Rewrites**: SPA fallback to `/index.html`

### Netlify
- **Config**: `netlify.toml`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist/firebase-uploader/browser`
- **Redirects**: All paths to `/index.html` (SPA support)

### Firebase Hosting
- **Config**: `firebase.json`
- **Command**: `firebase deploy` or `npm run deploy`

---

## Live Links

| Platform | URL |
|----------|-----|
| **GitHub Pages** | https://mk-knight23.github.io/39-tool-firebase-image-uploader/ |
| **Vercel** | https://39-tool-firebase-image-uploader.vercel.app/ |
| **Netlify** | https://39-tool-firebase-image-uploader.netlify.app/ |

---

**Theme:** Visual Gallery/Creator
**Made by:** MK — Musharraf Kazi
**License:** MIT
