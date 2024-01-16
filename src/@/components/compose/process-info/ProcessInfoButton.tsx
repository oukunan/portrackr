import { BorderRightIcon } from "@radix-ui/react-icons";

import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { cn } from "../../../lib/utils";
import React from "react";

export default React.memo(function ProcessInfoButton(props: {
  active: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn("p-1.5 rounded-md hover:bg-[#363a4d]", {
            "bg-[#363a4d]": props.active,
          })}
          onClick={props.onClick}
        >
          <BorderRightIcon width={17} height={17} />
        </button>
      </TooltipTrigger>

      <TooltipContent>Inspector</TooltipContent>
    </Tooltip>
  );
});
