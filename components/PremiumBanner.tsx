"use client";

import { setPremium } from "@/lib/premium";

export default function PremiumBanner() {
  return (
    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black p-3 flex items-center justify-between">
      <div>
        <p className="font-semibold">Upgrade to BreviaX Premium</p>
        <p className="text-sm">
          Unlimited saves • Better AI • Clean experience
        </p>
      </div>

      <button
        onClick={() => {
          setPremium(true);
          window.location.reload();
        }}
        className="bg-black text-white px-4 py-1.5 rounded-full text-sm"
      >
        Upgrade
      </button>
    </div>
  );
}
