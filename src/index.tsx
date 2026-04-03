import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { loadApp } from './BrokenLoader';
import { loadAppWorking } from './WorkingLoader';
import { LazyApp } from './LazyLoader';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// All loaders are referenced here so none of the loader files themselves are "unused".
// The question is whether Knip follows *into* the files they import.
console.log(loadApp, loadAppWorking);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div>Loading…</div>}>
        <LazyApp />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
