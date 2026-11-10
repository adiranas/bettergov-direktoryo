import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SubmitDropdown } from "./SubmitDropdown";
import { SUBMIT_CSO_URL, SUBMIT_PROJECT_URL } from "@/lib/site";

describe("SubmitDropdown", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders closed by default", () => {
    render(<SubmitDropdown />);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDefined();
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("toggles the dropdown menu on click", () => {
    render(<SubmitDropdown />);
    const button = screen.getByRole("button", { name: /submit/i });

    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");

    const projectLink = screen.getByRole("menuitem", {
      name: /civic tech project/i,
    });
    const csoLink = screen.getByRole("menuitem", {
      name: /civil society organization/i,
    });

    expect(projectLink.getAttribute("href")).toBe(SUBMIT_PROJECT_URL);
    expect(csoLink.getAttribute("href")).toBe(SUBMIT_CSO_URL);

    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes when pressing Escape", () => {
    render(<SubmitDropdown />);
    const button = screen.getByRole("button", { name: /submit/i });

    fireEvent.click(button);
    expect(screen.getByRole("menu")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes when clicking outside", () => {
    render(
      <div>
        <span data-testid="outside">Outside</span>
        <SubmitDropdown />
      </div>,
    );
    const button = screen.getByRole("button", { name: /submit/i });

    fireEvent.click(button);
    expect(screen.getByRole("menu")).toBeDefined();

    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
