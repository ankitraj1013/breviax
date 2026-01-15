import { NextResponse } from "next/server";

/* -------------------- AI CACHE -------------------- */
const cache = new Map<
  string,
  { data: any; expires: number }
>();

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: Request) {
  const { title, description } = await req.json();

  const key = `${title}::${description?.slice(0, 100)}`;
  const now = Date.now();

  // ✅ CACHE HIT
  const cached = cache.get(key);
  if (cached && cached.expires > now) {
    return NextResponse.json(cached.data);
  }

  // 🔹 TEMP AI PLACEHOLDER (SAFE)
  const summary = {
    bullets: [
      description?.slice(0, 90) + "…",
      "Key impact explained in simple terms.",
    ],
    why: "This affects readers because it influences daily life or decisions.",
  };

  // 💾 SAVE TO CACHE
  cache.set(key, {
    data: summary,
    expires: now + CACHE_TTL,
  });

  return NextResponse.json(summary);
}
