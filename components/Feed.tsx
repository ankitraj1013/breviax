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

const ITEM_HEIGHT = 800;

export default function Feed({ category }: { category: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

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
      `/api/news?page=${reset ? 1 : page}&category=${category}`
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

  function toggleSave(title: string) {
    setSaved((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  }

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
      <section style={style} className="snap-start flex justify-center px-4">
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

  return (
    <main className="h-[100vh] bg-black snap-y snap-mandatory">
      <List
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
