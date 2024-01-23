import { getVersion } from '@tauri-apps/api/app';
import FeedbackButtonPopover from "../../@/components/compose/FeedbackButtonPopover";
import { useEffect, useState } from "react";

export default function LeftPanel() {
  const [appVersion, setAppVersion] = useState("");

  useEffect(() => {
    getVersion().then((version) => {
      setAppVersion(version);
    });
  }, []);

  return (
    <div className="w-[150px] text-main-foreground h-full flex items-end bg-left-panel-background px-4 py-2 border-r-[1px] border-r-component-border-color">
      <div className="flex-1">
        <div>{appVersion}</div>
        <FeedbackButtonPopover />
      </div>
    </div>
  );
}
