import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

const BaseComp = React.lazy(() => {
  return import('./AppBootstrap');
});

const root = createRoot(document.getElementById('root'));

root.render(
  <Suspense fallback={<div>Loading…</div>}>
    <React.StrictMode>
      <BaseComp />
    </React.StrictMode>
  </Suspense>
);
