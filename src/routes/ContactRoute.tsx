import React from 'react';

// Used by AppBootstrapLazy, which is loaded via React.lazy in LazyLoader.tsx.
// Whether this export is flagged as unused depends on whether Knip follows
// through the React.lazy(() => import()) call.

export function ContactRoute() {
  return (
    <div>
      <h1>Contact</h1>
      <p>This is the contact page.</p>
    </div>
  );
}
