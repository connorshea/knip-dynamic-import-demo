import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomeRoute } from './routes/HomeRoute';
import { AboutRoute } from './routes/AboutRoute';

// This file is dynamically imported via `return import('./AppBootstrap')` in BrokenLoader.ts.
//
// Because Knip v6 treats that pattern as OPAQUE, it does NOT traverse into this file.
// As a result:
//   - HomeRoute and AboutRoute below will be reported as "unused imports"
//   - src/routes/HomeRoute.tsx and src/routes/AboutRoute.tsx may be reported as unused files
//   - Any exports from those route files will be reported as unused exports
//
// Run `npm run knip` to see the false positives.

export default function AppBootstrap() {
  return (
    <Switch>
      <Route exact path="/" component={HomeRoute} />
      <Route path="/about" component={AboutRoute} />
    </Switch>
  );
}