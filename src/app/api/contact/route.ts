import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyContactInquiry } from "@/lib/notify";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().toLowerCase().email("Invalid email address").max(255, "Email is too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

export async function POST(request: Request) {
  const limit = checkRateLimit(request, { limit: 10, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const result = inquirySchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json({ error: firstError?.message || "Validation error" }, { status: 400 });
    }

    const { name, email, message } = result.data;

    // Save inquiry to database
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        message,
      },
    });

    // Best-effort email notification. The inquiry is already persisted
    // above, so a failed/unconfigured email provider never loses data -
    // it's only logged.
    const notification = await notifyContactInquiry({ name, email, message });

    return NextResponse.json(
      {
        message: "Thank you for your inquiry. We'll get back to you soon.",
        inquiryId: inquiry.id,
        notified: notification.sent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit inquiry", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
