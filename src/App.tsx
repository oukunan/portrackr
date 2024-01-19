import { MemoryRouter, Routes, Route } from "react-router-dom";

import Setting from "./components/setting/Setting";
import Home from "./components/home/Home";
import LeftPanel from "./components/layout/LeftPanel";
import { TooltipProvider } from "./@/components/ui/tooltip";
import { SettingsProvider } from "./components/setting";
import { ThemeProvider } from "./@/components/compose/theme/theme-provider";

export default function App() {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <SettingsProvider>
          <TooltipProvider>
            <div className="flex h-full">
              <LeftPanel />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/setting" element={<Setting />} />
                </Routes>
              </div>
            </div>
          </TooltipProvider>
        </SettingsProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}
