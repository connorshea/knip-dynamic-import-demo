import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ContactRoute } from './routes/ContactRoute';

// This file is dynamically imported via React.lazy in LazyLoader.tsx.
//
// If Knip v6 does not traverse into files loaded via React.lazy, then:
//   - ContactRoute below will be reported as an "unused import"
//   - src/routes/ContactRoute.tsx may be reported as an unused file
//   - The ContactRoute export will be reported as unused
//
// Run `npm run knip` to see whether this pattern produces false positives.

export default function AppBootstrapLazy() {
  return (
    <Switch>
      <Route path="/contact" component={ContactRoute} />
    </Switch>
  );
}
