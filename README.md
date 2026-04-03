# knip-dynamic-import-demo

Demonstrates how **Knip v6** treats various dynamic import patterns differently from **Knip v5**, causing false positives (and potential false removals) in React monorepos that use code splitting.

## Pattern 1 — `return import()` inside a regular function

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

After running `npm run knip` you may see false positives like:

- `AppBootstrap.tsx` — reported as an unused file or its exports flagged as unused
- `src/routes/HomeRoute.tsx` — `HomeRoute` export flagged as unused
- `src/routes/AboutRoute.tsx` — `AboutRoute` export flagged as unused

These are **false positives**. The files are reachable at runtime, but Knip v6 can't see through the `return import()` pattern.

## Pattern 2 — Direct arrow function `() => import()`

```ts
// WorkingLoader.ts
export const loadAppWorking = () => import('./AppBootstrapWorking');
```

An arrow function with a direct `import()` expression is handled by Knip v6's `handleVariableDeclarator`, which **does** traverse into `AppBootstrapWorking`. No false positives.

## Pattern 3 — `React.lazy(() => import())`

```tsx
// LazyLoader.tsx
export const LazyApp = React.lazy(() => import('./AppBootstrapLazy'));
```

This is the standard React code-splitting pattern. Even though the arrow function body is syntactically the same as Pattern 2, wrapping it in `React.lazy()` may prevent Knip v6 from traversing into `AppBootstrapLazy`, because Knip does not know that `React.lazy` accepts a module-returning thunk.

> Run `npm run knip` to observe whether `AppBootstrapLazy.tsx` and `src/routes/ContactRoute.tsx` are falsely flagged.
>
> **Note:** As of Knip **6.3.0** (the version pinned in this repo), no false positives are produced by any of the three patterns above. The issue may have been present only in Knip 6.0.x and was subsequently fixed. If you are on an earlier 6.x release and observe false positives, please open an issue with your exact Knip version.

## Repo structure

```
src/
  index.tsx                  # Entry point
  BrokenLoader.ts            # ❌ return import() — Knip v6 treats as opaque
  WorkingLoader.ts           # ✅ () => import() — Knip v6 traverses correctly
  LazyLoader.tsx             # ❓ React.lazy(() => import()) — behaviour under investigation
  AppBootstrap.tsx           # Loaded by BrokenLoader — may be falsely flagged
  AppBootstrapWorking.tsx    # Loaded by WorkingLoader — correctly tracked
  AppBootstrapLazy.tsx       # Loaded via React.lazy — may be falsely flagged
  routes/
    HomeRoute.tsx            # May be falsely flagged via BrokenLoader
    AboutRoute.tsx           # May be falsely flagged via BrokenLoader
    ContactRoute.tsx         # May be falsely flagged via LazyLoader
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
