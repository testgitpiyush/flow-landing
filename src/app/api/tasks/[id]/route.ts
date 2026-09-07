import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    category: z.string().trim().min(1).max(40),
    priority: z.enum(["High", "Medium", "Low"]),
    duration: z.string().trim().min(1).max(20),
    timeframe: z.enum(["today", "upcoming"]),
    completed: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields to update",
  });

async function getAuthenticatedUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/tasks/[id] - update a task. Only the owning user may update it;
// ownership is enforced server-side via the session, never trusted from the
// request body or the URL alone.
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid task update" },
        { status: 400 }
      );
    }

    // Scope the lookup to the authenticated user so one user can never
    // read or mutate another user's task, even if they guess a valid id.
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = await prisma.task.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Failed to update task", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - delete a task owned by the authenticated user.
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
