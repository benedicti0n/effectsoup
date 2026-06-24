import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { z } from "zod";
import { auth } from "@/lib/auth";

const requestSchema = z.object({
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
});

export async function POST(request: Request): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!env.DODO_API_KEY || !env.DODO_PREMIUM_PRODUCT_ID) {
    return NextResponse.json(
      { error: "Billing is not configured" },
      { status: 503 }
    );
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

  const { successUrl, cancelUrl } = parseResult.data;
  const productId = env.DODO_PREMIUM_PRODUCT_ID;
  const baseUrl = env.DODO_API_KEY.startsWith("dodo_test_")
    ? "https://test.dodopayments.com"
    : "https://live.dodopayments.com";

  try {
    const response = await fetch(`${baseUrl}/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.DODO_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_cart: [{ product_id: productId, quantity: 1 }],
        return_url: successUrl,
        cancel_url: cancelUrl,
        customer: { email: session.user.email },
        metadata: { userId: session.user.id }
      })
    });

    if (!response.ok) {
      await response.text();
      return NextResponse.json(
        { error: "Checkout creation failed" },
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      session_id: string;
      checkout_url: string | null;
    };

    return NextResponse.json({
      sessionId: data.session_id,
      checkoutUrl: data.checkout_url
    });
  } catch {
    return NextResponse.json(
      { error: "Checkout creation failed" },
      { status: 500 }
    );
  }
}
