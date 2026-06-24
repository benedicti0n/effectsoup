import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { z } from "zod";

const requestSchema = z.object({
  customerId: z.string().min(1),
  returnUrl: z.string().url()
});

export async function POST(request: Request): Promise<Response> {
  if (!env.DODO_API_KEY) {
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

  const { customerId, returnUrl } = parseResult.data;
  const baseUrl = env.DODO_API_KEY.startsWith("dodo_test_")
    ? "https://test.dodopayments.com"
    : "https://live.dodopayments.com";

  try {
    const url = new URL(
      `${baseUrl}/customers/${encodeURIComponent(customerId)}/customer-portal/session`
    );
    url.searchParams.set("return_url", returnUrl);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.DODO_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Portal creation failed" },
        { status: response.status }
      );
    }

    const data = (await response.json()) as { link: string };
    return NextResponse.json({ portalUrl: data.link });
  } catch {
    return NextResponse.json(
      { error: "Portal creation failed" },
      { status: 500 }
    );
  }
}
