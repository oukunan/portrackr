import { invoke } from "@tauri-apps/api";

export async function endProcessById(pid: string) {
  return invoke("terminate_process_by_id", {
    pid: Number(pid),
  });
}

export async function getRunningLocalhostProcesses(): Promise<string> {
  return invoke("get_listening_processes");
}
