import { useEffect, useMemo, useState } from "react";

import { Input } from "../../@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../@/components/ui/select";

import TerminateProcessDialog from "../../@/components/compose/TerminateProcessDialog";
import { convertMSTime } from "../../@/lib/utils";
import SettingsButtonPopover from "../../@/components/compose/settings/SettingsButtonPopover";
import { endProcessById, getRunningLocalhostProcesses } from "../../api";
import { useSettings } from "../setting";

import ProcessInfoSheet from "../../@/components/compose/ProcessInfoSheet";
import ProcessInfoButton from "../../@/components/compose/process-info/ProcessInfoButton";
import ProcessTableRow from "../../@/components/compose/process-table-row/ProcessTableRow";

export type LocalProcess = {
  pid: string;
  name: string;
  port: string;
};

const AUTO_REFRESH_DURATIONS = [
  1000, 2000, 4000, 6000, 8000, 10000, 20000, 30000,
];

export default function Home() {
  const [localProcessList, setLocalProcessList] = useState<LocalProcess[]>([]);
  const [autoRefreshDuration, setAutoRefreshDuration] = useState<number | null>(
    1000
  );

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

  useEffect(() => {
    let id: NodeJS.Timeout | null;

    if (autoRefreshDuration) {
      id = setInterval(() => {
        getRunningLocalhostProcesses().then((deserializedData) => {
          const result = JSON.parse(deserializedData as string);
          setLocalProcessList(result);
        });
      }, autoRefreshDuration);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [autoRefreshDuration]);

  const processToTerminated = localProcessList.find(
    (p) => p.pid === processIdToTerminate
  );

  const processToShowInfo = localProcessList.find(
    (p) => p.pid === processInfoId
  );

  return (
    <div className="h-full bg-[#1C1D26] overflow-y-hidden text-white flex flex-col py-8">
      <div className="pl-6 pr-8 pb-4 flex gap-4 justify-between items-center border-[#242531] border-b-[1px]">
        <div className="flex gap-4 items-center">
          <div>Auto Refresh</div>
          <Select
            onValueChange={(duration) =>
              setAutoRefreshDuration(Number(duration))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="1 second" />
            </SelectTrigger>
            <SelectContent>
              {AUTO_REFRESH_DURATIONS.map((duration) => (
                <SelectItem key={duration} value={String(duration)}>
                  {convertMSTime(duration)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Filter process"
            className="w-[200px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
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
          <div className="absolute top-0 left-0 right-0 px-10 py-2 flex items-center bg-[#1C1D26] border-[#242531] border-b-[1px]">
            <div className="w-[300px] max-w-[300px] mr-8 flex-1 border-r-[1px] border-[#292a38]">
              Process Name
            </div>
            <div className="flex-1 ">Port</div>
            <div className="border-r-[1px] border-[#292a38]"></div>
          </div>
          {/* List container */}
          <div className="pt-[48px] pl-4 pr-8 overflow-y-auto h-[calc(100%-28px)]">
            {localProcessList.length === 0 &&
              !isFilterMode &&
              "No localhost process running..."}

            {isFilterMode &&
              filteredProcessList.length === 0 &&
              "Search result not found "}

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
