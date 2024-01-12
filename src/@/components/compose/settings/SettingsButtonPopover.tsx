import { GearIcon } from "@radix-ui/react-icons";

import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import SettingContent from "./SettingsContent";

export default function SettingsButtonPopover() {
  return (
    <div>
      <Popover>
        <Tooltip>
          <PopoverContent className="w-[400px]">
            <SettingContent />
          </PopoverContent>

          <TooltipTrigger>
            <PopoverTrigger>
              <button className="p-1.5 rounded-md hover:bg-[#363a4d]">
                <GearIcon />
              </button>
            </PopoverTrigger>
          </TooltipTrigger>

          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </Popover>
    </div>
  );
}
