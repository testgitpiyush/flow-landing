import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(40).default("Product"),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  duration: z.string().trim().min(1).max(20).default("25m"),
  timeframe: z.enum(["today", "upcoming"]).default("today"),
});

const updateTaskSchema = z.object({
  id: z.string().cuid(),
  completed: z.boolean(),
});

async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Failed to fetch tasks", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid task" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: { ...parsed.data, userId, completed: false },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Failed to create task", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid task update" },
        { status: 400 }
      );
    }

    const existingTask = await prisma.task.findFirst({
      where: { id: parsed.data.id, userId },
      select: { id: true },
    });
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = await prisma.task.update({
      where: { id: parsed.data.id },
      data: { completed: parsed.data.completed },
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Failed to update task", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
