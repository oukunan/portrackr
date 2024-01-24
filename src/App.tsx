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
              <div
                data-tauri-drag-region
                className="fixed top-0 left-0 right-0 bg-transparent h-[30px]"
              />
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
