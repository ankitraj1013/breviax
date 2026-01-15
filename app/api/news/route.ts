import { NextResponse } from "next/server";

/* -------------------- IN-MEMORY CACHE -------------------- */
/**
 * Key: topic:page
 * Value: articles + expiry
 */
const cache = new Map<
  string,
  { data: any[]; expires: number }
>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/* -------------------- API ROUTE -------------------- */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const category = searchParams.get("category") || "general";

    const interestsParam = searchParams.get("interests");
    const interests = interestsParam?.split(",").filter(Boolean) || [];

    /* -------------------- VALID GNEWS TOPICS -------------------- */
    const validTopics = [
      "general",
      "world",
      "nation",
      "business",
      "technology",
      "entertainment",
      "sports",
      "science",
      "health",
    ];

    /* -------------------- TOPIC PRIORITY -------------------- */
    /**
     * 1. User interests (highest priority)
     * 2. Selected category
     * 3. Fallback: general
     */
    const topic =
      interests.length > 0 && validTopics.includes(interests[0])
        ? interests[0]
        : validTopics.includes(category)
        ? category
        : "general";

    const cacheKey = `${topic}:${page}`;
    const now = Date.now();

    /* -------------------- CACHE HIT -------------------- */
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > now) {
      return NextResponse.json(cached.data);
    }

    /* -------------------- FETCH FROM GNEWS -------------------- */
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) {
      console.error("❌ GNEWS_API_KEY missing");
      return NextResponse.json([], { status: 200 });
    }

    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?lang=en&country=in&topic=${topic}&page=${page}&max=10&apikey=${apiKey}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("❌ GNews response not OK");
      return NextResponse.json([], { status: 200 });
    }

    const data = await res.json();

    /* -------------------- NORMALIZE DATA -------------------- */
    const articles =
      data?.articles?.map((a: any) => ({
        title: a.title,
        description: a.description,
        publishedAt: a.publishedAt,
        image: a.image || null,
        url: a.url,
        source: {
          name: a.source?.name || "Unknown",
        },
      })) || [];

    /* -------------------- SAVE TO CACHE -------------------- */
    cache.set(cacheKey, {
      data: articles,
      expires: now + CACHE_TTL,
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("❌ News API error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
