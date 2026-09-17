mod db;

use std::sync::Mutex;

use tauri::State;

use db::sqlite::SqliteDatabase;
use db::Database;
    
/// Holds the currently-open database as a boxed engine behind the `Database`
/// trait so commands stay engine-agnostic (SQLite today, PG/MySQL later).
struct DbState(Mutex<Option<Box<dyn Database>>>);

#[tauri::command]
fn open_sqlite_database(path: String, state: State<DbState>) -> Result<(), String> {
    let database = SqliteDatabase::open(&path)?;
    let mut guard = state.0.lock().unwrap();
    *guard = Some(Box::new(database));
    Ok(())
}

#[tauri::command]
fn list_tables(state: State<DbState>) -> Result<Vec<String>, String> {
    let guard = state.0.lock().unwrap();
    let database = guard.as_ref().ok_or("No database open")?;
    database.list_tables()
}

#[tauri::command]
fn list_table_indexes(table: String, state: State<DbState>) -> Result<Vec<db::IndexInfo>, String> {
    let guard = state.0.lock().unwrap();
    let database = guard.as_ref().ok_or("No database open")?;
    database.list_table_indexes(&table)
}

#[tauri::command]
fn run_query(sql: String, state: State<DbState>) -> Result<db::QueryResult, String> {
    let guard = state.0.lock().unwrap();
    let database = guard.as_ref().ok_or("No database open")?;
    database.run_query(&sql)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(DbState(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            open_sqlite_database,
            list_tables,
            list_table_indexes,
            run_query
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
