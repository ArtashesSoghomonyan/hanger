pub mod sqlite;

use serde::Serialize;

use crate::ViewInfo;

/// Uniform result shape returned by every database engine.
#[derive(Serialize)]
pub struct QueryResult {
    pub columns: Vec<String>,
    pub rows: Vec<serde_json::Value>,
}

#[derive(Serialize)]
pub struct IndexInfo {
    pub name: String,
    pub sql: Option<String>,
}

/// Every engine (SQLite today, PostgreSQL/MySQL later) implements this so the
/// Tauri commands and the UI never need to know which database is open.
pub trait Database: Send {
    fn list_tables(&self) -> Result<Vec<String>, String>;
    fn list_table_indexes(&self, table: &str) -> Result<Vec<IndexInfo>, String>;
    fn list_views(&self) -> Result<Vec<ViewInfo>, String>;
    fn run_query(&self, sql: &str) -> Result<QueryResult, String>;
}
