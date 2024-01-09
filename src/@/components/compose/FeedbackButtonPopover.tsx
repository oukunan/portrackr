import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

export default function FeedbackButtonPopover() {
  return (
    <div>
      <Popover>
        <PopoverTrigger>Feedback</PopoverTrigger>
        <PopoverContent>Feedback Content</PopoverContent>
      </Popover>
    </div>
  );
}
