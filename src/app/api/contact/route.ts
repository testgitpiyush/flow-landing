import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyContactInquiry } from "@/lib/notify";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = inquirySchema.parse(body);

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
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json({ error: firstError?.message || "Validation error" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
