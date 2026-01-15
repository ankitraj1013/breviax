"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
import Feed from "@/components/Feed";
import InterestSelector from "@/components/InterestSelector";

export default function Home() {
  const [category, setCategory] = useState("general");
  const [interests, setInterests] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // Load saved interests
  useEffect(() => {
    const saved = localStorage.getItem("interests");
    if (saved) setInterests(JSON.parse(saved));
    setReady(true);
  }, []);

  // Persist interests
  useEffect(() => {
    if (ready) {
      localStorage.setItem("interests", JSON.stringify(interests));
    }
  }, [interests, ready]);

  if (!ready) return null;

  return (
    <>
      <Header />

      {interests.length === 0 && (
        <InterestSelector
          selected={interests}
          onChange={setInterests}
        />
      )}

      <Categories active={category} onChange={setCategory} />

      <Feed category={category} interests={interests} />
    </>
  );
}
