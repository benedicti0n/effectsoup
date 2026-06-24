import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";
import { db } from "@/lib/db";
import { paymentEvents, subscriptions } from "@/lib/schema";
import { setCachedEntitlement } from "@/lib/redis";

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

function parseTimestamp(value: unknown): Date | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
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

  // Idempotency check.
  try {
    const existing = await db
      .select()
      .from(paymentEvents)
      .where(eq(paymentEvents.providerEventId, id))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ received: true });
    }
  } catch {
    // Continue; we will attempt to insert the event below.
  }

  const eventType = typeof payload.type === "string" ? payload.type : "";
  const data = (payload.data ?? {}) as Record<string, unknown>;
  const userId =
    typeof data.user_id === "string"
      ? data.user_id
      : typeof data.metadata === "object" && data.metadata !== null
        ? (data.metadata as Record<string, unknown>).userId
        : undefined;

  // Persist webhook event.
  try {
    await db.insert(paymentEvents).values({
      id: crypto.randomUUID(),
      providerEventId: id,
      eventType,
      payloadJson: payload as never
    });
  } catch {
    // If insert fails due to duplicate providerEventId, return success.
    return NextResponse.json({ received: true });
  }

  // Handle subscription lifecycle events.
  if (
    eventType === "subscription.active" ||
    eventType === "subscription.updated" ||
    eventType === "subscription.created"
  ) {
    const subscriptionId = typeof data.subscription_id === "string" ? data.subscription_id : "";
    const customerData =
      typeof data.customer === "object" && data.customer !== null
        ? (data.customer as Record<string, unknown>)
        : {};
    const customerId = typeof customerData.id === "string" ? customerData.id : "";
    const productData =
      typeof data.product === "object" && data.product !== null
        ? (data.product as Record<string, unknown>)
        : {};
    const productId =
      typeof data.product_id === "string"
        ? data.product_id
        : typeof productData.id === "string"
          ? productData.id
          : "";
    const status = typeof data.status === "string" ? data.status : "";
    const currentPeriodEnd = parseTimestamp(data.current_period_end);
    const cancelAtPeriodEnd = data.cancel_at_period_end === true;

    if (subscriptionId && typeof userId === "string") {
      try {
        await db
          .insert(subscriptions)
          .values({
            id: crypto.randomUUID(),
            userId,
            dodoCustomerId: customerId,
            dodoSubscriptionId: subscriptionId,
            dodoProductId: productId,
            status,
            currentPeriodEnd: currentPeriodEnd ?? undefined,
            cancelAtPeriodEnd
          })
          .onConflictDoUpdate({
            target: subscriptions.userId,
            set: {
              dodoCustomerId: customerId,
              dodoSubscriptionId: subscriptionId,
              dodoProductId: productId,
              status,
              currentPeriodEnd: currentPeriodEnd ?? undefined,
              cancelAtPeriodEnd,
              updatedAt: new Date()
            }
          });

        await setCachedEntitlement(userId, status === "active" || status === "trialing");
      } catch {
        // Database unavailable; still acknowledge webhook so Dodo retries.
      }
    }
  }

  return NextResponse.json({ received: true });
}
