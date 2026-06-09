import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function HelloWorld() {
  return <h1>Grandrupt</h1>;
}

describe("HelloWorld", () => {
  it("renders the heading", () => {
    render(<HelloWorld />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Grandrupt");
  });
});
