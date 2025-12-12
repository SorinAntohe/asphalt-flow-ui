import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a string value from API tuple format like [('value',)] or ['value'] or 'value'
 * Handles nested arrays returned by backend APIs
 */
export function extractApiValue(data: unknown): string {
  if (data === null || data === undefined) return '';
  if (typeof data === 'string') return data;
  if (typeof data === 'number') return String(data);
  if (Array.isArray(data)) {
    const first = data[0];
    if (first === null || first === undefined) return '';
    if (typeof first === 'string') return first;
    if (typeof first === 'number') return String(first);
    if (Array.isArray(first)) return extractApiValue(first);
    if (typeof first === 'object' && first !== null) {
      // Handle tuple-like objects
      const values = Object.values(first);
      if (values.length > 0) return extractApiValue(values[0]);
    }
  }
  return String(data);
}

/**
 * Flattens an API array response from tuple format to simple string array
 * Converts [('a',), ('b',)] to ['a', 'b']
 */
export function flattenApiArray(data: unknown[]): string[] {
  if (!Array.isArray(data)) return [];
  return data.map(item => extractApiValue(item)).filter(Boolean);
}

/**
 * Converts API array to FilterableSelect options format
 * Handles tuple format [('value',), ...] automatically
 */
export function toSelectOptions(data: unknown[]): Array<{ value: string; label: string }> {
  const flattened = flattenApiArray(data);
  return flattened.map(item => ({ value: item, label: item }));
}
