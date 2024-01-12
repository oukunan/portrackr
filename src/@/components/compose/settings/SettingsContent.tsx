import { useSettings } from "../../../../components/setting";

export default function SettingContent() {
  const {
    enableTerminateProcessWarning: [
      enableTerminateProcessWarning,
      setEnableTerminateProcessWarning,
    ],
  } = useSettings();

  return (
    <div className="items-start flex space-x-2">
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
  );
}
