use serde::Serialize;
use serde_json;
use std::process::{Command, Stdio};
use std::thread;
use std::time::Duration;
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    SystemTraySubmenu,
};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

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

fn get_listening_processes_tray() -> Vec<ListeningProcess> {
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

    listening_processes
}

fn get_tray_menu() -> SystemTrayMenu {
    let menus: Vec<SystemTraySubmenu> = get_listening_processes_tray()
        .iter()
        .map(|p| {
            let parent_menu = SystemTrayMenu::new().add_item(CustomMenuItem::new(
                p.pid.to_string(),
                "End process".to_string(),
            ));
            SystemTraySubmenu::new(format!("{} - {}", p.port, p.name), parent_menu)
        })
        .collect();

    let mut tray_menu = SystemTrayMenu::new();

    for item in &menus {
        tray_menu = tray_menu.add_submenu(item.clone());
    }

    tray_menu
}

fn main() {
    let tray_menu = get_tray_menu()
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

    let system_tray: SystemTray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .setup(|app| {
            let interval_duration = Duration::from_millis(1000);
            let tray_handle = app.tray_handle();

            thread::spawn(move || {
                loop {
                    let tray_menu = get_tray_menu()
                        .add_native_item(SystemTrayMenuItem::Separator)
                        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));

                    let _ = tray_handle.set_menu(tray_menu);

                    thread::sleep(interval_duration);
                }
            });

            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_listening_processes,
            terminate_process_by_id,
            get_process_info_by_id
        ])
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                let item_handle = app.tray_handle().get_item(&id);
                match id.as_str() {
                    "hide" => {
                        let window = app.get_window("main").unwrap();
                        window.hide().unwrap();
                        // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
                        item_handle.set_title("Show").unwrap();
                    }
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
