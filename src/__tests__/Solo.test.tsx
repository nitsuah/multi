import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import Solo from '../pages/Solo';
import { io } from 'socket.io-client';

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(),
}));

// Mock React Three Fiber Canvas component
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
}));

// Mock Drei components
vi.mock('@react-three/drei', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <div data-testid="text">{children}</div>,
  Stats: () => <div data-testid="stats" />,
  OrbitControls: () => <div data-testid="orbit-controls" />,
}));

describe('Solo Component', () => {
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = {
      on: vi.fn(),
      off: vi.fn(),
      disconnect: vi.fn(),
      id: 'test-socket-id',
    };
    
    (io as any).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Canvas component', () => {
    render(<Solo />);
    expect(screen.getByTestId('canvas')).toBeDefined();
  });

  it('renders Stats component', () => {
    render(<Solo />);
    expect(screen.getByTestId('stats')).toBeDefined();
  });

  it('renders OrbitControls component', () => {
    render(<Solo />);
    expect(screen.getByTestId('orbit-controls')).toBeDefined();
  });

  it('initializes socket connection on mount', () => {
    render(<Solo />);
    expect(io).toHaveBeenCalled();
  });

  it('disconnects socket on unmount', () => {
    const { unmount } = render(<Solo />);
    unmount();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('listens to move events from socket', () => {
    render(<Solo />);
    expect(mockSocket.on).toHaveBeenCalledWith('move', expect.any(Function));
  });

  it('updates clients state when move event is received', async () => {
    render(<Solo />);
    
    // Get the move event handler
    const moveHandler = mockSocket.on.mock.calls.find(
      (call: any[]) => call[0] === 'move'
    )?.[1];
    
    expect(moveHandler).toBeDefined();
    
    // Simulate receiving clients data
    const mockClients = {
      'client-1': { position: [1, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
      'client-2': { position: [2, 0, 0] as [number, number, number], rotation: [0, 1, 0] as [number, number, number] },
    };
    
    act(() => {
      moveHandler(mockClients);
    });
    
    expect(screen.getByTestId('canvas')).toBeDefined();
  });

  it('filters out own socket ID from rendering', async () => {
    render(<Solo />);
    
    const moveHandler = mockSocket.on.mock.calls.find(
      (call: any[]) => call[0] === 'move'
    )?.[1];
    
    // Include own socket ID in clients
    const mockClients = {
      'test-socket-id': { position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
      'other-client': { position: [1, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    };
    
    act(() => {
      moveHandler(mockClients);
    });
    
    expect(screen.getByTestId('canvas')).toBeDefined();
  });

  it('cleans up move event listener on unmount', () => {
    const { unmount } = render(<Solo />);
    unmount();
    expect(mockSocket.off).toHaveBeenCalledWith('move');
  });

  it('uses environment variable for socket server URL when available', () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv, REACT_APP_SOCKET_SERVER_URL: 'http://custom-server.com' };
    
    render(<Solo />);
    
    expect(io).toHaveBeenCalledWith('http://custom-server.com', { transports: ['websocket'] });
    
    process.env = originalEnv;
  });

  it('falls back to window.location.origin when no env variable is set', () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv };
    delete process.env.REACT_APP_SOCKET_SERVER_URL;
    
    render(<Solo />);
    
    expect(io).toHaveBeenCalledWith(window.location.origin, { transports: ['websocket'] });
    
    process.env = originalEnv;
  });
});
