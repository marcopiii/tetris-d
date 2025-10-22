import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '~/App';
import './style.css';

const root = document.getElementById('root')!;
createRoot(root).render(
  <App aspectRatio={root.clientWidth / root.clientHeight} />,
);
