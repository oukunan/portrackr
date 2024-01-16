use serde::Serialize;
use std::process::{Command, Stdio};
use serde_json;


#[derive(Debug, Serialize)]
struct ListeningProcess {
    pid: String,
    name: String,
    port: String,
}

#[derive(Serialize)]
struct ProcessInfo {
    pcpu: String,
    stime: String,
    vsz: String,
    comm: String,
    gid: String,
    time: String,
}

#[tauri::command]
fn get_listening_processes() -> String {
    let lsof_output = Command::new("lsof")
        .arg("-P")
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
                name: fields[0].to_string(),
                pid: fields[1].to_string(),
                port: fields[8].to_string().replace("localhost:", ""),
            }
        })
        .collect();

    // Serialize the vector to a JSON string
    let json_output =
        serde_json::to_string(&listening_processes).expect("Failed to serialize data");

    json_output
}

#[tauri::command]
fn terminate_process_by_id(pid: u32) -> Result<(), String> {
    let result = Command::new("kill").arg(&pid.to_string()).spawn();

    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Failed to terminate process {}: {}", pid, err)),
    }
}

#[tauri::command]
fn get_process_info_by_id(pid: u32) -> String {
    // Build the command
    let output = Command::new("ps")
        .args(&["-p", &pid.to_string(), "-o", "pcpu,stime,vsz=MEMORY,comm,gid,time"])
        .output()
        .expect("Failed to execute command");

    // Check if the command was successful
    if !output.status.success() {
        return format!("Failed to execute command: {:?}", output);
    }

    // Convert the output to a string
    let output_str = String::from_utf8_lossy(&output.stdout);

    // Parse the output and create a ProcessInfo struct
    let mut lines = output_str.lines();
    if let Some(data_line) = lines.nth(1) {
        let data_parts: Vec<&str> = data_line.split_whitespace().collect();
        let process_info = ProcessInfo {
            pcpu: data_parts[0].to_string(),
            stime: data_parts[1].to_string(),
            vsz: data_parts[2].to_string(),
            comm: data_parts[3].to_string(),
            gid: data_parts[4].to_string(),
            time: data_parts[5].to_string(),
        };

        // Serialize the struct to JSON and return as String
        serde_json::to_string(&process_info).expect("Failed to serialize JSON")
    } else {
        "Invalid output format".to_string()
    }
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_listening_processes,
            terminate_process_by_id,
            get_process_info_by_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
