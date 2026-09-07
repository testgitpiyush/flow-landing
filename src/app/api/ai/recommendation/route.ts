import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai";

// GET /api/ai/recommendation - returns a real, model-generated
// recommendation based on the authenticated user's own tasks, or
// { available: false } if no AI provider is configured server-side.
// Never returns static/fabricated copy pretending to be AI output.
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const provider = getAIProvider();
  if (!provider) {
    return NextResponse.json({
      available: false,
      reason: "no_provider_configured",
    });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      select: {
        title: true,
        category: true,
        priority: true,
        duration: true,
        timeframe: true,
        completed: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const recommendation = await provider.getRecommendation(
      tasks as Array<{
        title: string;
        category: string;
        priority: "High" | "Medium" | "Low";
        duration: string;
        timeframe: "today" | "upcoming";
        completed: boolean;
      }>
    );

    if (!recommendation) {
      return NextResponse.json({
        available: false,
        reason: "provider_error",
      });
    }

    return NextResponse.json({ available: true, recommendation });
  } catch (error) {
    console.error("Failed to generate AI recommendation", error);
    return NextResponse.json({ available: false, reason: "provider_error" });
  }
}
