import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { z } from "zod";

const requestSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  fileSize: z.number().int().max(20 * 1024 * 1024)
});

export async function POST(request: Request): Promise<Response> {
  const session = await auth.api.getSession({ headers: new Headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !env.R2_ACCOUNT_ID ||
    !env.R2_ACCESS_KEY_ID ||
    !env.R2_SECRET_ACCESS_KEY ||
    !env.R2_BUCKET_NAME
  ) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = requestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const key = `${session.user.id}/${crypto.randomUUID()}/${parseResult.data.fileName}`;

  // Production: generate a real S3-compatible signed URL using R2 credentials.
  return NextResponse.json({ key, uploadUrl: null });
}
