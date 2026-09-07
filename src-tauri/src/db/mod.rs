pub mod sqlite;

use serde::Serialize;

/// Uniform result shape returned by every database engine.
#[derive(Serialize)]
pub struct QueryResult {
    pub columns: Vec<String>,
    pub rows: Vec<serde_json::Value>,
}

/// Every engine (SQLite today, PostgreSQL/MySQL later) implements this so the
/// Tauri commands and the UI never need to know which database is open.
pub trait Database: Send {
    fn list_tables(&self) -> Result<Vec<String>, String>;
    fn run_query(&self, sql: &str) -> Result<QueryResult, String>;
}