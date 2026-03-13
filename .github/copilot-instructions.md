
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

---

## Design Context

### Users
**Audience:** General tech enthusiasts—curious learners, makers, and builders exploring projects, experiments, and personal thoughts on tech and culture (including anime).

**Context:** Browsing casually for inspiration, learning notes, or just exploring what's new. Not seeking formal documentation—more like peeking into someone's digital workshop.

**Job to be done:** Discover interesting projects, learn from experiments, enjoy personal takes on tech and culture.

### Brand Personality
**Three words:** Playful, minimal, bold

**Voice & Tone:** Approachable yet confident. Casual but intentional. Not overly serious—friendly and human, with hints of personality and experimentation.

**Emotional goals:** Chill vibes with ambient energy. The interface should feel like a lo-fi cyberpunk space—smooth, atmospheric, and welcoming. Think Blade Runner 2049: cinematic, muted neons, soft gradients, atmospheric depth, not aggressive.

### Aesthetic Direction
**Visual tone:** Lo-fi cyberpunk—smooth, soft, ambient. Less harsh contrast, more atmospheric gradients and subtle glows.

**References:** 
- **Blade Runner 2049** (cinematic color grading, muted oranges/purples, atmospheric depth, holographic UI touches)
- Current grid backgrounds and purple radial glows are on-brand
- Glitch effects (logo) add playful boldness without overdoing it

**Theme:**
- **Dark mode (primary):** Black background with grid pattern, neon magenta (#ff2b9f) as primary accent, purple-muted (#7e3c93), cyan (#00afec) for contrast. Soft atmospheric gradients.
- **Light mode:** Shift from "wheat" to a softer cyberpunk-inspired palette (e.g., pale lavender, soft blue-grey, or muted peach) to maintain the lo-fi cyberpunk continuity while providing contrast.

**Typography:** Clean sans-serif (system fonts) for readability. Audiowide for logo/headers to add cyberpunk character without overwhelming.

**Not this:** Generic dark mode sites, overly aggressive neon (like Cyberpunk 2077 UI), corporate tech blogs, material design, bootstrap defaults.

### Design Principles

1. **Atmosphere over aggression** – Use soft glows, gradients, and muted neons instead of harsh contrasts. Lo-fi cyberpunk means ambient, not intense.

2. **Minimal with personality** – Strip unnecessary complexity, but inject playful touches (glitch effects, subtle animations, color accents) where they add delight.

3. **Content leads, design supports** – The blog posts, projects, and writing are the hero. UI should frame content beautifully without competing for attention.

4. **Accessible depth** – Meet WCAG AA standards while maintaining the cyberpunk aesthetic. Focus states, contrast, and clarity are non-negotiable.

5. **Cinematic polish** – Emulate Blade Runner 2049's approach: every detail is intentional, color is emotive, and the experience feels crafted, not templated.
