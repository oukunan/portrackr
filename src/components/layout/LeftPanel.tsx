import AboutButtonPopover from "../../@/components/compose/AboutButtonPopover";
import FeedbackButtonPopover from "../../@/components/compose/FeedbackButtonPopover";

export default function LeftPanel() {
  return (
    <div className="h-full flex items-end bg-slate-200 px-4 py-2">
      <div className="flex-1 flex gap-4">
        <FeedbackButtonPopover />
        <AboutButtonPopover />
      </div>
    </div>
  );
}
