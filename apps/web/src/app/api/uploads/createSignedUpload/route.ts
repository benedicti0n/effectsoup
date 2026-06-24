import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createSignedUploadUrl } from "@/lib/r2";
import { z } from "zod";

const requestSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  fileSize: z.number().int().max(20 * 1024 * 1024)
});

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

  const parseResult = requestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const key = `${session.user.id}/${crypto.randomUUID()}/${parseResult.data.fileName}`;
  const uploadUrl = await createSignedUploadUrl(key, parseResult.data.contentType);

  if (!uploadUrl) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  return NextResponse.json({ key, uploadUrl });
}
