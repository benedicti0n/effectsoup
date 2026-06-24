import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  sourceImageKey: z.string().min(1),
  thumbnailKey: z.string().min(1),
  aspectRatio: z.string().min(1),
  effectGraphJson: z.string().min(1)
});

const PROJECT_LIMIT = 50;

export async function GET(request: Request): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        thumbnailKey: projects.thumbnailKey,
        aspectRatio: projects.aspectRatio,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt
      })
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .orderBy(projects.updatedAt);

    return NextResponse.json({ projects: userProjects });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = createSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const existingCount = await db
      .select({ count: projects.id })
      .from(projects)
      .where(eq(projects.userId, session.user.id));

    if (existingCount.length >= PROJECT_LIMIT) {
      return NextResponse.json(
        { error: "Project limit reached" },
        { status: 400 }
      );
    }

    const projectId = crypto.randomUUID();
    await db.insert(projects).values({
      id: projectId,
      userId: session.user.id,
      ...parseResult.data
    });

    return NextResponse.json({ projectId });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
