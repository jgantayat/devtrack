# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200 (ng serve)
npm run build      # Production build to dist/
npm test           # Run all unit tests with Vitest
npm run watch      # Dev build in watch mode
```

Run a single test file: `ng test --include="**/app.spec.ts"` (swap the glob for any spec file).

For scaffolding: `ng generate component|service|pipe <name>`

## Architecture

**DevTrack** is an Angular 21 client-side SPA (early-stage scaffold). The stack:

- **Angular 21** with standalone components (no NgModules), signals, and strict TypeScript
- **NG-ZORRO (ng-zorro-antd)** for UI components — imported per-module (e.g., `NzButtonModule`, `NzIconModule`). The `src/theme.less` file is the theming entry point; override Less variables there to customize the design system. The `@ant-design/icons-angular` SVG assets are copied to `/assets/` at build time (configured in `angular.json`).
- **Vitest** as the test runner (via `@angular/build:unit-test`). Tests use Angular's `TestBed`.
- **Prettier** for formatting (100 char width, single quotes, Angular HTML parser for templates).

Bootstrap flow: `src/main.ts` → `App` component (`src/app/app.ts`) bootstrapped with `appConfig` from `src/app/app.config.ts`.

## Key conventions

- Components use `signal()` for local state (not traditional class properties).
- All TypeScript is strict: `noImplicitOverride`, `noImplicitReturns`, `strictTemplates`, `strictInjectionParameters` are all enabled.
- Styles: global styles in `src/styles.css`, NG-ZORRO theme overrides in `src/theme.less`. Component-level styles go in `app.css` siblings.
- Routes are defined in `src/app/app.routes.ts`.
- `provideNzI18n(en_US)` is set in `app.config.ts` — locale is English US.
