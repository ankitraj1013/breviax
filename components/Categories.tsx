"use client";

type Props = {
  active: string;
  onChange: (cat: string) => void;
};

const categories = [
  { label: "Top", value: "general" },
  { label: "World", value: "world" },
  { label: "Business", value: "business" },
  { label: "Technology", value: "technology" },
  { label: "Sports", value: "sports" },
  { label: "Science", value: "science" },
];

export default function Categories({ active, onChange }: Props) {
  return (
    <div className="sticky top-[72px] z-40 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-xl mx-auto px-4 py-2 flex gap-3 overflow-x-auto text-sm">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`px-4 py-1 rounded-full whitespace-nowrap ${
              active === cat.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
