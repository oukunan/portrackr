import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertMSTime(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  return seconds + ' second' + (seconds > 1 ? 's': '')
}
