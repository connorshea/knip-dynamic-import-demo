import { createRoot } from 'react-dom/client';

const BaseComp = import('./AppBootstrap.tsx');

const root = createRoot(document.getElementById('root'));

root.render(
  <BaseComp />
);
