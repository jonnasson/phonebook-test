export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  const capped = digits.slice(0, 12);
  if (capped.length > 4) {
    return capped.slice(0, 4) + "/" + capped.slice(4);
  }
  return capped;
}

export function stringToColor(str: string, isDark: boolean): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = ((hash % 360) + 360) % 360;
  return isDark ? `hsl(${h}, 70%, 65%)` : `hsl(${h}, 55%, 45%)`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
