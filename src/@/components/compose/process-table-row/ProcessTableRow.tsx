import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { cn } from "../../../lib/utils";
import { LocalProcess } from "../../../../components/home/Home";
import Highlighter from "react-highlight-words";

type Props = {
  process: LocalProcess;
  onInfoButtonClick: (pid: string) => void;
  onEnterProcessButtonClick: (pid: string) => void;
  query: string;
  isInfoSelected?: boolean;
  isEvenChild: boolean;
};

export default function ProcessTableRow(props: Props) {
  return (
    <div
      className={cn(
        "px-6 py-2 flex items-center rounded-md border-[1.5px] border-transparent",
        {
          "bg-main-background-2": props.isEvenChild,
          "border-component-border-selected bg-component-background-selected":
            props.isInfoSelected,
        }
      )}
    >
      <div className="w-[300px] max-w-[300px] truncate mr-8">
        {props.process.name}
      </div>
      <div className="flex-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="font-semibold"
              href={`http://localhost:${props.process.port}`}
              target="_blank"
            >
              <Highlighter
                searchWords={[props.query]}
                textToHighlight={props.process.port}
              />
            </a>
          </TooltipTrigger>
          <TooltipContent>Open in Browser</TooltipContent>
        </Tooltip>
      </div>

      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-1.5 rounded-md hover:bg-main-background-3"
              onClick={() => {
                props.onInfoButtonClick(props.process.pid);
              }}
            >
              <InfoCircledIcon />
            </button>
          </TooltipTrigger>
          <TooltipContent>View Info</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-1.5 rounded-md hover:bg-main-background-3"
              onClick={() => props.onEnterProcessButtonClick(props.process.pid)}
            >
              <TrashIcon />
            </button>
          </TooltipTrigger>
          <TooltipContent>End process</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
