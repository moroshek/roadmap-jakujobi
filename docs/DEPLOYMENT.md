# Deployment Guide

Production build steps, static hosting, and environment configuration.

---

## Production Build Steps

### Build Command

```bash
npm run build
```

Next.js uses `output: 'export'` (see `next.config.js`), which produces a fully static site in the `out/` directory. No Node.js server is required at runtime.

### Build Output

After a successful build:

- Static files are written to `out/`
- HTML, JS, CSS, and assets are self-contained
- Each route (e.g. `/`, `/matrix`, `/roadmap`, `/projects`) has an `index.html`
- Dynamic routes like `/projects/[id]` are pre-rendered at build time for each known project

### Pre-Build Checklist

1. Ensure `_content/projects/` contains valid markdown files
2. Ensure `_content/config.json` exists and is valid JSON
3. Run `npm run test` and fix any failing tests
4. Run `npm run lint` and fix any lint errors

### Local Production Test

```bash
npm run build
npm run start
```

Then open [http://localhost:3000](http://localhost:3000) to verify the production build locally.

---

## Static Hosting Instructions

The `out/` directory can be deployed to any static hosting provider.

### Vercel

1. Connect the repository to Vercel
2. Build command: `npm run build`
3. Output directory: `out`
4. Vercel will detect Next.js; override output directory if needed

### Netlify

1. Build command: `npm run build`
2. Publish directory: `out`
3. No plugins required for static sites

### AWS S3 + CloudFront

1. Run `npm run build`
2. Upload contents of `out/` to an S3 bucket
3. Configure the bucket for static website hosting, or use CloudFront
4. Set index document to `index.html`
5. Enable "error document" for SPA routing if using client-side routing (Next.js static export uses real paths, so this may not be needed)

### GitHub Pages

1. Build: `npm run build`
2. Deploy the `out/` folder to the `gh-pages` branch or use GitHub Actions
3. Set base path in `next.config.js` if the site lives in a subpath (e.g. `/roadmap-engine/`)

### Other Providers

Any host that serves static files (Firebase Hosting, Azure Static Web Apps, etc.) can serve the `out/` directory. Point the document root to `out` and ensure `index.html` is the default.

---

## Environment Configuration

### Current Setup

Roadmap Engine uses **build-time content** only. There is no runtime environment variable requirement for core functionality. All content comes from `_content/`.

### Optional Environment Variables

If you add features that need them in the future:

- `NEXT_PUBLIC_*` - Exposed to the browser (e.g. analytics IDs)
- Use `.env.local` for local development
- Use your hosting provider’s environment variable UI for production

### Tenant Configuration

Tenant-specific settings live in `_content/config.json`, not in env vars:

- `tenant_id`, `meta` (title, logo, favicon)
- `design_tokens` (colors, typography)
- `modules` (enable_matrix, enable_gantt, enable_blog)
- `governance` (phases, departments, fiscal year)

To deploy for a new tenant:

1. Copy or replace `_content/` with the tenant’s content
2. Update `config.json` and project markdown files
3. Run `npm run build`
4. Deploy the resulting `out/` directory

---

## Multi-Tenant Deployment

Each tenant gets its own `_content/` directory. Common approaches:

**Option A: Separate Repos**

- One repo per tenant; each has its own `_content/`
- Same engine code; different content
- Deploy each repo to its own URL

**Option B: Monorepo**

- Single repo with multiple content folders (e.g. `_content/tenant-a/`, `_content/tenant-b/`)
- Build script selects content based on env var or build arg
- Deploy each build to a different subdomain or path

**Option C: CI Parameter**

- Single repo; CI job receives tenant id
- Script copies the right `_content/` before `npm run build`
- Deploy to tenant-specific URL

---

## Troubleshooting

### Build Fails with "Projects directory not found"

- Ensure `_content/projects/` exists
- Path is resolved from `process.cwd()`; run the build from the project root

### Build Fails with Validation Errors

- Check the error output for the offending project file
- Ensure frontmatter matches `ProjectSchema` (see `src/lib/validation/projectSchema.ts`)
- Required: id, title, slug, owner, department, phase, status, dates, scores, financials, tags, related_projects

### Dev Server Cache Issues (Ctrl+R Causes 404)

- Run `npm run dev:clean` to clear `.next` and restart
- See `docs/changelog.md` for details on the webpack cache workaround
