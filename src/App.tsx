import { MemoryRouter, Routes, Route } from "react-router-dom";

import LeftPanel from "./components/layout/LeftPanel";
import Setting from "./components/setting/Setting";

export default function App() {
  return (
    <MemoryRouter>
      <div className="flex h-full">
        <LeftPanel />
        <div className="flex-1 bg-blue-200">
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
      </div>
    </MemoryRouter>
  );
}
