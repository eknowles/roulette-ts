import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouletteApp } from './ui/components/RouletteApp';

const container = document.getElementById('world');

if (!container) {
  throw new Error('Could not find root element with id \"world\"');
}

const root = createRoot(container);
root.render(<RouletteApp />);
