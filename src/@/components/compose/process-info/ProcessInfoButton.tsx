import { BorderRightIcon } from "@radix-ui/react-icons";

import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { cn } from "../../../lib/utils";
import React from "react";

export default React.memo(function ProcessInfoButton(props: {
  active: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn("hover:bg-main-background-3 rounded-md p-1.5", {
            "bg-main-background-3": props.active,
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
