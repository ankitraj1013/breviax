import { NextResponse } from "next/server";

/* -------------------- IN-MEMORY CACHE -------------------- */
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/* -------------------- OPENAI HELPER -------------------- */
async function generateSummary(title: string, description: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const prompt = `
You are an expert news editor.

Summarize the news clearly for a busy reader.

Title:
${title}

Description:
${description}

Return STRICT JSON in this exact format:
{
  "bullets": ["bullet 1", "bullet 2"],
  "why": "one short sentence explaining why this matters"
}
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error("OpenAI request failed");
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;

  return JSON.parse(text);
}

/* -------------------- API ROUTE -------------------- */
export async function POST(req: Request) {
  let title = "";
  let description = "";

  try {
    const body = await req.json();
    title = body?.title || "";
    description = body?.description || "";

    if (!title || !description) {
      return NextResponse.json(null, { status: 200 });
    }

    const cacheKey = `${title}::${description.slice(0, 120)}`;
    const now = Date.now();

    /* -------- CACHE HIT -------- */
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > now) {
      return NextResponse.json(cached.data);
    }

    /* -------- AI GENERATION -------- */
    const summary = await generateSummary(title, description);

    cache.set(cacheKey, {
      data: summary,
      expires: now + CACHE_TTL,
    });

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Summarize error:", error);

    /* -------- SAFE FALLBACK -------- */
    return NextResponse.json(
      {
        bullets: [(description || "").slice(0, 90) + "…"],
        why: "This story may impact people’s daily life or decisions.",
      },
      { status: 200 }
    );
  }
}
