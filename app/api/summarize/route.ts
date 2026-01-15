import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, description } = await req.json();

  // TEMP placeholder (safe). We'll plug real AI later
  const summary = {
    bullets: [
      description?.slice(0, 90) + "…",
      "Key impact explained in simple terms.",
    ],
    why: "This affects readers because it influences daily life or decisions.",
  };

  return NextResponse.json(summary);
}
