import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "../ui/popover";
  
  export default function AboutButtonPopover() {
    return (
      <div>
        <Popover>
          <PopoverTrigger>About</PopoverTrigger>
          <PopoverContent>About content</PopoverContent>
        </Popover>
      </div>
    );
  }
  