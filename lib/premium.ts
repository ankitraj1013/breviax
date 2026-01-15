export function isPremium(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("premium") === "true";
}

export function setPremium(value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("premium", value ? "true" : "false");
}
