import FeedbackButtonPopover from "../../@/components/compose/FeedbackButtonPopover";
import { useLocation } from "react-router-dom";

export default function LeftPanel() {
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="text-main-foreground h-full flex items-end bg-left-panel-background px-4 py-2 border-r-[1px] border-r-component-border-color">
      <div className="flex-1">
        <FeedbackButtonPopover />
      </div>
    </div>
  );
}
