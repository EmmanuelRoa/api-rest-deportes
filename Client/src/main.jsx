import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './router';
import { ThemeProvider } from './utils/ThemeContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <AppRouter />
  </ThemeProvider>
);