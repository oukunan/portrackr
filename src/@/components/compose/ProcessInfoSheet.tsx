import { useEffect, useMemo, useState } from "react";

import { getProcessInfoById } from "../../../api";
import React from "react";
import { cn } from "../../lib/utils";

type ProcessInfo = {
  comm: string;
  gid: string;
  pcpu: string;
  stime: string;
  time: string;
  vsz: string;
};

type Props = {
  pId: string;
  pName: string | undefined;
  pPort: string | undefined;
};


export default React.memo(function ProcessInfoSheet(props: Props) {
  const [processInfo, setProcessInfo] = useState<ProcessInfo | null>(null);

  useEffect(() => {
    let id: NodeJS.Timeout | null = null;

    setProcessInfo(null);

    if (props.pId) {
      id = setInterval(() => {
        getProcessInfoById(props.pId).then((data: string) => {
          setProcessInfo(JSON.parse(data) as ProcessInfo);
        });
      }, 1000);
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [props.pId]);

  const value = useMemo(
    () => ({
      "Process ID": props.pId,
      "Name": props.pName,
      "Port": props.pPort,
      // "Effective Group ID": processInfo?.gid,
      "Start Time": processInfo?.stime,
      "CPU time": processInfo?.time,
      // "Ratio of CPU time used to CPU time": processInfo?.pcpu,
      // "Amount of (virtual) memory": `${processInfo?.vsz} kilobytes`,
      Command: processInfo?.comm,
    }),
    [props.pName, props.pId, props.pPort, processInfo]
  );

  const renderContent = () => {
    if (props.pId) {
      return Object.entries(value).map(([key, value]) => (
        <div key={key} className="flex gap-1 flex-col justify-between">
          <span className="font-bold text-accent-foreground">{key}</span>
          <span
            className={cn({ "h-[18px] bg-main-background-3 rounded-md": !processInfo })}
          >
            {processInfo ? value : ""}
          </span>
        </div>
      ));
    } else {
      return "Nothing here";
    }
  };

  return (
    <div className="text-sm w-[320px] pt-[50px] px-6">
      <div className="flex flex-col gap-4 bg-main-background-2 px-6 py-7 rounded-md">
        {renderContent()}
      </div>
    </div>
  );
});
