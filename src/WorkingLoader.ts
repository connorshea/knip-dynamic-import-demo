// ✅ WORKS in Knip v6: arrow function with direct `import()` expression.
// Knip v6's handleVariableDeclarator sees this pattern and traverses
// into AppBootstrapWorking, so its exports are correctly tracked.
//
// This is the recommended workaround when migrating from Knip v5 to v6.

export const loadAppWorking = () => import('./AppBootstrapWorking');
