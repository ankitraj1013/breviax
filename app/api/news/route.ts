import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = searchParams.get("page") || "1";
    const category = searchParams.get("category") || "general";

    // ✅ VALID GNEWS TOPICS ONLY
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

    const topic = validTopics.includes(category)
      ? category
      : "general";

    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?lang=en&country=in&topic=${topic}&page=${page}&max=10&apikey=${process.env.GNEWS_API_KEY}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await res.json();

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

    return NextResponse.json(articles);
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json([], { status: 200 });
  }
}