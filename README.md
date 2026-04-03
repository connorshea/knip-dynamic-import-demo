# knip-dynamic-import-demo

Demonstrates how **Knip v6** treats `return import('./Module')` differently from **Knip v5**, causing false positives (and potential false removals) in React + React Router v5 monorepos that use function-based code splitting.

## The problem

React Router v5 code-splitting often looks like this:

```ts
// BrokenLoader.ts
export function loadApp() {
  return import('./AppBootstrap');
}
```

In **Knip v5** (TypeScript compiler backend), this worked fine — the TS compiler followed all reachable files automatically, so `AppBootstrap` and everything it imports were included in the analysis.

In **Knip v6** (oxc-parser/oxc-resolver backend), this `return import()` pattern is handled by the catch-all `handleImportExpression` visitor, which registers the import with `IMPORT_FLAGS.OPAQUE`. That means:

> Knip sees the import exists, but does **not** traverse into `AppBootstrap` or any of its transitive imports.

### What breaks

After running `npm run knip` you will see false positives like:

- `AppBootstrap.tsx` — reported as an unused file or its exports flagged as unused
- `src/routes/HomeRoute.tsx` — `HomeRoute` export flagged as unused
- `src/routes/AboutRoute.tsx` — `AboutRoute` export flagged as unused

These are **false positives**. The files are reachable at runtime, but Knip v6 can't see that through the `return import()` pattern.

## The working pattern

```ts
// WorkingLoader.ts
export const loadAppWorking = () => import('./AppBootstrapWorking');
```

An arrow function with a direct `import()` expression is handled by Knip v6's `handleVariableDeclarator`, which **does** traverse into `AppBootstrapWorking`. No false positives.

## Repo structure

```
src/
  index.tsx                  # Entry point
  BrokenLoader.ts            # ❌ return import() — Knip v6 treats as opaque
  WorkingLoader.ts           # ✅ () => import() — Knip v6 traverses correctly
  AppBootstrap.tsx           # Loaded by BrokenLoader — falsely flagged
  AppBootstrapWorking.tsx    # Loaded by WorkingLoader — correctly tracked
  routes/
    HomeRoute.tsx            # Falsely flagged as unused via BrokenLoader
    AboutRoute.tsx           # Falsely flagged as unused via BrokenLoader
```

## Reproduce

```bash
npm install
npm run knip
```

## Workarounds

**Option 1 — Change to arrow function syntax:**
```ts
// Before
export function loadApp() {
  return import('./AppBootstrap');
}

// After
export const loadApp = () => import('./AppBootstrap');
```

**Option 2 — Add the file as an explicit entry in `knip.json`:**
```json
{
  "entry": ["src/index.tsx", "src/AppBootstrap.tsx"]
}
```

**Option 3 — Ignore with a JSDoc tag** on the exports in `AppBootstrap.tsx`:
```ts
/** @public */
export default function AppBootstrap() { ... }
```

## Related

- [Knip v6 release notes](https://knip.dev/blog/knip-v6)
- [Knip source: `handleImportExpression`](https://github.com/webpro-nl/knip/blob/main/packages/knip/src/typescript/visitors/imports.ts)
- [Knip fixtures: imports-opaque](https://github.com/webpro-nl/knip/tree/main/packages/knip/fixtures/imports-opaque)
