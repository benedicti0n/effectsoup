import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  sourceImageKey: z.string().min(1).optional(),
  thumbnailKey: z.string().min(1).optional(),
  aspectRatio: z.string().min(1).optional(),
  effectGraphJson: z.string().min(1).optional()
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    const result = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ project: result[0] });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = updateSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const result = await db
      .update(projects)
      .set({ ...parseResult.data, updatedAt: new Date() })
      .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ project: result[0] });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, session.user.id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ deleted: projectId });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
