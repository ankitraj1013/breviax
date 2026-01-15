"use client";

import { INTERESTS } from "@/lib/interests";

type Props = {
  selected: string[];
  onChange: (v: string[]) => void;
};

export default function InterestSelector({ selected, onChange }: Props) {
  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id]
    );
  }

  return (
    <div className="p-4 bg-black">
      <h2 className="text-lg font-semibold text-white mb-3">
        Choose your interests
      </h2>

      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((i) => (
          <button
            key={i.id}
            onClick={() => toggle(i.id)}
            className={`px-3 py-1.5 rounded-full text-sm transition
              ${
                selected.includes(i.id)
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-gray-300"
              }`}
          >
            {i.label}
          </button>
        ))}
      </div>
    </div>
  );
}
