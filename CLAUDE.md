# Creami Recipes - Development Guidelines

## Tech Stack
- **Frontend**: Astro v5 (hybrid static + SSR), React islands for interactivity
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Animations**: GSAP + PixiJS
- **Deployment**: Vercel

## Code Quality Standards

### TypeScript
- Strict mode enabled (`tsconfig.json` extends `astro/tsconfigs/strict`)
- No `any` types — use `unknown` and narrow with type guards
- Prefer interfaces over type aliases for object shapes
- Use discriminated unions for state management
- All function parameters and return types must be explicitly typed
- Use `satisfies` operator for type-safe object literals

### Architecture Principles
- **DRY**: Extract shared logic into `src/lib/` helpers. No duplicated queries or UI patterns.
- **SOLID**:
  - Single Responsibility: Each component does one thing. Split large components.
  - Open/Closed: Extend via props/slots, don't modify existing components for new use cases.
  - Liskov Substitution: React islands must work with or without hydration context.
  - Interface Segregation: Keep prop interfaces minimal — don't pass entire objects when only a few fields are needed.
  - Dependency Inversion: Components depend on abstractions (types), not concrete Supabase calls. Pass data as props.
- **Composition over inheritance**: Use Astro slots and React composition patterns.

### Testing
- **AAA pattern**: Arrange, Act, Assert — every test follows this structure
- Test files live alongside source: `Component.test.tsx` next to `Component.tsx`
- Unit test all `src/lib/` functions
- Integration test API routes with mock Supabase client
- No snapshot tests — they provide false confidence

### Component Patterns
- **Astro components** (`.astro`) for static content — zero JS shipped
- **React islands** (`.tsx`) only when interactivity is required (forms, ratings, filters, canvas)
- Use `client:visible` for below-fold interactive components
- Use `client:load` only for above-fold critical interactivity
- Keep React islands small and focused

### Styling
- Use Tailwind utility classes directly — no CSS modules or styled-components
- Custom theme colors defined in `src/styles/global.css` under `@theme`
- Use CSS custom properties for values shared between Tailwind and JS
- Mobile-first responsive design (`sm:`, `md:`, `lg:` breakpoints)

### Database & API
- All Supabase queries go through `src/lib/recipes.ts` (or similar domain-specific files)
- Never call Supabase directly from components — pass data as props from page frontmatter
- Use RLS policies for security; never trust client-side auth alone
- Use the service role client only in API routes, never in client-side code

### Performance
- Target Lighthouse scores: Performance 90+, SEO 95+, Accessibility 90+
- Lazy load images with `loading="lazy"`
- PixiJS only on homepage hero, with `client:visible` and mobile fallback
- GSAP respects `prefers-reduced-motion`
- No blocking third-party scripts in `<head>`

### Git & Workflow
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`
- One feature per branch, one concern per commit
- Run `npm run build` before committing to catch type errors

## Project Structure
```
src/
  components/    # Astro (.astro) and React (.tsx) components
    layout/      # BaseLayout, Header, Footer
    recipe/      # Recipe display components
    ui/          # Shared UI primitives
    seo/         # JSON-LD, meta tags
    ads/         # Ad placement zones
    animations/  # GSAP/PixiJS wrappers
  lib/           # Shared utilities, types, Supabase client, query helpers
  pages/         # File-based routing (Astro pages + API routes)
  styles/        # Global CSS, Tailwind theme
supabase/
  migrations/    # SQL migration files (run in order)
scripts/         # One-off scripts (seed, scrape)
```

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `supabase db push` — Push migrations to remote database
- `supabase gen types typescript --project-id <id> > src/lib/database.types.ts` — Generate types
