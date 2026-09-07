const RESEND_API_URL = "https://api.resend.com/emails";

interface ContactInquiry {
  name: string;
  email: string;
  message: string;
}

/**
 * Sends a contact-form notification email via the Resend API when
 * RESEND_API_KEY and CONTACT_NOTIFY_EMAIL are configured. Returns whether
 * a notification was actually sent, so callers can decide how to respond
 * (the inquiry itself should always be persisted to the DB regardless of
 * whether this succeeds).
 */
export async function notifyContactInquiry(
  inquiry: ContactInquiry
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Flow Contact Form <onboarding@resend.dev>";

  if (!apiKey || !notifyEmail) {
    console.warn(
      "Contact inquiry saved but no email notification was sent: RESEND_API_KEY and/or CONTACT_NOTIFY_EMAIL are not configured."
    );
    return { sent: false, reason: "not_configured" };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        reply_to: inquiry.email,
        subject: `New Flow contact inquiry from ${inquiry.name}`,
        text: `Name: ${inquiry.name}\nEmail: ${inquiry.email}\n\nMessage:\n${inquiry.message}`,
      }),
    });

    if (!response.ok) {
      console.error(
        "Failed to send contact notification email",
        response.status,
        await response.text().catch(() => "")
      );
      return { sent: false, reason: "provider_error" };
    }

    return { sent: true };
  } catch (error) {
    console.error("Failed to send contact notification email", error);
    return { sent: false, reason: "provider_error" };
  }
}
