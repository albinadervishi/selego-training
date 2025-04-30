import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge class names.
 * @param {...string} inputs - The class names to merge
 * @returns {string} - The merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** Format a date to YYYY-MM-DD.
 * @param {string} isoDateString - The ISO date string
 * @returns {string} - The formatted date
 * @example
 * formatDateToYYYYMMDD('2021-01-01T00:00:00.000Z') // '2021-01-01'
 */
export function formatDateToYYYYMMDD(isoDateString) {
  const date = new Date(isoDateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const formattedMonth = month < 10 ? `0${month}` : month
  const formattedDay = day < 10 ? `0${day}` : day
  return `${year}-${formattedMonth}-${formattedDay}`
}
