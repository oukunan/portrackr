import { Link } from "react-router-dom";

export default function LeftPanel() {
  return (
    <div className="w-[150px] h-full flex items-end">
      <div className="flex-1 flex justify-evenly">
        <Link to="/setting">S</Link>
        <Link to="/">H</Link>
        <button>Feedback</button>
      </div>
    </div>
  );
}
