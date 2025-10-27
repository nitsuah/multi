import React from 'react';
import { render } from '@testing-library/react';
import Solo from '../pages/Solo';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('Solo Page', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Solo />
      </BrowserRouter>
    );
    // Check for the presence of the canvas element
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });
});
