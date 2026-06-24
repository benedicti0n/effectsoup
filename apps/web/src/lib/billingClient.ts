export async function createCheckoutSession(): Promise<{
  sessionId: string;
  checkoutUrl: string | null;
}> {
  const response = await fetch("/api/billing/createCheckout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      successUrl: `${window.location.origin}/billing/success`,
      cancelUrl: `${window.location.origin}/billing/cancel`
    })
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  return (await response.json()) as { sessionId: string; checkoutUrl: string | null };
}
