import { useSettings } from "../../../../components/setting";
import { GearIcon, MagicWandIcon } from "@radix-ui/react-icons";
import ThemeToggleVisual from "../theme/ThemeToggleVisual";

export default function SettingContent() {
  const {
    enableTerminateProcessWarning: [
      enableTerminateProcessWarning,
      setEnableTerminateProcessWarning,
    ],
  } = useSettings();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="font-bold flex gap-2 items-center">
          <GearIcon />
          General
        </h3>
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="terminateProcessWarningDialog"
            className="w-4 h-4 border-[1px] border-black rounded-sm"
            onChange={() =>
              setEnableTerminateProcessWarning(!enableTerminateProcessWarning)
            }
            checked={enableTerminateProcessWarning}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terminateProcessWarningDialog"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
            >
              Warning dialog when terminate process
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="font-bold  flex gap-2 items-center">
          <MagicWandIcon />
          Appearance
        </h3>
        <div className="flex gap-4">
          <ThemeToggleVisual theme="dark" />
          <ThemeToggleVisual theme="light" />
          <ThemeToggleVisual theme="system" />
        </div>
      </div>
    </div>
  );
}
