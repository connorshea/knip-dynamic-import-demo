import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { loadApp } from './BrokenLoader';
import { loadAppWorking } from './WorkingLoader';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Both loaders are referenced here, so neither file itself is "unused".
// The question is whether Knip follows *into* AppBootstrap and AppBootstrapWorking.
console.log(loadApp, loadAppWorking);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>See README for knip demo instructions</div>
    </BrowserRouter>
  </React.StrictMode>
);
