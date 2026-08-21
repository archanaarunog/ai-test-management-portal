# AI Test Management Portal

An enterprise-styled, single-page React application built as a **Software Under Test (SUT)** for a Java Playwright / Selenium automation framework. Every interactive element on every screen carries a stable `id`, `name` (where applicable), `data-testid`, and `aria-label`, and the codebase is organized so that future versions can intentionally rename/relocate/restructure elements to practice self-healing automation.

## Tech stack
React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · React Context API · TanStack Table v8 · Recharts · React Hook Form · React Toastify · Lucide React · Framer Motion · React Datepicker — all data is local mock JSON, no backend required.

## Getting started
```bash
npm install
npm run dev       # start local dev server
npm run build      # production build (outputs to dist/)
npm run preview    # preview the production build
```

## Demo login
- **Email:** `achu.nair@aitestportal.dev`
- **Password:** `Automate@123`

(Shown on the login screen as well.)

## App structure
```
src/
  components/
    auth/        Login, forgot-password modal, protected route
    layout/      Header, Sidebar, Breadcrumbs, AppLayout shell
    dashboard/   Summary cards, charts, activity feed, notifications
    tests/       Filters, TanStack table, Add/Edit/View modals, delete dialog
    forms/       Full form-control showcase with validation
    dialogs/     Modals + native alert/confirm/prompt + all toast types
    dynamic/     Spinner, skeleton, progress bar, tooltips, tabs, accordion
    mouse/       Drag & drop, hover menu, context menu, double-click, resize
    browser/     New tab/window, external link, file download
    advanced/    iframe, keyboard shortcuts, disabled/readonly/hidden, live content
  context/       AuthContext (React Context API)
  data/          Local mock data (tests, activity, notifications, users, charts)
  config/        Sidebar/navigation section config
  types/         Shared TypeScript interfaces
```

## Automation coverage
This app is deliberately built to exercise nearly every common Playwright/Selenium interaction: click, double-click, right-click, hover, drag & drop, keyboard actions, all form input types, file upload/download, modal handling, native alerts, iframe handling, multiple tabs/windows, sortable/searchable/paginated/expandable tables, toasts, tooltips, loading/skeleton waits, dynamic content polling, and responsive layout checks.

## Note
This is a practice/demo application only — it is not a production system, and all data is mocked in-memory (no backend, no persistence beyond `localStorage` for the "remember me" session flag).
