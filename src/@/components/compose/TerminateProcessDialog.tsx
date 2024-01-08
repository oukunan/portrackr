import { invoke } from "@tauri-apps/api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../@/components/ui/alert-dialog";

import { LocalProcess } from "../../../components/home/Home";
import { Checkbox } from "@radix-ui/react-checkbox";

type Props = {
  selectedProcess: LocalProcess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TerminateProcessDialog(props: Props) {
  const { pid, port } = props.selectedProcess;

  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will terminate process {pid} with port number {port}
            <div className="items-top flex space-x-2">
              <Checkbox id="terms1" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Do not show dialog again in the future
                </label>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              invoke("terminate_process_by_id", {
                pid: Number(pid),
              })
                .then(() => {
                  console.log("Success");
                })
                .catch((e) => {
                  console.log("e: ", e);
                });
            }}
          >
            Terminate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
