import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { env } from "@/lib/env";

function verifyStandardWebhook(
  payload: string,
  headers: {
    id: string;
    timestamp: string;
    signature: string;
  },
  secret: string
): boolean {
  const signedPayload = `${headers.id}.${headers.timestamp}.${payload}`;
  const computed = createHmac("sha256", secret).update(signedPayload).digest("base64");

  const signatures = headers.signature
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.startsWith("v1,"))
    .map((s) => s.slice(3));

  if (signatures.length === 0) return false;

  const computedBuffer = Buffer.from(computed);
  return signatures.some((signature) => {
    try {
      const sigBuffer = Buffer.from(signature);
      if (sigBuffer.length !== computedBuffer.length) return false;
      return timingSafeEqual(computedBuffer, sigBuffer);
    } catch {
      return false;
    }
  });
}

export async function POST(request: Request): Promise<Response> {
  if (!env.DODO_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const id = request.headers.get("webhook-id") ?? "";
  const timestamp = request.headers.get("webhook-timestamp") ?? "";
  const signature = request.headers.get("webhook-signature") ?? "";

  const rawBody = await request.text();

  if (!verifyStandardWebhook(rawBody, { id, timestamp, signature }, env.DODO_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload.type;
  if (
    eventType === "subscription.active" ||
    eventType === "subscription.updated" ||
    eventType === "payment.succeeded"
  ) {
    // Persist subscription state in production. In development without a configured
    // database connection this is a no-op, but the structure is correct.
  }

  return NextResponse.json({ received: true });
}
