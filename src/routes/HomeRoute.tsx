import React from 'react';

// This export will be flagged as unused by Knip v6 when imported only via
// AppBootstrap (loaded with the `return import()` pattern in BrokenLoader.ts).
// It will NOT be flagged when imported via AppBootstrapWorking (WorkingLoader.ts).

export function HomeRoute() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page.</p>
    </div>
  );
}
