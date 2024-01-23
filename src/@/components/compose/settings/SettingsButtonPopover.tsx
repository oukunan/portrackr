import { MixerHorizontalIcon } from "@radix-ui/react-icons";

import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import SettingContent from "./SettingsContent";

export default function SettingsButtonPopover() {
  return (
    <Popover>
      <Tooltip>
        <PopoverContent className="w-[500px]" align="end">
          <SettingContent />
        </PopoverContent>

        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button className="p-1.5 rounded-md hover:bg-main-background-3">
              <MixerHorizontalIcon width={17} height={17} />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
    </Popover>
  );
}
