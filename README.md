# knip-dynamic-import-demo

Small reproduction for a Knip v6 false-positive scenario with a JS entry file that contains JSX.

The current entry point is [src/index.js](src/index.js). It renders a lazy component using:

```jsx
React.lazy(() => {
  return import('./AppBootstrap');
})
```

That imported file then references route components in [src/AppBootstrap.tsx](src/AppBootstrap.tsx), [src/routes/HomeRoute.tsx](src/routes/HomeRoute.tsx), and [src/routes/AboutRoute.tsx](src/routes/AboutRoute.tsx).

Expected behavior: those files are reachable, so they should not be reported as unused.

Observed behavior:

- Knip 6 (npx knip --files) reports unused files in this graph.
- Knip 5 (npx knip@5 --files) reports no unused files.

Reported Knip 6 output from this reproduction:

```
  Unused files (3)
  src/AppBootstrap.tsx
  src/routes/AboutRoute.tsx
  src/routes/HomeRoute.tsx
```

Note: running Knip 6 in this workspace currently reports the two route files, while the full three-file result above has also been observed. The core issue is the same: Knip 6 can fail to follow this dynamic import chain, while Knip 5 does not.

## Reproduce

1. `npm install`
2. `npx knip --files`, see unused files reported
3. `npx knip@5 --files`, see no unused files reported

## Why this likely happens

This appears to be parser/resolver behavior in Knip 6 around JS-as-JSX. Knip 5 used a different analysis backend and resolves this case correctly.

## Current project structure

  src/
    index.js
    AppBootstrap.tsx
    routes/
      HomeRoute.tsx
      AboutRoute.tsx
