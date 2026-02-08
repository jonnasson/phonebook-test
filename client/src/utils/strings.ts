const PHONE_ALLOWED = /[^0-9/]/g;

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

export function filterPhoneChars(value: string): string {
  return value.replace(PHONE_ALLOWED, "");
}
