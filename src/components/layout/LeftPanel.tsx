import FeedbackButtonPopover from "../../@/components/compose/FeedbackButtonPopover";

export default function LeftPanel() {
  return (
    <div className="w-[150px] text-white h-full flex items-end bg-neutral-900 px-4 py-2 border-r-[1px] border-r-[#292a38]">
      <div className="flex-1">
        <FeedbackButtonPopover   />
      </div>
    </div>
  );
}
