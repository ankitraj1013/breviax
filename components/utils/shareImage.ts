export async function shareAsImage({
  title,
  summary,
  source,
}: {
  title: string;
  summary: string;
  source: string;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 52px Arial";
  wrapText(ctx, title, 80, 140, 920, 64);

  // Summary
  ctx.fillStyle = "#cbd5f5";
  ctx.font = "32px Arial";
  wrapText(ctx, summary, 80, 360, 920, 44);

  // Footer
  ctx.fillStyle = "#38bdf8";
  ctx.font = "28px Arial";
  ctx.fillText(`Source: ${source}`, 80, 960);

  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res)
  );
  if (!blob) return;

  const file = new File([blob], "breviax-news.png", {
    type: "image/png",
  });

  // Share image (works on supported mobile browsers)
  if ((navigator as any).canShare?.({ files: [file] })) {
    await (navigator as any).share({
      files: [file],
      title: "BreviaX News",
    });
  } else {
    // fallback: download image
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "breviax-news.png";
    link.click();
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
