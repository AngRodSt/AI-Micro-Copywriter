import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CTAEditor, { scoreCopy } from "../components/CTAEditor";

describe("CTAEditor Component", () => {
  beforeEach(() => {
    // Mock the global.fetch function to simulate API responses
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            variations: ["Improved headline!"],
            isMock: false,
            provider: "test",
            message: "ok",
          }),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the textarea input and the generate button, which is disabled when the input is empty", () => {
    render(<CTAEditor />);
    const textarea = screen.getByPlaceholderText(
      /Enter your product headline/i
    );
    const buttons = screen.getAllByRole("button");
    const generateButton = buttons.find((button) =>
      button.textContent?.includes("Generate Content")
    );
    expect(textarea).toBeInTheDocument();
    expect(generateButton).toBeDisabled();
    fireEvent.change(textarea, { target: { value: "My product" } });
    expect(generateButton).toBeEnabled();
  });

  it("calls the API to generate variations and displays them in the UI", async () => {
    render(<CTAEditor />);
    const textarea = screen.getByPlaceholderText(
      /Enter your product headline/i
    );
    fireEvent.change(textarea, { target: { value: "My product" } });
    const buttons = screen.getAllByRole("button");
    const generateButton = buttons.find((button) =>
      button.textContent?.includes("Generate Content")
    );
    fireEvent.click(generateButton!);

    await waitFor(() => {
      expect(screen.getByText("Generated Variations")).toBeInTheDocument();
      expect(screen.getByText("Improved headline!")).toBeInTheDocument();
    });
  });

  it("handles API errors and shows error message", async () => {
    // Mock fetch to return an error response
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Internal Server Error" }),
      })
    );

    // Mock window.alert
    window.alert = jest.fn();

    render(<CTAEditor />);
    const textarea = screen.getByPlaceholderText(
      /Enter your product headline/i
    );
    fireEvent.change(textarea, { target: { value: "My product" } });
    const buttons = screen.getAllByRole("button");
    const generateButton = buttons.find((button) =>
      button.textContent?.includes("Generate Content")
    );
    fireEvent.click(generateButton!);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Error generating copy. Check server logs and your API key."
      );
    });
  });

  it("shows mock data alert when isMock is true", async () => {
    // Mock fetch to return mock data response
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            variations: ["Mock headline!"],
            isMock: true,
            message: "Using mock data",
          }),
      })
    );

    // Mock window.alert
    window.alert = jest.fn();

    render(<CTAEditor />);
    const textarea = screen.getByPlaceholderText(
      /Enter your product headline/i
    );
    fireEvent.change(textarea, { target: { value: "My product" } });
    const buttons = screen.getAllByRole("button");
    const generateButton = buttons.find((button) =>
      button.textContent?.includes("Generate Content")
    );
    fireEvent.click(generateButton!);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining("🤗 Using mock data")
      );
    });
  });

  it("handles copy to clipboard functionality", async () => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });

    render(<CTAEditor />);
    const textarea = screen.getByPlaceholderText(
      /Enter your product headline/i
    );
    fireEvent.change(textarea, { target: { value: "My product" } });
    const buttons = screen.getAllByRole("button");
    const generateButton = buttons.find((button) =>
      button.textContent?.includes("Generate Content")
    );
    fireEvent.click(generateButton!);

    await waitFor(() => {
      expect(screen.getByText("Generated Variations")).toBeInTheDocument();
    });

    // Find and click the copy button
    const copyButton = screen.getByText("Copy to Clipboard");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "Improved headline!"
    );
  });

  it("handles copy button text change with timer", async () => {
    // Use fake timers to control setTimeout
    jest.useFakeTimers();

    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });

    // Mock document.activeElement to return the button we're testing
    const mockActiveElement = {
      textContent: "Copy to Clipboard",
    };

    Object.defineProperty(document, "activeElement", {
      value: mockActiveElement,
      writable: true,
    });

    render(<CTAEditor />);
    const textarea = screen.getByPlaceholderText(
      /Enter your product headline/i
    );
    fireEvent.change(textarea, { target: { value: "My product" } });
    const buttons = screen.getAllByRole("button");
    const generateButton = buttons.find((button) =>
      button.textContent?.includes("Generate Content")
    );
    fireEvent.click(generateButton!);

    await waitFor(() => {
      expect(screen.getByText("Generated Variations")).toBeInTheDocument();
    });

    // Find and click the copy button
    const copyButton = screen.getByText("Copy to Clipboard");

    // Update the mock to point to our copy button
    Object.defineProperty(document, "activeElement", {
      value: copyButton,
      writable: true,
    });

    fireEvent.click(copyButton);

    // Check that button text changed to "Copied!"
    expect(copyButton.textContent).toBe("Copied!");

    // Fast-forward time to trigger the setTimeout callback
    jest.advanceTimersByTime(1000);

    // Check that button text reverted back
    expect(copyButton.textContent).toBe("Copy to Clipboard");

    // Restore real timers
    jest.useRealTimers();
  });

  it("changes length selection when buttons are clicked", () => {
    render(<CTAEditor />);

    const shortButton = screen.getByText("Short");
    const mediumButton = screen.getByText("Medium");
    const longButton = screen.getByText("Long");

    // Initially medium should be selected (default)
    expect(mediumButton).toHaveClass("bg-blue-600");

    // Click short button
    fireEvent.click(shortButton);
    expect(shortButton).toHaveClass("bg-blue-600");
    expect(mediumButton).toHaveClass("bg-white");

    // Click long button
    fireEvent.click(longButton);
    expect(longButton).toHaveClass("bg-blue-600");
    expect(shortButton).toHaveClass("bg-white");
  });

  it("changes tone selection when dropdown is changed", () => {
    render(<CTAEditor />);

    const toneSelect = screen.getByDisplayValue("Professional");

    fireEvent.change(toneSelect, { target: { value: "Friendly" } });
    expect(toneSelect).toHaveValue("Friendly");
  });
});

describe("scoreCopy", () => {
  it("scores short, long and promotional texts appropriately", () => {
    expect(scoreCopy("Short")).toBeGreaterThanOrEqual(0);
    expect(scoreCopy("This is a long text ".repeat(10))).toBeLessThanOrEqual(
      100
    );
    expect(scoreCopy("Buy now!")).toBeGreaterThan(scoreCopy("Neutral text"));
  });

  it("handles edge cases in scoring", () => {
    // Test all edge cases for complete branch coverage
    expect(scoreCopy("")).toBe(45); // Empty string (< 30 chars, -5 points)
    expect(scoreCopy("This is a very short text")).toBe(45); // < 30 chars
    expect(
      scoreCopy("This is a medium length text that should score normally")
    ).toBe(50); // Normal case
    expect(
      scoreCopy(
        "This is a very long text that exceeds the 90 character limit and should be penalized for being too long"
      )
    ).toBe(40); // > 90 chars
    expect(scoreCopy("Free shipping now!")).toBe(58); // Contains "free" OR "now" (+10), < 30 chars (-5), ends with "!" (+3) = 50-5+10+3=58
    expect(scoreCopy("Get it instant?")).toBe(58); // Contains "instant" (+10), < 30 chars (-5), ends with "?" (+3) = 50-5+10+3=58
    expect(scoreCopy("Buy now.")).toBe(58); // Contains "now" (+10), < 30 chars (-5), ends with "." (+3) = 50-5+10+3=58
  });
});
