# DevTrack

A personal developer productivity dashboard built with **Angular 21** and **NG-ZORRO**.
All data is stored in `localStorage` — no backend needed.

---

## Features

- **Tasks** — add, edit, delete, and filter tasks by status, priority, and category
- **Goals** — track goals with progress sliders, star ratings, and deadlines
- **Daily Log** — calendar-based diary with tag autocomplete and mood tracking
- **Dashboard** — cross-feature KPIs, recent tasks, and top goals at a glance
- **Settings** — display name, avatar, theme switching (light / dark / compact),
  sidebar defaults, and full data export / reset

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Angular 21 (standalone components, signals) |
| UI Library | NG-ZORRO 21.x (Ant Design of Angular) |
| State | Angular Signals (`signal`, `computed`, `effect`) |
| Forms | Reactive Forms |
| Persistence | `localStorage` (no backend) |
| Styling | CSS custom properties (variables) |
| Build | Angular CLI + Vite |

---

## Getting started

```bash
# Install dependencies
npm install

# Start development server
ng serve --open

# Production build
ng build --configuration production
```

The app opens at `http://localhost:4200`.

---

## Project structure