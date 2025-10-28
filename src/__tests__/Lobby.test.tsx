import React from 'react';
import { render } from '@testing-library/react';
import Lobby from '../pages/Lobby';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('Lobby Page', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Lobby />
      </BrowserRouter>
    );
    // Check for a known element or text
    // Since Lobby renders a Canvas, check for the presence of the canvas element
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });
});
