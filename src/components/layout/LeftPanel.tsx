import AboutButtonPopover from "../../@/components/compose/AboutButtonPopover";
import FeedbackButtonPopover from "../../@/components/compose/FeedbackButtonPopover";

export default function LeftPanel() {
  return (
    <div className="w-[180px] text-white h-full flex items-end bg-neutral-900 px-4 py-2 border-r-[1px] border-r-[#292a38]">
      <div className="flex-1 flex gap-4">
        <FeedbackButtonPopover />
        <AboutButtonPopover />
      </div>
    </div>
  );
}
