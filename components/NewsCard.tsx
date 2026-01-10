"use client";

import { useState } from "react";
import { shareAsImage } from "@/utils/shareImage";
import { hapticLight } from "@/utils/haptics";

type Props = {
  category: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  image?: string | null;
  url?: string;
  saved?: boolean;
  onSave?: () => void;
};

export default function NewsCard({
  category,
  title,
  summary,
  source,
  time,
  image,
  url,
  saved,
  onSave,
}: Props) {
  const [showShare, setShowShare] = useState(false);

  function open(link: string) {
    hapticLight();
    window.open(link, "_blank");
  }

  function shareWhatsApp() {
    if (!url) return;
    open(`https://wa.me/?text=${encodeURIComponent(title + "\n\n" + url)}`);
  }

  function shareTelegram() {
    if (!url) return;
    open(
      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`
    );
  }

  function shareTwitter() {
    if (!url) return;
    open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`
    );
  }

  function copyLink() {
    if (!url) return;
    hapticLight();

    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    setShowShare(false);
  }

  return (
    <>
      {/* CARD */}
      <article className="bg-zinc-900 rounded-2xl px-5 pt-7 pb-5 shadow-md border border-zinc-800 w-full">
        {image && (
          <div className="w-full h-56 overflow-hidden rounded-xl mb-3">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <p className="text-xs text-blue-500 font-medium mb-1">
          {category}
        </p>

        <h2 className="text-lg font-semibold leading-snug mb-2 text-white">
          {title}
        </h2>

        <p className="text-sm text-gray-300 mb-4">
          {summary}
        </p>

        {/* ACTION ROW */}
        <div className="flex items-center justify-between">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 font-medium"
            >
              Learn more →
            </a>
          )}

          <div className="flex items-center gap-4">
            {/* SHARE */}
            <button
              onClick={() => {
                hapticLight();
                setShowShare(true);
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
                <path d="M16 6l-4-4-4 4"/>
                <path d="M12 2v14"/>
              </svg>
            </button>

            {/* SAVE */}
            <button
              onClick={() => {
                hapticLight();
                onSave?.();
              }}
            >
              {saved ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#22c55e">
                  <path d="M6 2a2 2 0 0 0-2 2v18l8-5 8 5V4a2 2 0 0 0-2-2H6z"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-5-8 5V4a2 2 0 0 1 2-2z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 flex justify-between mt-3">
          <span>{source}</span>
          <span>{time}</span>
        </div>
      </article>

      {/* SHARE SHEET */}
      {showShare && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowShare(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 rounded-t-2xl p-5 z-50 animate-slide-up">
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />

            <div className="flex justify-around text-center">
              <button onClick={shareWhatsApp}>WhatsApp</button>
              <button onClick={shareTelegram}>Telegram</button>
              <button onClick={shareTwitter}>X</button>
              <button onClick={copyLink}>Copy</button>
            </div>

            <button
              className="mt-5 w-full py-2 text-sm text-blue-500"
              onClick={() =>
                shareAsImage({ title, summary, source })
              }
            >
              Share as image
            </button>

            <button
              className="mt-3 w-full py-2 text-sm text-gray-400"
              onClick={() => setShowShare(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  );
}
