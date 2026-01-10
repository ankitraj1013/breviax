"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomTabs() {
  const pathname = usePathname();

  const tabClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-1 text-xs ${
      active ? "text-blue-500" : "text-gray-400"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-zinc-900 border-t border-zinc-800 flex justify-around z-50">
      <Link href="/" className={tabClass(pathname === "/")}>
        📰
        <span>Home</span>
      </Link>

      <Link href="/saved" className={tabClass(pathname === "/saved")}>
        🔖
        <span>Saved</span>
      </Link>
    </nav>
  );
}
