import { useEffect, useMemo, useState } from "react";

import { getProcessInfoById } from "../../../api";
import React from "react";

type Props = {
  pId: string;
  pName: string | undefined;
  pPort: string | undefined;
};

type ProcessInfo = {
  comm: string;
  gid: string;
  pcpu: string;
  stime: string;
  time: string;
  vsz: string;
};

export default React.memo(function ProcessInfoSheet(props: Props) {
  const [processInfo, setProcessInfo] = useState<ProcessInfo | null>(null);

  useEffect(() => {
    if (props.pId) {
      getProcessInfoById(props.pId).then((data: string) => {
        setProcessInfo(JSON.parse(data) as ProcessInfo);
      });
    }
  }, [props.pId]);

  const value = useMemo(
    () => ({
      name: props.pName,
      pid: props.pId,
      port: props.pPort,
      gid: processInfo?.gid,
      stime: processInfo?.stime,
      time: processInfo?.time,
      pcup: processInfo?.pcpu,
      vsz: processInfo?.vsz,
      cmd: processInfo?.comm,
    }),
    [props.pName, props.pId, props.pPort, processInfo]
  );

  const renderContent = () => {
    if (props.pId) {
      return Object.entries(value).map(([key, value]) => {
        return (
          <div key={key} className="flex flex-col justify-between">
            <span>{key}</span>
            <span>{value}</span>
          </div>
        );
      });
    } else {
      return 'Nothing here'
    }
  };

  return (
    <div className="w-[300px] pt-[50px] px-6">
      <div className="flex flex-col gap-2">{renderContent()}</div>
    </div>
  );
});
