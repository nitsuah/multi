import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  W,
  A,
  S,
  D,
  Q,
  E,
  SHIFT,
  SPACE,
  DIRECTIONS,
  KeyDisplay,
} from "../components/utils";

describe("Key constants", () => {
  it("exports correct key values", () => {
    expect(W).toBe("w");
    expect(A).toBe("a");
    expect(S).toBe("s");
    expect(D).toBe("d");
    expect(Q).toBe("q");
    expect(E).toBe("e");
    expect(SHIFT).toBe("shift");
    expect(SPACE).toBe(" ");
  });

  it("DIRECTIONS array contains all movement keys", () => {
    expect(DIRECTIONS).toEqual(["w", "a", "s", "d", "q", "e"]);
    expect(DIRECTIONS).toHaveLength(6);
  });
});

describe("KeyDisplay", () => {
  let keyDisplay: KeyDisplay;

  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1920,
    });

    keyDisplay = new KeyDisplay();
  });

  afterEach(() => {
    // Clean up appended elements
    keyDisplay.map.forEach((element) => {
      element.remove();
    });
  });

  it("creates map with all key elements", () => {
    expect(keyDisplay.map.size).toBe(8); // W,A,S,D,Q,E,SHIFT,SPACE
    expect(keyDisplay.map.has(W)).toBe(true);
    expect(keyDisplay.map.has(A)).toBe(true);
    expect(keyDisplay.map.has(S)).toBe(true);
    expect(keyDisplay.map.has(D)).toBe(true);
    expect(keyDisplay.map.has(Q)).toBe(true);
    expect(keyDisplay.map.has(E)).toBe(true);
    expect(keyDisplay.map.has(SHIFT)).toBe(true);
    expect(keyDisplay.map.has(SPACE)).toBe(true);
  });

  it("appends all key elements to document body", () => {
    const appendedElements = document.body.querySelectorAll("div");
    expect(appendedElements.length).toBeGreaterThanOrEqual(8);
  });

  it("sets correct styles on key elements", () => {
    const wElement = keyDisplay.map.get(W);
    expect(wElement?.style.color).toBe("rgba(128, 0, 128, 0.7)");
    expect(wElement?.style.fontSize).toBe("16px");
    expect(wElement?.style.fontWeight).toBe("900");
    expect(wElement?.style.position).toBe("absolute");
    expect(wElement?.textContent).toBe("W");
  });

  it("positions keys correctly", () => {
    const wElement = keyDisplay.map.get(W);
    const aElement = keyDisplay.map.get(A);

    const bottomY = window.innerHeight - 80; // 1000 - 80 = 920
    const centerX = window.innerWidth / 2;

    expect(wElement?.style.top).toBe(`${bottomY - 30}px`); // 890px
    expect(aElement?.style.top).toBe(`${bottomY}px`); // 920px
    expect(wElement?.style.left).toBe(`${centerX}px`);
    expect(aElement?.style.left).toBe(`${centerX - 25}px`);
  });

  it("changes color to red when key is pressed", () => {
    const wElement = keyDisplay.map.get(W);
    expect(wElement?.style.color).toBe("rgba(128, 0, 128, 0.7)");

    keyDisplay.down("w");
    expect(wElement?.style.color).toBe("rgba(255, 100, 100, 0.9)");
  });

  it("changes color back to purple when key is released", () => {
    const wElement = keyDisplay.map.get(W);
    keyDisplay.down("w");
    expect(wElement?.style.color).toBe("rgba(255, 100, 100, 0.9)");

    keyDisplay.up("w");
    expect(wElement?.style.color).toBe("rgba(128, 0, 128, 0.7)");
  });

  it("handles uppercase key input", () => {
    const shiftElement = keyDisplay.map.get(SHIFT);
    expect(shiftElement?.style.color).toBe("rgba(128, 0, 128, 0.7)");

    keyDisplay.down("SHIFT");
    expect(shiftElement?.style.color).toBe("rgba(255, 100, 100, 0.9)");

    keyDisplay.up("SHIFT");
    expect(shiftElement?.style.color).toBe("rgba(128, 0, 128, 0.7)");
  });

  it("ignores unknown keys", () => {
    expect(() => keyDisplay.down("x")).not.toThrow();
    expect(() => keyDisplay.up("y")).not.toThrow();
  });

  it("updates positions when updatePosition is called", () => {
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 800,
    });

    keyDisplay.updatePosition();

    const wElement = keyDisplay.map.get(W);
    const bottomY = 800 - 80; // 720
    expect(wElement?.style.top).toBe(`${bottomY - 30}px`); // 690px
  });
});
