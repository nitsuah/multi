import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { W, A, S, D, SHIFT, DIRECTIONS, KeyDisplay } from '../components/utils';

describe('Key constants', () => {
  it('exports correct key values', () => {
    expect(W).toBe('w');
    expect(A).toBe('a');
    expect(S).toBe('s');
    expect(D).toBe('d');
    expect(SHIFT).toBe('shift');
  });

  it('DIRECTIONS array contains all movement keys', () => {
    expect(DIRECTIONS).toEqual(['w', 'a', 's', 'd']);
    expect(DIRECTIONS).toHaveLength(4);
  });
});

describe('KeyDisplay', () => {
  let keyDisplay: KeyDisplay;

  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    
    keyDisplay = new KeyDisplay();
  });

  afterEach(() => {
    // Clean up appended elements
    keyDisplay.map.forEach((element) => {
      element.remove();
    });
  });

  it('creates map with all key elements', () => {
    expect(keyDisplay.map.size).toBe(5);
    expect(keyDisplay.map.has(W)).toBe(true);
    expect(keyDisplay.map.has(A)).toBe(true);
    expect(keyDisplay.map.has(S)).toBe(true);
    expect(keyDisplay.map.has(D)).toBe(true);
    expect(keyDisplay.map.has(SHIFT)).toBe(true);
  });

  it('appends all key elements to document body', () => {
    const appendedElements = document.body.querySelectorAll('div');
    expect(appendedElements.length).toBeGreaterThanOrEqual(5);
  });

  it('sets correct styles on key elements', () => {
    const wElement = keyDisplay.map.get(W);
    expect(wElement?.style.color).toBe('purple');
    expect(wElement?.style.fontSize).toBe('10px');
    expect(wElement?.style.fontWeight).toBe('800');
    expect(wElement?.style.position).toBe('absolute');
    expect(wElement?.textContent).toBe('w');
  });

  it('positions keys correctly', () => {
    const wElement = keyDisplay.map.get(W);
    const aElement = keyDisplay.map.get(A);
    
    expect(wElement?.style.top).toBe('850px'); // 1000 - 150
    expect(aElement?.style.top).toBe('900px'); // 1000 - 100
    expect(wElement?.style.left).toBe('300px');
    expect(aElement?.style.left).toBe('200px');
  });

  it('changes color to red when key is pressed', () => {
    const wElement = keyDisplay.map.get(W);
    expect(wElement?.style.color).toBe('purple');
    
    keyDisplay.down('w');
    expect(wElement?.style.color).toBe('red');
  });

  it('changes color back to purple when key is released', () => {
    const wElement = keyDisplay.map.get(W);
    keyDisplay.down('w');
    expect(wElement?.style.color).toBe('red');
    
    keyDisplay.up('w');
    expect(wElement?.style.color).toBe('purple');
  });

  it('handles uppercase key input', () => {
    const shiftElement = keyDisplay.map.get(SHIFT);
    expect(shiftElement?.style.color).toBe('purple');
    
    keyDisplay.down('SHIFT');
    expect(shiftElement?.style.color).toBe('red');
    
    keyDisplay.up('SHIFT');
    expect(shiftElement?.style.color).toBe('purple');
  });

  it('ignores unknown keys', () => {
    expect(() => keyDisplay.down('x')).not.toThrow();
    expect(() => keyDisplay.up('y')).not.toThrow();
  });

  it('updates positions when updatePosition is called', () => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
    
    keyDisplay.updatePosition();
    
    const wElement = keyDisplay.map.get(W);
    expect(wElement?.style.top).toBe('650px'); // 800 - 150
  });
});
