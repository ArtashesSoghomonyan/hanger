import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import hljs from "highlight.js/lib/core"
import sql from "highlight.js/lib/languages/sql"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

hljs.registerLanguage("sql", sql)

export function highlightSql(code: string) {
  return hljs.highlight(code, { language: "sql", ignoreIllegals: true }).value
}
