export function normalizeTime(value?: string): string | null {
  return value && value.trim() !== "" ? `${value}:00` : null;
}
