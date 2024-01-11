import { invoke } from "@tauri-apps/api";
import { useEffect, useMemo, useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";

import { Input } from "../../@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../@/components/ui/select";

import useLocalStorage from "../../@/hooks/useLocalStorage";
import TerminateProcessDialog from "../../@/components/compose/TerminateProcessDialog";
import { cn, convertMSTime } from "../../@/lib/utils";

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

  const [processIdToTerminate, setProcessIdToTerminate] = useState<
    string | null
  >(null);

  const [enabledTerminatedWarningDialog] = useLocalStorage(
    "enabled-terminate-warning-dialog",
    true
  );

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
        invoke("get_listening_processes").then((deserializedData) => {
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

  return (
    <div className="h-full bg-[#1C1D26] overflow-y-hidden text-white flex flex-col py-8">
      <div className="px-6 mb-3 flex gap-4 justify-between items-center">
        <div className="flex gap-4 items-center">
          <div>Auto Refresh</div>
          <Select
            onValueChange={(updatedDuration) =>
              setAutoRefreshDuration(Number(updatedDuration))
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
        <Input
          type="text"
          placeholder="Filter process"
          className="w-[200px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="relative h-full">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 px-10 py-2 flex items-center bg-[#1C1D26] border-[#242531] border-t-[1px] border-b-[1px]">
          <div className="w-[300px] max-w-[300px] mr-8 flex-1">
            Process Name
          </div>
          <div>Port</div>
          <div></div>
        </div>
        {/* List container */}
        <div className="pt-[48px] px-4 overflow-y-auto h-[calc(100%-36px)]">
          {localProcessList.length === 0 &&
            !isFilterMode &&
            "No localhost process running..."}

          {isFilterMode &&
            filteredProcessList.length === 0 &&
            "Search result not found "}
          {filteredProcessList.map((p, index) => (
            <div
              key={index}
              className={cn("px-6 py-2 flex items-center rounded-md", {
                "bg-[#232531]": index % 2 === 0,
              })}
            >
              <div className="w-[300px] max-w-[300px] truncate mr-8">
                {p.name}
              </div>
              <div className="font-bold flex-1">{p.port}</div>
              <div>
                <div onClick={() => setProcessIdToTerminate(p.pid)}>
                  <TrashIcon />
                </div>
              </div>
            </div>
          ))}
        </div>

        {processToTerminated && (
          <TerminateProcessDialog
            open={!!processIdToTerminate && enabledTerminatedWarningDialog}
            selectedProcess={processToTerminated}
            onOpenChange={(open) => {
              if (!open) {
                setProcessIdToTerminate(null);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
