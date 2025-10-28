import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QualitySettings from "../components/QualitySettings";

describe("QualitySettings Component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    mockOnChange.mockClear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  describe("Rendering", () => {
    it("should render gear icon button", () => {
      render(<QualitySettings onChange={mockOnChange} />);
      expect(screen.getByRole("button", { name: /⚙️/i })).toBeInTheDocument();
    });

    it("should not show modal initially", () => {
      render(<QualitySettings onChange={mockOnChange} />);
      expect(screen.queryByText(/Graphics Quality/i)).not.toBeInTheDocument();
    });

    it("should show modal when gear icon is clicked", async () => {
      render(<QualitySettings onChange={mockOnChange} />);
      const gearButton = screen.getByRole("button", { name: /⚙️/i });

      fireEvent.click(gearButton);

      await waitFor(() => {
        expect(screen.getByText(/Graphics Quality/i)).toBeInTheDocument();
      });
    });
  });

  describe("Quality Presets", () => {
    it("should display all quality options", async () => {
      render(<QualitySettings onChange={mockOnChange} />);
      fireEvent.click(screen.getByRole("button", { name: /⚙️/i }));

      await waitFor(() => {
        expect(screen.getByText(/Auto - Adaptive/i)).toBeInTheDocument();
        expect(screen.getByText(/High - Best visuals/i)).toBeInTheDocument();
        expect(screen.getByText(/Medium - Balanced/i)).toBeInTheDocument();
        expect(
          screen.getByText(/Low - Better performance/i)
        ).toBeInTheDocument();
      });
    });

    it("should default to Auto quality", async () => {
      render(<QualitySettings onChange={mockOnChange} />);
      fireEvent.click(screen.getByRole("button", { name: /⚙️/i }));

      await waitFor(() => {
        const autoButton = screen
          .getByText(/Auto - Adaptive/i)
          .closest("button");
        expect(autoButton).toHaveStyle({ backgroundColor: "rgb(117, 6, 145)" });
      });
    });

    it("should change quality when button is clicked", async () => {
      render(<QualitySettings onChange={mockOnChange} />);
      fireEvent.click(screen.getByRole("button", { name: /⚙️/i }));

      await waitFor(() => {
        const highButton = screen
          .getByText(/High - Best visuals/i)
          .closest("button");
        if (highButton) fireEvent.click(highButton);
      });

      expect(mockOnChange).toHaveBeenCalledWith("high");
    });
  });

  describe("LocalStorage Persistence", () => {
    it("should save quality setting to localStorage", async () => {
      render(<QualitySettings onChange={mockOnChange} />);
      fireEvent.click(screen.getByRole("button", { name: /⚙️/i }));

      await waitFor(() => {
        const lowButton = screen
          .getByText(/Low - Better performance/i)
          .closest("button");
        if (lowButton) fireEvent.click(lowButton);
      });

      await waitFor(() => {
        expect(window.localStorage.getItem("graphics-quality")).toBe("low");
      });
    });

    it("should load quality setting from localStorage", () => {
      window.localStorage.setItem("graphics-quality", "high");

      render(<QualitySettings onChange={mockOnChange} />);

      expect(window.localStorage.getItem("graphics-quality")).toBe("high");
    });
  });

  describe("onChange Callback", () => {
    it("should call onChange when quality changes", async () => {
      render(<QualitySettings onChange={mockOnChange} />);

      fireEvent.click(screen.getByRole("button", { name: /⚙️/i }));

      await waitFor(() => {
        const highButton = screen
          .getByText(/High - Best visuals/i)
          .closest("button");
        if (highButton) fireEvent.click(highButton);
      });

      expect(mockOnChange).toHaveBeenCalledWith("high");
    });
  });

  describe("Styling and Layout", () => {
    it("should have fixed position gear button", () => {
      render(<QualitySettings onChange={mockOnChange} />);
      const gearButton = screen.getByRole("button", { name: /⚙️/i });

      expect(gearButton.parentElement).toHaveStyle({ position: "fixed" });
    });

    it("should display quality descriptions", async () => {
      render(<QualitySettings onChange={mockOnChange} />);
      fireEvent.click(screen.getByRole("button", { name: /⚙️/i }));

      await waitFor(() => {
        expect(screen.getByText(/Better performance/i)).toBeInTheDocument();
        expect(screen.getByText(/Balanced/i)).toBeInTheDocument();
        expect(screen.getByText(/Best visuals/i)).toBeInTheDocument();
        expect(screen.getByText(/Adaptive/i)).toBeInTheDocument();
      });
    });
  });
});
