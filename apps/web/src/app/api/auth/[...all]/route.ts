import { getAuth } from "@/lib/auth";

export async function GET(request: Request): Promise<Response> {
  const auth = await getAuth();
  return auth.handler(request);
}

export async function POST(request: Request): Promise<Response> {
  const auth = await getAuth();
  return auth.handler(request);
}
