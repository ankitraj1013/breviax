type AnalyticsEvent = {
  type: "view" | "save" | "open";
  title: string;
};

export function track(event: AnalyticsEvent) {
  try {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
  } catch {
    // Analytics must NEVER break UX
  }
}
