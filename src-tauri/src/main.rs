use std::process::{Command, Stdio};
use serde::Serialize;

#[derive(Debug, Serialize)]
struct ListeningProcess {
    pid: String,
    name: String,
    address: String,
}

#[tauri::command]
fn get_listening_processes() -> String {
    let lsof_output = Command::new("lsof")
        .arg("-n")
        .arg("-i")
        .arg("@localhost")
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .output()
        .expect("Failed to run lsof command");

    // Convert the output bytes to a string
    let lsof_output_str = String::from_utf8_lossy(&lsof_output.stdout);

    // Filter out lines containing 'LISTEN'
    let filtered_lines: Vec<&str> = lsof_output_str
        .lines()
        .filter(|line| line.contains("LISTEN"))
        .collect();

    // Extract relevant information and create ListeningProcess objects
    let listening_processes: Vec<ListeningProcess> = filtered_lines
        .iter()
        .map(|&line| {
            let fields: Vec<&str> = line.split_whitespace().collect();
            ListeningProcess {
                pid: fields[1].to_string(),
                name: fields[0].to_string(),
                address: fields[8].to_string(),
            }
        })
        .collect();

    // Serialize the vector to a JSON string
    let json_output = serde_json::to_string(&listening_processes).expect("Failed to serialize data");

    json_output
}
fn main() {
    tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_listening_processes])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
