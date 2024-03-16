use serde::Serialize;
use serde_json;
use std::env;
use std::process::{Command, Stdio};
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    SystemTraySubmenu,
};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[derive(Debug, Serialize, Clone)]
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

fn reuse_get_local_processes() -> Vec<ListeningProcess> {
    let lsof_output = Command::new("lsof")
        .arg("-i")
        .arg("TCP")
        .arg("-sTCP:LISTEN")
        .arg("-P")
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .output()
        .expect("Failed to run lsof command");

    // Convert the output bytes to a string
    let lsof_output_str = String::from_utf8_lossy(&lsof_output.stdout);

    // Filter out lines containing 'LISTEN'
    let filtered_lines: Vec<&str> = lsof_output_str
        .lines()
        .filter(|line| {
            !line.contains("ControlCe") & !line.contains("rapportd") & &!line.contains("COMMAND")
        })
        .collect();

    // Extract relevant information and create ListeningProcess objects
    let listening_processes: Vec<ListeningProcess> = filtered_lines
        .iter()
        .map(|&line| {
            let fields: Vec<&str> = line.split_whitespace().collect();
            ListeningProcess {
                name: fields[0].to_string(),
                pid: fields[1].to_string(),
                port: fields[8]
                    .to_string()
                    .replace("localhost:", "")
                    .replace("*:", ""),
            }
        })
        .collect();

    let mut unique_listening_processes = listening_processes.clone();
    unique_listening_processes.sort_by(|a, b| a.pid.cmp(&b.pid).then_with(|| a.name.cmp(&b.name)));
    unique_listening_processes.dedup_by(|a, b| a.pid == b.pid && a.name == b.name);

    unique_listening_processes
}

#[tauri::command]
fn get_listening_processes() -> String {
    let unique_listening_processes = reuse_get_local_processes();
    // Serialize the vector to a JSON string
    let json_output =
        serde_json::to_string(&unique_listening_processes).expect("Failed to serialize data");

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
        .args(&[
            "-p",
            &pid.to_string(),
            "-o",
            "pcpu,stime,vsz=MEMORY,comm,gid,time",
        ])
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

#[tauri::command]
fn set_tray_menu_activated(app: tauri::AppHandle) {
    let tray_menu = get_tray_menu()
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

    let _ = app.tray_handle().set_menu(tray_menu);
}

#[tauri::command]
fn set_tray_menu_deactivated(app: tauri::AppHandle) {
    let tray_menu = build_tray()
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

    let _ = app.tray_handle().set_menu(tray_menu);
}
// -------------------------------------------------------------------------

fn get_listening_processes_tray() -> Vec<ListeningProcess> {
    let unique_listening_processes = reuse_get_local_processes();
    unique_listening_processes
}

fn build_tray() -> SystemTrayMenu {
    let parent_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("label".to_string(), "Listening Processes").disabled());

    parent_menu
}

fn get_tray_menu() -> SystemTrayMenu {
    let menus: Vec<SystemTraySubmenu> = get_listening_processes_tray()
        .iter()
        .map(|p| {
            let parent_menu = SystemTrayMenu::new().add_item(CustomMenuItem::new(
                p.pid.to_string(),
                "End process".to_string(),
            ));
            SystemTraySubmenu::new(format!("{} · {}", p.port, p.name), parent_menu)
        })
        .collect();

    let mut tray_menu = build_tray();

    for item in &menus {
        tray_menu = tray_menu.add_submenu(item.clone());
    }

    tray_menu
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(move |app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_listening_processes,
            terminate_process_by_id,
            get_process_info_by_id,
            set_tray_menu_activated,
            set_tray_menu_deactivated,
        ])
        .system_tray(SystemTray::new())
        .on_system_tray_event(|_app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    _ => {
                        let result: Result<u32, _> = id.parse();
                        let parsed_id: u32 = match result {
                            Ok(parsed_number) => parsed_number,
                            Err(err) => {
                                println!("Failed to parse: {}", err);
                                // TODO: Looks weird to me 😂
                                0
                            }
                        };

                        let _ = terminate_process_by_id(parsed_id);
                    }
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
