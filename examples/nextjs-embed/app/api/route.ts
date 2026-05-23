/**
 * Server-side proxy. Browser posts here, we forward to vendetus with
 * the API key (kept on server).
 *
 * Mount at app/api/contact/route.ts in your Next.js project.
 */
import { NextResponse, type NextRequest } from "next/server";

const API = "https://api.vendetus.autos/v1/public";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const carId = process.env.VENDETUS_CAR_ID;
  const apiKey = process.env.VENDETUS_API_KEY;
  if (!carId || !apiKey) {
    return NextResponse.json({ error: "config_missing" }, { status: 500 });
  }

  const res = await fetch(`${API}/cars/${carId}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      author_name: String(body.name ?? ""),
      author_email: body.email ? String(body.email) : undefined,
      body: String(body.body ?? ""),
    }),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
