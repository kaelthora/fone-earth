# FONE Website

A modern, minimalist website built with Astro and Tailwind CSS. Features a dark/light theme toggle, responsive design, and SEO optimization.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v4.16+
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.4+
- **Output**: Static HTML (SSG)
- **Fonts**: Inter & Plus Jakarta Sans (Google Fonts)

## Features

- Dark theme by default (black background with elegant gold accents)
- Light theme option (white background with soft pastel blues)
- Theme toggle with localStorage persistence
- Fully responsive design (mobile-first)
- SEO optimized with meta tags, Open Graph, and Twitter Cards
- Smooth page transitions and animations
- Clean component-based architecture
- Accessible and semantic HTML

## Project Structure

```
FONE V4/
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── PageHero.astro
│   │   ├── Section.astro
│   │   └── ThemeToggle.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── mission.astro
│   │   ├── community.astro
│   │   └── contact.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18.17.1 or higher
- npm, yarn, or pnpm

### Setup

1. Navigate to the project directory:

```bash
cd "FONE V4"
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit: `http://localhost:4321`

## Available Scripts

| Command           | Description                                    |
|-------------------|------------------------------------------------|
| `npm run dev`     | Start development server at localhost:4321     |
| `npm run build`   | Build production site to `./dist/`             |
| `npm run preview` | Preview production build locally               |

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` folder, ready to deploy to any static hosting service.

## Deployment

This site can be deployed to any static hosting service:

- **Vercel**: `npx vercel`
- **Netlify**: Connect your repository or drag & drop the `dist/` folder
- **GitHub Pages**: Use the built `dist/` folder
- **Cloudflare Pages**: Connect your repository

## Customization

### Colors

Edit `tailwind.config.mjs` to customize the color palette:

- `gold.*` - Dark theme accent colors
- `pastel.*` - Light theme accent colors
- `dark.*` - Background shades for dark theme

### Typography

The site uses Google Fonts. To change fonts, update:
1. The font imports in `src/styles/global.css`
2. The `fontFamily` configuration in `tailwind.config.mjs`

### Content

All pages are in `src/pages/`. Edit the placeholder content directly in each `.astro` file.

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

MIT License - feel free to use this project as a starting point for your own website.
