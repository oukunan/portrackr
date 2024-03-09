import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

export default function ReadyToUseAppDialog(props: { open: boolean }) {
  const navigate = useNavigate();
  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Congratulation</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-4" asChild>
            <div>
              You license key activated successfully
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={async () => {
              navigate("/app");
            }}
          >
            Let's go
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
