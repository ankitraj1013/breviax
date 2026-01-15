"use client";

import { useEffect, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import NewsCard from "@/components/NewsCard";
import NewsCardSkeleton from "@/components/NewsCardSkeleton";

type Article = {
  title: string;
  description: string;
  publishedAt: string;
  image?: string | null;
  url?: string;
  source?: { name?: string };
};

const ITEM_HEIGHT = 800; // one screen height

export default function Feed({
  category,
  interests,
  premium,
}: {
  category: string;
  interests: string[];
  premium: boolean;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);

  const listRef = useRef<List>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  /* -------------------- RESET ON FILTER CHANGE -------------------- */
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    loadMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, interests.join(",")]);

  /* -------------------- INFINITE LOAD -------------------- */
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadMore(),
      { threshold: 0.5 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  async function loadMore(reset = false) {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);

    const res = await fetch(
      `/api/news?page=${reset ? 1 : page}&category=${category}&interests=${interests.join(",")}`
    );

    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      setArticles((prev) => (reset ? data : [...prev, ...data]));
      setPage(reset ? 2 : page + 1);
      setHasMore(true);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }

  /* -------------------- SAVE (PREMIUM GATING) -------------------- */
  function toggleSave(title: string) {
    if (!premium && saved.length >= 10 && !saved.includes(title)) {
      alert("Upgrade to Premium for unlimited saves");
      return;
    }

    setSaved((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  }

  /* -------------------- ROW RENDER -------------------- */
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const article = articles[index];
    if (!article) return null;

    return (
      <section style={style} className="flex justify-center px-4">
        <div className="w-full max-w-2xl -mt-6">
          <NewsCard
            category={article.source?.name || "News"}
            title={article.title}
            summary={article.description}
            source={article.source?.name || "Unknown"}
            time={new Date(article.publishedAt).toLocaleTimeString()}
            image={article.image}
            url={article.url}
            saved={saved.includes(article.title)}
            onSave={() => toggleSave(article.title)}
          />
        </div>
      </section>
    );
  };

  /* -------------------- RENDER -------------------- */
  return (
    <main className="h-[100vh] bg-black overflow-hidden">
      <List
        ref={listRef}
        height={ITEM_HEIGHT}
        itemCount={articles.length}
        itemSize={ITEM_HEIGHT}
        width="100%"
      >
        {Row}
      </List>

      {hasMore && (
        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center"
        >
          {loading && <NewsCardSkeleton />}
        </div>
      )}
    </main>
  );
}
