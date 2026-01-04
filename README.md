# Personal Blog

A minimal, cyberpunk-themed personal blog built with Angular 19+. Features markdown-based posts, dark/light mode toggle, and optimized performance.

## Features

- 🎨 **Cyberpunk aesthetic** with neon magenta accents and grid backgrounds
- 🌓 **Dark/Light mode** toggle with localStorage persistence
- 📝 **Markdown-based posts** - Write content in `.md` files
- ⚡ **Performance optimized** - Minified JS/CSS, lazy loading, and code splitting
- 📱 **Responsive design** - Works on desktop, tablet, and mobile
- 🎯 **Zero dependencies** for content management
- 🚀 **Fast builds** - Production bundle ~60 KB (gzipped)

## Tech Stack

- **Framework**: Angular 19+ (standalone components)
- **Language**: TypeScript
- **Styling**: SCSS with CSS custom properties
- **Build**: Angular CLI with esbuild
- **State**: Angular Signals
- **Routing**: Angular Router with lazy loading

## Getting Started

### Prerequisites

- Node.js 18+ and npm 10+

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start dev server at http://localhost:4200
npm start
```

### Production Build

```bash
# Build optimized production bundle
npm run build:prod

# Preview production build locally
npm run preview:prod
```

## Adding New Posts

1. **Create a markdown file** in `public/posts/`:

```markdown
---
title: Your Post Title
dateKey: "20260105"
---

Your content here in markdown format.

Support for multiple paragraphs.
```

2. **Add entry to index** in `public/posts/index.json`:

```json
{
  "slug": "your-post-slug",
  "title": "Your Post Title",
  "dateKey": "20260105",
  "preview": "First line of your post for the home page preview."
}
```

3. **Done!** Rebuild and the post appears automatically.

## Project Structure

```
├── public/
│   ├── posts/              # Markdown blog posts
│   │   ├── index.json      # Post metadata
│   │   └── *.md            # Individual posts
│   └── assets/             # Static assets
├── src/
│   ├── app/
│   │   ├── pages/          # Route components
│   │   │   ├── home/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── project/
│   │   │   └── post-detail/
│   │   └── shared/         # Shared components & services
│   │       ├── page-shell/
│   │       ├── services/
│   │       └── utils/
│   ├── styles.scss         # Global styles
│   └── index.html
└── angular.json            # Build configuration
```

## Build Optimizations

- **Minification**: JS, CSS, and HTML compressed
- **Tree-shaking**: Unused code eliminated
- **Code splitting**: Lazy-loaded routes
- **Critical CSS**: Inlined for instant render
- **Font inlining**: Zero font requests
- **License extraction**: Separate file for smaller bundles

## Customization

### Theme Colors

Edit CSS custom properties in `src/styles.scss`:

```scss
:root {
  --neon-magenta: #ff00ff;
  --bg-black: #000000;
  --text-white: #ffffff;
  // ... more variables
}
```

### Navigation

Update routes in `src/app/app.routes.ts` and navigation links in `src/app/shared/page-shell/page-shell.component.html`.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

Built with Angular and cyberpunk vibes.
