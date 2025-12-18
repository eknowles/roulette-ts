import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouletteApp } from './ui/components/RouletteApp';
import { GlobalProvider } from '../.triplex/provider';
import debug from 'debug';

if (import.meta.env.DEV) {
  // Enable all roulette logs by default in development
  // You can also change this to specific namespaces like 'roulette:highlights'
  debug.enable('roulette:*');
}

const container = document.getElementById('world');

if (!container) {
  throw new Error('Could not find root element with id "world"');
}

const root = createRoot(container);
root.render(
  <GlobalProvider backgroundColor="#05050a"><RouletteApp /></GlobalProvider>
);
