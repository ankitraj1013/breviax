"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* -------------------- TYPES -------------------- */

type AiSummary = {
  bullets: string[];
  why: string;
};

type NewsCardProps = {
  category: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  image?: string | null;
  url?: string;
  saved: boolean;
  onSave: () => void;
};

/* -------------------- COMPONENT -------------------- */

export default function NewsCard({
  category,
  title,
  summary,
  source,
  time,
  image,
  url,
  saved,
  onSave,
}: NewsCardProps) {
  const [ai, setAi] = useState<AiSummary | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  /* -------- Fetch AI summary (safe, non-blocking) -------- */
  useEffect(() => {
    let cancelled = false;

    async function fetchAi() {
      try {
        setLoadingAi(true);
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description: summary,
          }),
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!cancelled) setAi(data);
      } catch {
        // fail silently – never break the feed
      } finally {
        if (!cancelled) setLoadingAi(false);
      }
    }

    fetchAi();
    return () => {
      cancelled = true;
    };
  }, [title, summary]);

  /* -------------------- RENDER -------------------- */

  return (
    <article className="bg-neutral-950 text-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-150 active:scale-[0.98]">
      {/* IMAGE */}
      {image && (
        <div className="relative h-56 w-full">
          <Image
  src={image}
  alt={title}
  fill
  unoptimized
  className="object-cover"
/>
        </div>
      )}

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-3">
        {/* META */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="uppercase tracking-wide">{category}</span>
          <span>{time}</span>
        </div>

        {/* TITLE */}
        <h1 className="text-xl font-bold leading-snug tracking-tight">
          {title}
        </h1>

        {/* SUMMARY */}
        <p className="text-base text-gray-300 leading-relaxed">
          {summary}
        </p>

        {/* DIVIDER */}
        <div className="h-px bg-neutral-800 my-2" />

        {/* AI LOADING */}
        {loadingAi && (
          <p className="text-xs text-gray-500 italic animate-pulse">
            Understanding why this matters…
          </p>
        )}

        {/* AI CONTENT */}
        {ai && (
          <div className="text-sm text-gray-300">
            <ul className="list-disc ml-4 space-y-1">
              {ai.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <p className="mt-2 italic text-gray-400">
              <span className="font-medium text-gray-300">
                Why this matters:
              </span>{" "}
              {ai.why}
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={onSave}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {saved ? "★ Saved" : "☆ Save"}
          </button>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white"
            >
              Read full →
            </a>
          )}
        </div>

        {/* SOURCE */}
        <div className="mt-2 text-xs text-gray-500">
          Source: {source}
        </div>
      </div>
    </article>
  );
}