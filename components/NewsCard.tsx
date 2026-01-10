import { useState } from "react";

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

    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    setShowShare(false);

    const toast = document.createElement("div");
    toast.innerText = "Link copied";
    toast.className =
      "fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2 rounded-full z-50";
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 1500);
  }

  return (
    <>
      {/* CARD */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-zinc-800">
        {image && (
          <div className="w-full h-56 overflow-hidden rounded-xl mb-4">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <p className="text-xs text-blue-600 font-medium mb-2">
          {category}
        </p>

        <h2 className="text-lg font-semibold mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {summary}
        </p>

        {/* ACTION ROW */}
        <div className="flex items-center justify-between mt-4">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-blue-600 font-medium"
            >
              Learn more →
            </a>
          )}

          <div className="flex items-center gap-4">
            {/* SHARE */}
            <button onClick={() => setShowShare(true)} aria-label="Share">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/>
                <path d="M16 6l-4-4-4 4"/>
                <path d="M12 2v14"/>
              </svg>
            </button>

            {/* SAVE */}
            <button onClick={(e) => { e.stopPropagation(); onSave?.(); }}>
              {saved ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
                  <path d="M6 2a2 2 0 0 0-2 2v18l8-5 8 5V4a2 2 0 0 0-2-2H6z"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-5-8 5V4a2 2 0 0 1 2-2z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-400 flex justify-between mt-3">
          <span>{source}</span>
          <span>{time}</span>
        </div>
      </div>

      {/* SHARE SHEET */}
      {showShare && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowShare(false)}
          />

          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-2xl p-5 z-50 animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            <p className="text-sm font-medium text-center mb-4">
              Share via
            </p>

            <div className="flex justify-around text-center">
              {/* WhatsApp */}
              <button onClick={shareWhatsApp}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M12 2a10 10 0 0 0-8.53 15.2L2 22l4.93-1.3A10 10 0 1 0 12 2z"/>
                </svg>
                <p className="text-xs mt-1">WhatsApp</p>
              </button>

              {/* Telegram */}
              <button onClick={shareTelegram}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#229ED9">
                  <path d="M9.04 15.44l-.38 5.36 2.02-2.04 5.33 3.9c.98.54 1.68.26 1.93-.9l3.5-16.41c.33-1.52-.55-2.12-1.52-1.77L2.5 9.77c-1.47.58-1.45 1.42-.27 1.79l4.78 1.49z"/>
                </svg>
                <p className="text-xs mt-1">Telegram</p>
              </button>

              {/* X */}
              <button onClick={shareTwitter}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="black">
                  <path d="M18.36 2H21l-6.24 7.13L22.5 22H16.7l-4.54-5.63L6.8 22H4l6.67-7.63L1.5 2h5.95l4.1 5.1L18.36 2z"/>
                </svg>
                <p className="text-xs mt-1">X</p>
              </button>

              {/* Copy */}
              <button onClick={copyLink}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <p className="text-xs mt-1">Copy</p>
              </button>
            </div>

            <button
              className="mt-6 w-full py-2 text-sm text-gray-600"
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
