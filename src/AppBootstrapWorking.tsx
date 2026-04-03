import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomeRoute } from './routes/HomeRoute';
import { AboutRoute } from './routes/AboutRoute';

// This file is dynamically imported via the arrow function pattern in WorkingLoader.ts:
//   export const loadAppWorking = () => import('./AppBootstrapWorking');
//
// Because Knip v6 handles that pattern correctly (via handleVariableDeclarator),
// it DOES traverse into this file. HomeRoute and AboutRoute are seen as used,
// and no false positives are reported.

export default function AppBootstrapWorking() {
  return (
    <Switch>
      <Route exact path="/" component={HomeRoute} />
      <Route path="/about" component={AboutRoute} />
    </Switch>
  );
}