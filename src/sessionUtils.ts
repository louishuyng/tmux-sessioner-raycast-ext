import { ChildProcess, exec, ExecException } from "child_process";
import { env } from "./config";

export function getAllSession(
  callback: (error: ExecException | null, stdout: string, stderr: string) => void
): ChildProcess {
  return exec(`tmux list-sessions | awk '{print $1}' | sed 's/://'`, { env }, callback);
}

export function creatNewSession(
  sessionName: string,
  callback: (error: ExecException | null, stdout: string, stderr: string) => void
): ChildProcess {
  return exec(`tmux new-session -d -s ${sessionName}`, { env }, callback);
}
