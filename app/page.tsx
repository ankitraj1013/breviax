"use client";

import { useEffect, useState } from "react";
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
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    loadMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

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

  return (
    <>
      <Header />
      <Categories active={category} onChange={setCategory} />

      {/* ONE CARD PER SCREEN */}
      <main className="h-[100vh] overflow-y-scroll snap-y snap-mandatory bg-black">
        {articles.map((a, i) => (
          <section
            key={`${a.title}-${i}`}
            className="h-[100vh] snap-start flex justify-center px-4"
            onScrollCapture={() => {
              if (i >= articles.length - 2) loadMore();
            }}
          >
            {/* ⬆️ PULL CARD CLOSE TO CATEGORIES */}
            <div className="w-full max-w-2xl -mt-6">
              <NewsCard
                category={a.source?.name || "News"}
                title={a.title}
                summary={a.description}
                source={a.source?.name || "Unknown"}
                time={new Date(a.publishedAt).toLocaleTimeString()}
                image={a.image}
                url={a.url}
                saved={saved.includes(a.title)}
                onSave={() => toggleSave(a.title)}
              />
            </div>
          </section>
        ))}

        {loading && (
          <section className="h-[100vh] snap-start flex items-center justify-center">
            <NewsCardSkeleton />
          </section>
        )}
      </main>
    </>
  );
}
