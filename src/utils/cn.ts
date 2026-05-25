// ============================================================
// UTILITY: CLASS NAME MERGER
// Combines Tailwind classes with clsx and tailwind-merge
// ============================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
