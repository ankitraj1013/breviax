"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
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

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);

  const touchStartY = useRef<number | null>(null);
  const lastSwipeTime = useRef(0);

  useEffect(() => {
    const cached = localStorage.getItem("breviax_articles");
    if (cached) setArticles(JSON.parse(cached));

    const savedItems = localStorage.getItem("breviax_saved");
    if (savedItems) setSaved(JSON.parse(savedItems));

    const savedCategory = localStorage.getItem("breviax_category");
    if (savedCategory) setCategory(savedCategory);
  }, []);

  async function loadMore(reset = false) {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    const res = await fetch(
      `/api/news?page=${reset ? 1 : page}&category=${category}`
    );
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      setArticles((prev) => {
        const updated = reset ? data : [...prev, ...data];
        localStorage.setItem("breviax_articles", JSON.stringify(updated));
        return updated;
      });
      setPage(reset ? 2 : page + 1);
      setHasMore(true);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }

  useEffect(() => {
    setArticles([]);
    setIndex(0);
    setPage(1);
    setHasMore(true);
    loadMore(true);
    localStorage.setItem("breviax_category", category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    if (index >= articles.length - 2) loadMore();
  }, [index, articles.length]);

  function toggleSave(title: string) {
    setSaved((prev) => {
      const updated = prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title];
      localStorage.setItem("breviax_saved", JSON.stringify(updated));
      return updated;
    });
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return;

    const diff = touchStartY.current - e.changedTouches[0].clientY;
    const now = Date.now();

    if (now - lastSwipeTime.current < 250) return;

    if (diff > 70 && index < articles.length - 1) {
      setIndex((i) => i + 1);
    } else if (diff < -70 && index > 0) {
      setIndex((i) => i - 1);
    }

    lastSwipeTime.current = now;
    touchStartY.current = null;
  }

  return (
    <>
      <Header />
      <Categories active={category} onChange={setCategory} />

      <main
        className="h-screen bg-gray-100 dark:bg-black flex items-center justify-center px-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ✅ WIDTH CONTROLLER */}
        <div className="w-full max-w-2xl">
          {articles[index] ? (
            <NewsCard
              category={articles[index].source?.name || "News"}
              title={articles[index].title}
              summary={articles[index].description}
              source={articles[index].source?.name || "Unknown"}
              time={new Date(
                articles[index].publishedAt
              ).toLocaleTimeString()}
              image={articles[index].image}
              url={articles[index].url}
              saved={saved.includes(articles[index].title)}
              onSave={() => toggleSave(articles[index].title)}
            />
          ) : loading ? (
            <NewsCardSkeleton />
          ) : (
            <p className="text-gray-500 text-sm text-center">
              No news available
            </p>
          )}
        </div>
      </main>
    </>
  );
}
