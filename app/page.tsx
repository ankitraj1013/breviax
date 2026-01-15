"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
import Feed from "@/components/Feed";

export default function Home() {
  const [category, setCategory] = useState("general");

  return (
    <>
      <Header />
      <Categories active={category} onChange={setCategory} />
      <Feed category={category} />
    </>
  );
}
