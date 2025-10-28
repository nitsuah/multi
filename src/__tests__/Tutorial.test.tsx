import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Tutorial from "../components/Tutorial";
import React from "react";

describe("Tutorial Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  describe("Visibility", () => {
    it("should show tutorial for first-time users", () => {
      render(<Tutorial />);
      expect(screen.getByText("Welcome to DARKMOON")).toBeDefined();
    });

    it("should not show tutorial if already completed", () => {
      window.localStorage.setItem("darkmoon-tutorial-complete", "true");
      render(<Tutorial />);
      expect(screen.queryByText("Welcome to DARKMOON")).toBeNull();
    });
  });

  describe("Navigation", () => {
    it("should show step 1 of 5 initially", () => {
      render(<Tutorial />);
      expect(screen.getByText("Step 1 of 5")).toBeDefined();
    });

    it("should advance to next step on Next button click", () => {
      render(<Tutorial />);
      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);
      expect(screen.getByText("Step 2 of 5")).toBeDefined();
      expect(screen.getByText("Movement Controls")).toBeDefined();
    });

    it("should show all 5 steps in sequence", () => {
      render(<Tutorial />);
      const steps = [
        "Welcome to DARKMOON",
        "Movement Controls",
        "Camera Control",
        "Theme Toggle",
        "Need Help?",
      ];

      steps.forEach((stepTitle, index) => {
        expect(screen.getByText(stepTitle)).toBeDefined();
        if (index < steps.length - 1) {
          fireEvent.click(screen.getByText("Next"));
        }
      });
    });

    it('should show "Get Started" on final step', () => {
      render(<Tutorial />);
      // Click through to last step
      for (let i = 0; i < 4; i++) {
        fireEvent.click(screen.getByText("Next"));
      }
      expect(screen.getByText("Get Started")).toBeDefined();
    });
  });

  describe("Completion", () => {
    it("should hide tutorial and save to localStorage on complete", () => {
      render(<Tutorial />);
      // Navigate to last step
      for (let i = 0; i < 4; i++) {
        fireEvent.click(screen.getByText("Next"));
      }
      fireEvent.click(screen.getByText("Get Started"));

      expect(window.localStorage.getItem("darkmoon-tutorial-complete")).toBe(
        "true"
      );
      expect(screen.queryByText("Need Help?")).toBeNull();
    });

    it("should hide tutorial and save to localStorage on skip", () => {
      render(<Tutorial />);
      fireEvent.click(screen.getByText("Skip Tutorial"));

      expect(window.localStorage.getItem("darkmoon-tutorial-complete")).toBe(
        "true"
      );
      expect(screen.queryByText("Welcome to DARKMOON")).toBeNull();
    });

    it("should call onComplete callback when tutorial is completed", () => {
      const onComplete = vi.fn();
      render(<Tutorial onComplete={onComplete} />);

      fireEvent.click(screen.getByText("Skip Tutorial"));
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("should call onComplete callback when skipped", () => {
      const onComplete = vi.fn();
      render(<Tutorial onComplete={onComplete} />);

      // Navigate to last step
      for (let i = 0; i < 4; i++) {
        fireEvent.click(screen.getByText("Next"));
      }
      fireEvent.click(screen.getByText("Get Started"));

      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("Content", () => {
    it("should show correct content for each step", () => {
      render(<Tutorial />);

      const contents = [
        "A multiplayer 3D experience",
        "Use W/A/S/D keys to move around",
        "The camera follows you automatically",
        "Click the sun/moon icon",
        "Press H at any time",
      ];

      contents.forEach((content, index) => {
        expect(screen.getByText(new RegExp(content))).toBeDefined();
        if (index < contents.length - 1) {
          fireEvent.click(screen.getByText("Next"));
        }
      });
    });
  });
});
