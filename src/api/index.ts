import { invoke } from "@tauri-apps/api";

export async function endProcessById(pid: string): Promise<void> {
  return invoke("terminate_process_by_id", {
    pid: Number(pid),
  });
}

export async function getRunningLocalhostProcesses(): Promise<string> {
  return invoke("get_listening_processes");
}

export async function getProcessInfoById(pid: string): Promise<string> {
  return invoke("get_process_info_by_id", {
    pid: Number(pid),
  });
}

// TODO: Handle if key not activate.
export async function startIntervalUpdateTrayMenu() {
  setInterval(() => {
    invoke("update_tray_menu_activated");
  }, 1000);
}
