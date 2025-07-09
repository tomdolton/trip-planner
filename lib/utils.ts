import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeTime(value?: string): string | null {
  return value && value.trim() !== "" ? `${value}:00` : null;
}
