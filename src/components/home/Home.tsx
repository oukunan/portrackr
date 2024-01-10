import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";

import { Input } from "../../@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../@/components/ui/select";

import useLocalStorage from "../../@/hooks/useLocalStorage";
import TerminateProcessDialog from "../../@/components/compose/TerminateProcessDialog";
import { cn } from "../../@/lib/utils";

export type LocalProcess = {
  pid: string;
  name: string;
  port: string;
};

const AUTO_REFRESH_DURATIONS = [
  1000, 2000, 4000, 6000, 8000, 10000, 20000, 30000, 60000,
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
    <div className="h-full bg-[#1C1D26] text-white">

      <div className="px-6 pt-6 flex gap-4 justify-between items-center">
        <div className="flex gap-4 items-center">
          <div>Auto Refresh</div>
          <Select
            onValueChange={(updatedDuration) =>
              setAutoRefreshDuration(Number(updatedDuration))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="1 second"/>
            </SelectTrigger>
            <SelectContent>
              {AUTO_REFRESH_DURATIONS.map((duration) => (
                <SelectItem key={duration} value={String(duration)}>
                  {duration}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input type="text" placeholder="Filter process" className="w-[200px]"/>
      </div>


      <Table>
        <TableHeader>
          <TableRow className="border-[#242531]">
            <TableHead>Process Name</TableHead>
            <TableHead>Port</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <div className="h-[8px]" />
        <TableBody>
          {localProcessList.length === 0 && "No localhost process running..."}
          {localProcessList.map((p, index) => (
            <TableRow
              key={p.pid}
              className={cn({ "bg-[#232531]": index % 2 === 0 })}
            >
              <TableCell className="rounded-l-lg">{p.name}</TableCell>
              <TableCell className="font-bold">{p.port}</TableCell>
              <TableCell className="rounded-r-lg">
                <div onClick={() => setProcessIdToTerminate(p.pid)}>
                  <TrashIcon />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
  );
}
