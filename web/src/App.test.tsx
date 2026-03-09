import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Spellvetica title', () => {
  render(<App />);
  expect(screen.getByText('Spellvetica')).toBeInTheDocument();
});
