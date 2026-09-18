export type DatabaseType = "sqlite" | "postgresql" | "mysql"

export type ActiveElementType = "table" | "index" | "transaction" | "view"

export type SqliteConfig = {
  type: "sqlite"
  path: string
}

export type PostgresConfig = {
  type: "postgresql"
  host: string
  port: number
  database: string
  username: string
  password: string
}

export type MysqlConfig = {
  type: "mysql"
  host: string
  port: number
  database: string
  username: string
  password: string
}

export type DatabaseConfig = SqliteConfig | PostgresConfig | MysqlConfig

export type Connection = {
  id: string
  name: string
  config: DatabaseConfig
}

export type QueryResult = {
  columns: string[]
  rows: Record<string, unknown>[]
}

export type ViewInfo = {
  name: string
  sql: string | null
}
