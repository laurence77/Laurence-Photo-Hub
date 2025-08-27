import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves image paths correctly for both development and production environments.
 * In development, returns the path as-is.
 * In production (GitHub Pages), prepends the base path "/Laurence-Photo-Hub".
 * 
 * @param path - The image path starting with "/" (e.g., getImagePath('/uploads/image.jpg'), getImagePath('/placeholder.svg'))
 * @returns The properly formatted path for the current environment
 */
export function getImagePath(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In development, use the original path
  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }
  
  // In production (GitHub Pages), use the base path
  return `/Laurence-Photo-Hub/${cleanPath}`;
}
