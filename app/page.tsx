"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
import Feed from "@/components/Feed";
import InterestSelector from "@/components/InterestSelector";
import PremiumBanner from "@/components/PremiumBanner";
import { isPremium } from "@/lib/premium";

export default function Home() {
  const [category, setCategory] = useState("general");
  const [interests, setInterests] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [premium, setPremiumState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("interests");
    if (saved) setInterests(JSON.parse(saved));
    setPremiumState(isPremium());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem("interests", JSON.stringify(interests));
    }
  }, [interests, ready]);

  if (!ready) return null;

  return (
    <>
      <Header />

      {!premium && <PremiumBanner />}

      {interests.length === 0 && (
        <InterestSelector
          selected={interests}
          onChange={setInterests}
        />
      )}

      <Categories active={category} onChange={setCategory} />

      <Feed
        category={category}
        interests={interests}
        premium={premium}
      />
    </>
  );
}
