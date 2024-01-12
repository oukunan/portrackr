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
import { endProcessById } from "../../../api";

type Props = {
  selectedProcess: LocalProcess;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TerminateProcessDialog(props: Props) {
  const { pid, port } = props.selectedProcess;

  const handleEndProcess = async (pid: string) => {
    try {
      await endProcessById(pid);
      console.log("Success");
    } catch (err) {
      console.log("e: ", err);
    }
  };

  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-4">
            This action will end process with port number {port}
            <div className="items-center flex space-x-2">
              <input
                type="checkbox"
                id="terms1"
                className="w-4 h-4 border-[1px] border-black rounded-sm"
              />
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
          <AlertDialogAction onClick={() => handleEndProcess(pid)}>
            Terminate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
