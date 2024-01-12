import React, { useContext, useMemo } from "react";
import useLocalStorage from "../../@/hooks/useLocalStorage";

type StructSettingsContext = {
  enableTerminateProcessWarning: [boolean, React.Dispatch<boolean>];
};

const SettingsContext = React.createContext<StructSettingsContext | null>(null);

export function SettingsProvider(props: React.PropsWithChildren) {
  const enableTerminateProcessWarning = useLocalStorage(
    "enabled-terminate-warning-dialog",
    true
  );

  const value = useMemo(
    () => ({
      enableTerminateProcessWarning,
    }),
    [enableTerminateProcessWarning]
  );

  return (
    <SettingsContext.Provider value={value}>
      {props.children}
    </SettingsContext.Provider>
  );
}

SettingsProvider.displayName = "SettingsProvider";

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("`useSettings` should use inside `SettingsProvider`");
  }

  return context;
}
