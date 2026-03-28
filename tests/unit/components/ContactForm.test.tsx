import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "@/components/sections/ContactForm";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    className: _className,
    variant: _variant,
    size: _size,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    variant?: string;
    size?: string;
    [key: string]: unknown;
  }) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({ className: _className, ...props }: { className?: string; [key: string]: unknown }) => (
    <input {...props} />
  ),
}));

const fillValidForm = () => {
  fireEvent.change(screen.getByPlaceholderText("namePlaceholder"), {
    target: { value: "Jean Dupont" },
  });
  fireEvent.change(screen.getByPlaceholderText("emailPlaceholder"), {
    target: { value: "jean@exemple.fr" },
  });
  fireEvent.change(screen.getByPlaceholderText("subjectPlaceholder"), {
    target: { value: "Mon sujet de test" },
  });
  fireEvent.change(screen.getByPlaceholderText("messagePlaceholder"), {
    target: { value: "Ceci est un message de test suffisamment long." },
  });
};

describe("ContactForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all four form fields", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText("namePlaceholder")).toBeDefined();
    expect(screen.getByPlaceholderText("emailPlaceholder")).toBeDefined();
    expect(screen.getByPlaceholderText("subjectPlaceholder")).toBeDefined();
    expect(screen.getByPlaceholderText("messagePlaceholder")).toBeDefined();
  });

  it("renders the submit button", () => {
    render(<ContactForm />);
    expect(screen.getByRole("button", { name: "submit" })).toBeDefined();
  });

  it("shows a name validation error when submitting with empty name", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "submit" }));
    await waitFor(() => {
      expect(screen.getByText("Le nom doit comporter au moins 2 caractères.")).toBeDefined();
    });
  });

  it("shows an email validation error when submitting with invalid email", async () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("namePlaceholder"), {
      target: { value: "Jean Dupont" },
    });
    fireEvent.change(screen.getByPlaceholderText("emailPlaceholder"), {
      target: { value: "pas-un-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "submit" }));
    await waitFor(() => {
      expect(screen.getByText("Veuillez saisir une adresse e-mail valide.")).toBeDefined();
    });
  });

  it("shows success state after a successful API response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) }),
    );

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
      expect(screen.getByText("successTitle")).toBeDefined();
      expect(screen.getByText("successMessage")).toBeDefined();
    });
  });

  it("shows error state when the API returns an error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      // Error alert is rendered as: <strong>errorTitle : </strong>errorMessage
      const alert = screen.getByRole("alert");
      expect(alert.textContent).toContain("errorTitle");
      expect(alert.textContent).toContain("errorMessage");
    });
  });

  it("shows error state when fetch throws (network failure)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert.textContent).toContain("errorTitle");
    });
  });

  it("sends the form data to /api/contact as JSON", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => expect(screen.getByText("successTitle")).toBeDefined());

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Jean Dupont",
          email: "jean@exemple.fr",
          subject: "Mon sujet de test",
          message: "Ceci est un message de test suffisamment long.",
        }),
      }),
    );
  });
});
