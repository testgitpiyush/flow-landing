import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // In production, send email notification here
    // Example: await sendEmail({ to: "support@flow.app", subject: "New Inquiry", body: message })

    return NextResponse.json(
      {
        message: "Thank you for your inquiry. We'll get back to you soon.",
        inquiryId: inquiry.id,
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
