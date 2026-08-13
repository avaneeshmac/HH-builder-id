# Tech Stack - HH Goa 2026 Builder ID

This document outlines all technologies, frameworks, and tools used in the HH Goa 2026 Builder ID project.

---

## Frontend

### Core Framework & Libraries
- **React 18.3.1** - Modern UI library for building component-based interfaces
- **React DOM 18.3.1** - React rendering for web browsers
- **TypeScript 5.4.5** - Typed superset of JavaScript for better developer experience and code quality

### Build Tools
- **Vite 5.3.1** - Next-generation frontend build tool with hot module replacement
- **@vitejs/plugin-react 4.3.1** - Vite plugin for React support with Fast Refresh

### Styling
- **Tailwind CSS 3.4.4** - Utility-first CSS framework for rapid UI development
- **PostCSS 8.4.38** - CSS transformer for processing Tailwind CSS
- **Autoprefixer 10.4.19** - PostCSS plugin to add vendor prefixes automatically

### UI Components & Icons
- **Lucide React 0.395.0** - Beautiful & consistent icon toolkit

### Special Features
- **Canvas Confetti 1.6.0** - Celebratory confetti animations for user interactions
- **heic2any 0.0.4** - HEIC to JPEG/PNG conversion for image uploads

---

## Backend

### Server Framework
- **Express 4.19.2** - Fast, unopinionated, minimalist web framework for Node.js
- **CORS 2.8.5** - Middleware for enabling Cross-Origin Resource Sharing
- **dotenv 16.4.5** - Environment variable management

### Development Tools
- **tsx 4.15.6** - TypeScript Execute - run TypeScript files directly with watch mode

---

## Development Environment

### Type Definitions
- **@types/node 20.14.9** - TypeScript definitions for Node.js
- **@types/react 18.3.3** - TypeScript definitions for React
- **@types/react-dom 18.3.0** - TypeScript definitions for React DOM
- **@types/express 4.17.21** - TypeScript definitions for Express
- **@types/cors 2.8.17** - TypeScript definitions for CORS
- **@types/canvas-confetti 1.6.4** - TypeScript definitions for Canvas Confetti

### Compilation Targets
- **ES2020** - Modern JavaScript features supported by evergreen browsers

---

## External Services

### Image Hosting & CDN
- **Cloudinary** - Cloud-based image storage and delivery platform
  - Used for storing and serving generated Builder ID cards
  - Supports image optimization and transformation

---

## Custom Design System

### Color Palette
The project uses a custom color system defined in Tailwind:

#### Obsidian (Dark Theme)
- Default: `#0B0F17`
- Light: `#161F30`
- Dark: `#05070B`

#### Goa Colors (Brand Colors)
- Teal: `#0D9488`
- Emerald: `#10B981`
- Orange: `#F97316`
- Yellow: `#F59E0B`
- Coral: `#EF4444`

### Typography
- **Sans-serif**: Space Grotesk, Outfit, Inter
- **Monospace**: Space Mono, Fira Code

---

## Social Media Integration

### Open Graph & Twitter Cards
- Full Open Graph meta tags for link previews
- Twitter Card integration with `summary_large_image`
- Dynamic meta tag generation for shared Builder IDs
- Supported platforms: Facebook, WhatsApp, LinkedIn, Slack, Twitter/X

---

## Architecture Highlights

### Development Workflow
- **Client**: Vite dev server on port 5173 with HMR
- **Server**: Express server on port 3000
- **Proxy**: API requests proxied from Vite to Express during development

### Build Output
- Client build: `dist/client/`
- Server build: `dist/server/`

### Routing
- Client-side: React handles UI routing
- Server-side: Express serves static files and share routes
- Share route (`/share/:id`) generates OG-tagged HTML for social previews

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build:client` | Build React frontend with TypeScript |
| `npm run build:server` | Build Express server with TypeScript |
| `npm run build` | Build both client and server |
| `npm start` | Run production server |
| `npm run server:dev` | Run server in development mode with watch |

---

## Project Type

- **Type**: Full-stack web application
- **Purpose**: Generate personalized Builder ID cards for HH Goa 2026 participants
- **Deployment**: Production-ready with client-side and server-side builds

---

*Last updated: August 2026*
