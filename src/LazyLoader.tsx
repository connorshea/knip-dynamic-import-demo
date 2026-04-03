import React from 'react';

// React.lazy with a direct arrow function import — the pattern recommended
// for React code splitting.
//
// Knip v6 may or may not follow through React.lazy into AppBootstrapLazy.
// If it does NOT, ContactRoute (and AppBootstrapLazy itself) will appear unused.
//
// Compare with WorkingLoader.ts, which uses the same arrow function pattern
// WITHOUT React.lazy wrapping and is correctly traversed by Knip v6.

export const LazyApp = React.lazy(() => return import('./AppBootstrapLazy'));
