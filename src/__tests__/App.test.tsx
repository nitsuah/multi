import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../pages/App';
import '@testing-library/jest-dom';

describe('App Routing', () => {
  it('renders Home page by default', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByText(/PLAY🌑DARKMOON/i)).toBeInTheDocument();
  });

  it('renders Lobby page on /play', () => {
    window.history.pushState({}, '', '/play');
    render(<App />);
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders Solo page on /solo', () => {
    window.history.pushState({}, '', '/solo');
    render(<App />);
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('renders 404 page on unknown route', () => {
    window.history.pushState({}, '', '/not-a-real-route');
    render(<App />);
    expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
  });
});
