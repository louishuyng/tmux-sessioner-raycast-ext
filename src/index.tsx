import { useState, useEffect } from "react";
import { List, Icon, Action, ActionPanel, Toast, showToast } from "@raycast/api";
import { exec, execSync } from "child_process";

const BIN_PATH = "/opt/homebrew/bin/tmux"; // TODO: Make this configurable

function openTerminal() {
  const TERM = "Kitty"; // TODO:; Make this configurable
  execSync(`open -a ${TERM}`);
}

async function switchToSession(session: string) {
  const toast = await showToast({ style: Toast.Style.Animated, title: "Permission Checking" });

  exec(`${BIN_PATH} switch -t ${session}`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);

      toast.style = Toast.Style.Failure;
      toast.title = "No tmux client found 😢";
      toast.message = error.message;

      return;
    }

    try {
      openTerminal();

      toast.style = Toast.Style.Success;
      toast.title = "Switched to session 🎉";
    } catch (e: Error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Terminal not supported 😢";
    }
    return;
  });
}

export default function Command() {
  const [sessions, setSessions] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // List down all tmux session
    exec(`${BIN_PATH} list-sessions | awk '{print $1}' | sed 's/://'`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        setIsLoading(false);
        return;
      }

      const lines = stdout.trim().split("\n");

      if (lines?.length > 0) {
        setSessions(lines);
      }

      setIsLoading(false);
    });
  }, []);

  return (
    <List isLoading={isLoading}>
      {sessions.map((session, index) => (
        <List.Item
          key={index}
          icon={Icon.Terminal}
          title={session}
          actions={
            <ActionPanel>
              <Action title="Switch To Selected Session" onAction={() => switchToSession(session)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
