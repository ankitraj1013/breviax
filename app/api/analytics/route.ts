import { NextResponse } from "next/server";

/**
 * Privacy-first, in-memory analytics store
 * (Replace with DB later using same shape)
 */

type EventType = "view" | "save" | "open";

type AnalyticsEvent = {
  type: EventType;
  title: string;
  timestamp: number;
};

const events: AnalyticsEvent[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.type || !body?.title) {
      return NextResponse.json({ ok: true });
    }

    events.push({
      type: body.type,
      title: body.title,
      timestamp: Date.now(),
    });

    // Safety cap
    if (events.length > 1000) {
      events.shift();
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}

/**
 * DEV-ONLY: Inspect analytics
 * Visit /api/analytics in browser
 */
export async function GET() {
  return NextResponse.json({
    total: events.length,
    events,
  });
}
