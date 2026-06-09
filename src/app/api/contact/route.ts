import { type NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { resend } from "@/lib/resend";
import { env } from "@/lib/env";

/** Escape user-supplied text before interpolating it into the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Données invalides.", details: result.error.flatten() },
      { status: 422 },
    );
  }

  const { name, email, subject, message } = result.data;

  const to = env.CONTACT_EMAIL_TO;
  const from = env.CONTACT_EMAIL_FROM;

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `Nom : ${name}\nE-mail : ${email}\n\nMessage :\n${message}`,
      html: `
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>E-mail :</strong> <a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></p>
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });
  } catch (error) {
    console.error("[contact route] Resend error:", error);
    return NextResponse.json({ error: "Échec de l'envoi de l'e-mail." }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
