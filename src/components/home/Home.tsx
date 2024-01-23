import { useEffect, useMemo, useState } from "react";

import TerminateProcessDialog from "../../@/components/compose/TerminateProcessDialog";
import SettingsButtonPopover from "../../@/components/compose/settings/SettingsButtonPopover";
import { endProcessById, getRunningLocalhostProcesses } from "../../api";
import { useSettings } from "../setting";

import ProcessInfoSheet from "../../@/components/compose/ProcessInfoSheet";
import ProcessInfoButton from "../../@/components/compose/process-info/ProcessInfoButton";
import ProcessTableRow from "../../@/components/compose/process-table-row/ProcessTableRow";
import SearchInput from "../../@/components/compose/SearchInput";

export type LocalProcess = {
  pid: string;
  name: string;
  port: string;
};

export default function Home() {
  const [localProcessList, setLocalProcessList] = useState<LocalProcess[]>([]);

  const [processInfoId, setProcessInfoId] = useState("");
  const [processIdToTerminate, setProcessIdToTerminate] = useState<
    string | null
  >(null);

  const [processInfoSidebarVisible, setProcessInfoSidebarVisible] =
    useState(false);

  const {
    enableTerminateProcessWarning: [enableTerminateProcessWarning],
  } = useSettings();

  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    setInterval(() => {
      getRunningLocalhostProcesses().then((serializedData: string) => {
        const result = JSON.parse(serializedData);
        setLocalProcessList(result);
      });
    }, 1000);
  }, []);

  const isFilterMode = query.length > 1;

  const filteredProcessList = useMemo(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      return localProcessList;
    }

    return localProcessList.filter((p) => {
      const regex = new RegExp(trimmedQuery, "ig");
      return regex.test(p.port);
    });
  }, [localProcessList, query]);

  const processToTerminated = localProcessList.find(
    (p) => p.pid === processIdToTerminate
  );

  const processToShowInfo = localProcessList.find(
    (p) => p.pid === processInfoId
  );

  return (
    <div className="h-full bg-main-background overflow-y-hidden text-main-foreground flex flex-col py-8">
      <div className="pl-6 pr-8 pb-4 flex gap-4 justify-between items-center border-component-border-color border-b-[1px]">
        <SearchInput
          type="text"
          placeholder="Filter process"
          className="w-[200px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          <SettingsButtonPopover />
          <ProcessInfoButton
            active={processInfoSidebarVisible}
            onClick={() => {
              if (processInfoId && processInfoSidebarVisible) {
                setProcessInfoId("");
              }

              setProcessInfoSidebarVisible((v) => !v);
            }}
          />
        </div>
      </div>

      <div className="h-full flex">
        <div className="relative h-full flex-1">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 px-10 py-2 flex items-center border-component-border-color border-b-[1px] font-bold">
            <div className="w-[300px] max-w-[300px] mr-10 flex-1 border-r-[1px] border-component-border-color">
              Process Name
            </div>
            <div className="flex-1 ">Port</div>
            <div className="border-r-[1px] border-component-border-color"></div>
          </div>
          {/* List container */}
          <div className="pt-[48px] pl-6 pr-8 overflow-y-auto h-[calc(100%-28px)]">
            {localProcessList.length === 0 && !isFilterMode && (
              <div className="px-4">No localhost process running...</div>
            )}

            {isFilterMode &&
              filteredProcessList.length === 0 &&
              <div className="px-4">Search result not found</div>}

            {filteredProcessList.map((p, index) => (
              <ProcessTableRow
                key={index}
                process={p}
                onInfoButtonClick={(pid: string) => {
                  if (processInfoId === p.pid) {
                    setProcessInfoSidebarVisible(false);
                    setProcessInfoId("");
                  } else {
                    setProcessInfoSidebarVisible(true);
                    setProcessInfoId(pid);
                  }
                }}
                onEnterProcessButtonClick={(pid: string) => {
                  if (!enableTerminateProcessWarning) {
                    endProcessById(p.pid);
                  } else {
                    setProcessIdToTerminate(pid);
                  }
                }}
                isEvenChild={index % 2 === 0}
                isInfoSelected={p.pid === processInfoId}
              />
            ))}
          </div>
        </div>

        {processInfoSidebarVisible && (
          <ProcessInfoSheet
            pId={processInfoId}
            pName={processToShowInfo?.name}
            pPort={processToShowInfo?.port}
          />
        )}
      </div>

      {processToTerminated && (
        <TerminateProcessDialog
          open={!!(processIdToTerminate && enableTerminateProcessWarning)}
          selectedProcess={processToTerminated}
          onOpenChange={(open) => {
            if (!open) {
              setProcessIdToTerminate(null);
            }
          }}
        />
      )}
    </div>
  );
}
