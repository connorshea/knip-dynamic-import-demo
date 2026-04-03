// ❌ BROKEN in Knip v6: `return import()` is treated as OPAQUE.
// Knip v6 does NOT traverse into AppBootstrap from this pattern.
// Everything exported from AppBootstrap will appear "unused" to Knip.
//
// This is a common React Router v5 code-splitting pattern:
//   <Route component={loadApp} />
//
// Knip v5 worked because the TypeScript compiler API followed all
// reachable files automatically. Knip v6 uses its own oxc-based AST
// walker, which requires an explicit assignment to follow a dynamic import.

export function loadApp() {
  return import('./AppBootstrap');
}
