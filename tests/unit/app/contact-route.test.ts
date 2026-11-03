// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const send = vi.hoisted(() => vi.fn());

vi.mock("@/lib/resend", () => ({ resend: { emails: { send } } }));
vi.mock("@/lib/env", () => ({
  env: {
    RESEND_API_KEY: "test-key",
    CONTACT_EMAIL_TO: "mairie@example.com",
    CONTACT_EMAIL_FROM: "noreply@example.com",
  },
}));

import { POST } from "@/app/api/contact/route";

const validBody = {
  name: "Jeanne Martin",
  email: "jeanne@example.com",
  subject: "Demande d'information",
  message: "Bonjour, quels sont les horaires de la mairie ?",
};

function postContact(body: unknown = validBody) {
  return POST(
    new NextRequest("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
}

/**
 * Guards against silently lost messages: the Resend SDK does not throw when the
 * API refuses a message, it resolves with { data: null, error } and logs nothing
 * in production. The route must report that as a failure, or the visitor reads
 * "message sent" while the town hall receives nothing.
 */
describe("POST /api/contact", () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    send.mockReset();
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("succeeds when Resend accepts the message", async () => {
    send.mockResolvedValue({ data: { id: "email-id" }, error: null });

    const response = await postContact();

    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "noreply@example.com",
        to: "mairie@example.com",
        replyTo: "jeanne@example.com",
      }),
    );
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("fails and logs the reason when Resend refuses the message", async () => {
    const error = {
      name: "validation_error",
      statusCode: 403,
      message: "The example.com domain is not verified.",
    };
    send.mockResolvedValue({ data: null, error });

    const response = await postContact();

    expect(response.status).toBe(500);
    expect(consoleError).toHaveBeenCalledWith("[contact route] Resend error:", error);
  });

  it("fails and logs the reason when the Resend call throws", async () => {
    const error = new Error("Network error");
    send.mockRejectedValue(error);

    const response = await postContact();

    expect(response.status).toBe(500);
    expect(consoleError).toHaveBeenCalledWith("[contact route] Resend error:", error);
  });

  it("rejects invalid data without calling Resend", async () => {
    const response = await postContact({ ...validBody, email: "pas-un-email" });

    expect(response.status).toBe(422);
    expect(send).not.toHaveBeenCalled();
  });
});
