use std::sync::Mutex;

use rusqlite::types::ValueRef;
use rusqlite::Connection;

use crate::ViewInfo;

use super::{Database, IndexInfo, QueryResult};

pub struct SqliteDatabase {
    conn: Mutex<Connection>,
}

impl SqliteDatabase {
    pub fn open(path: &str) -> Result<Self, String> {
        let conn = Connection::open(path).map_err(|e| e.to_string())?;
        Ok(Self {
            conn: Mutex::new(conn),
        })
    }
}

impl Database for SqliteDatabase {
    fn list_tables(&self) -> Result<Vec<String>, String> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn
            .prepare(
                "SELECT name FROM sqlite_master \
                 WHERE type = 'table' AND name NOT LIKE 'sqlite_%' \
                 ORDER BY name",
            )
            .map_err(|e| e.to_string())?;

        let tables = stmt
            .query_map([], |row| row.get::<_, String>(0))
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string())?;

        Ok(tables)
    }

    fn list_table_indexes(&self, table: &str) -> Result<Vec<IndexInfo>, String> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn
            .prepare(
                "SELECT name, sql
            FROM sqlite_master
            WHERE type = 'index' AND tbl_name = ?1
            ORDER BY name",
            )
            .map_err(|e| e.to_string())?;

        let indexes = stmt
            .query_map([table], |row| {
                Ok(IndexInfo {
                    name: row.get(0)?,
                    sql: row.get(1)?,
                })
            })
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string())?;

        Ok(indexes)
    }

    fn list_views(&self) -> Result<Vec<ViewInfo>, String> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn
            .prepare(
                "SELECT name, sql FROM sqlite_master \
                WHERE type = 'view' AND name NOT LIKE 'sqlite_%' \
                ORDER BY name",
            )
            .map_err(|e| e.to_string())?;

        let views = stmt
            .query_map([], |row| {
                Ok(ViewInfo {
                    name: row.get(0)?,
                    sql: row.get(1)?,
                })
            })
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string())?;

        Ok(views)
    }

    fn run_query(&self, sql: &str) -> Result<QueryResult, String> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(sql).map_err(|e| e.to_string())?;

        let columns: Vec<String> = stmt
            .column_names()
            .iter()
            .map(|name| name.to_string())
            .collect();

        let mut rows: Vec<serde_json::Value> = Vec::new();
        let mut query = stmt.query([]).map_err(|e| e.to_string())?;

        while let Some(row) = query.next().map_err(|e| e.to_string())? {
            let mut object = serde_json::Map::new();
            for (index, column) in columns.iter().enumerate() {
                let value = row.get_ref(index).map_err(|e| e.to_string())?;
                object.insert(column.clone(), sqlite_value_to_json(value));
            }
            rows.push(serde_json::Value::Object(object));
        }

        Ok(QueryResult { columns, rows })
    }
}

fn sqlite_value_to_json(value: ValueRef) -> serde_json::Value {
    match value {
        ValueRef::Null => serde_json::Value::Null,
        ValueRef::Integer(value) => serde_json::Value::from(value),
        ValueRef::Real(value) => serde_json::json!(value),
        ValueRef::Text(value) => {
            serde_json::Value::String(String::from_utf8_lossy(value).into_owned())
        }
        ValueRef::Blob(value) => {
            serde_json::Value::String(format!("<blob: {} bytes>", value.len()))
        }
    }
}
