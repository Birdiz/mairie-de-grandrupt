import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { FadeIn } from "@/components/ui/FadeIn";

let capturedCallback: IntersectionObserverCallback | null = null;
const observeMock = vi.fn();
const disconnectMock = vi.fn();

class MockIntersectionObserver {
  observe = observeMock;
  disconnect = disconnectMock;

  constructor(callback: IntersectionObserverCallback) {
    capturedCallback = callback;
  }
}

beforeEach(() => {
  capturedCallback = null;
  observeMock.mockClear();
  disconnectMock.mockClear();
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

describe("FadeIn", () => {
  it("renders children", () => {
    const { getByText } = render(
      <FadeIn>
        <p>Contenu</p>
      </FadeIn>,
    );
    expect(getByText("Contenu")).toBeDefined();
  });

  it("is initially invisible (opacity-0 translate-y-4)", () => {
    const { container } = render(<FadeIn>Contenu</FadeIn>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("opacity-0");
    expect(el.className).toContain("translate-y-4");
  });

  it("becomes visible when IntersectionObserver fires", () => {
    const { container } = render(<FadeIn>Contenu</FadeIn>);
    const el = container.firstChild as HTMLElement;

    expect(capturedCallback).not.toBeNull();

    act(() => {
      capturedCallback!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(el.className).toContain("opacity-100");
    expect(el.className).toContain("translate-y-0");
    expect(el.className).not.toContain("opacity-0");
  });

  it("does not become visible if not intersecting", () => {
    const { container } = render(<FadeIn>Contenu</FadeIn>);
    const el = container.firstChild as HTMLElement;

    act(() => {
      capturedCallback!(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(el.className).toContain("opacity-0");
  });

  it("applies a delay class when provided", () => {
    const { container } = render(<FadeIn delay="delay-300">Contenu</FadeIn>);
    expect((container.firstChild as HTMLElement).className).toContain("delay-300");
  });

  it("applies a custom className", () => {
    const { container } = render(<FadeIn className="ma-classe">Contenu</FadeIn>);
    expect((container.firstChild as HTMLElement).className).toContain("ma-classe");
  });

  it("disconnects the observer after becoming visible", () => {
    render(<FadeIn>Contenu</FadeIn>);

    act(() => {
      capturedCallback!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(disconnectMock).toHaveBeenCalled();
  });
});
