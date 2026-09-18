/**
 * Quote a SQLite identifier: wrap it in double quotes and double every embedded
 * double quote (the SQL-standard escape).
 *
 * Single quotes are not interchangeable here even though SQLite tolerates
 * `SELECT * FROM 'users'` for simple names — `SELECT * FROM 'o'brien'` is a
 * parse error, while `SELECT * FROM "o'brien"` is not.
 */
export function quoteIdentifier(identifier: string) {
  return `"${identifier.replace(/"/g, '""')}"`
}

/** Coerce a number used inside a LIMIT/OFFSET clause to a safe, non-negative integer. */
export function toSqlInteger(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0
}
