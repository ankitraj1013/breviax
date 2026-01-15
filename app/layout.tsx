import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "BreviaX – Smart News That Matters",
  description:
    "BreviaX delivers short, AI-powered news summaries personalized to your interests.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>

      <body>{children}</body>

      {/* Service Worker registration */}
      <Script
        src="/sw-register.js"
        strategy="afterInteractive"
      />
    </html>
  );
}
