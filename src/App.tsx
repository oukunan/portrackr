import { MemoryRouter, Routes, Route } from "react-router-dom";

import Home from "./components/home/Home";
import LeftPanel from "./components/layout/LeftPanel";
import { TooltipProvider } from "./@/components/ui/tooltip";
import { SettingsProvider } from "./components/setting";
import { ThemeProvider } from "./@/components/compose/theme/theme-provider";
import LicenseKeyEntry from "./components/license/LicenseKeyEntry";
import { LicenseKeyProvider } from "./components/license/LicenseKeyProvider";

export default function App() {
  return (
    <MemoryRouter>
      <LicenseKeyProvider>
        <ThemeProvider>
          <SettingsProvider>
            <TooltipProvider>
              <div className="flex h-full">
                <div
                  data-tauri-drag-region
                  className="fixed top-0 left-0 right-0 bg-transparent h-[30px] z-10"
                />
                <LeftPanel />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<LicenseKeyEntry />} />
                    <Route path="/app" element={<Home />} />
                  </Routes>
                </div>
              </div>
            </TooltipProvider>
          </SettingsProvider>
        </ThemeProvider>
      </LicenseKeyProvider>
    </MemoryRouter>
  );
}
