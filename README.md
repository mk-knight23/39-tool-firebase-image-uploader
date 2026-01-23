# FirebaseHub - Creative Asset Management

A professional image management and uploader platform built with Angular 19 and Firebase. Designed for speed, security, and a premium user experience.

## Overview
FirebaseHub replaces legacy single-file uploaders with a robust, cloud-integrated environment. It features a sophisticated drag-and-drop interface and real-time gallery synchronization.

## Features Comparison

| Feature | Legacy Version | Upgraded (v2.0) |
| :--- | :--- | :--- |
| **Tech Stack** | Basic HTML | **Angular 19 + TypeScript + Firebase** |
| **Uploading** | Single Selection | **Multi-file Drag & Drop** |
| **Feedback** | Basic Alert | **Real-time Progress & Status Tracking** |
| **Storage** | Local/None | **Persistent Firebase Cloud Storage** |
| **Gallery** | Static List | **Responsive Masonry Asset Grid** |
| **Theming** | Light Only | **Sophisticated Dark Mode support** |

## Tech Stack
- **Framework:** Angular 19 (Standalone Components, Signals)
- **Backend:** Firebase (Firestore, Storage, Auth ready)
- **Styling:** Tailwind CSS (Asset hub design system)
- **Icons:** Lucide Angular
- **Typography:** Inter & Outfit

## Project Structure
```text
src/app/
├── features/uploader/      # Drag & drop upload components
├── features/gallery/       # Asset management & grid views
├── types/                  # Strict asset metadata interfaces
└── app.component.ts        # Hub orchestration & navigation
```

## Setup & Build Instructions

### Prerequisites
- Node.js 18.x or higher
- npm 10.x or higher
- A Firebase Project (for cloud features)

### Installation
```bash
# Install dependencies
npm install
```

### Configuration
1. Create a `src/environments/environment.ts` file.
2. Add your Firebase configuration object.

### Development
```bash
# Start development server
npm start
```

### Production Build
```bash
# Build for production
npm run build
```

## Deployment
Optimized for Firebase Hosting, Vercel, or GitHub Pages.

---

**License:** MIT
**System Architect:** mk-knight23
