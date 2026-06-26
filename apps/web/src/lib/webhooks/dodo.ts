import { createHmac, timingSafeEqual } from "crypto";

export function verifyStandardWebhook(
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

export function parseTimestamp(value: unknown): Date | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
