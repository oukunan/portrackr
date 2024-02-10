import { useRef, useState } from "react";
import { useLicenseKey } from "./LicenseKeyProvider";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import Loading from "../../@/components/ui/loading";
import ReadyToUseAppDialog from "../../@/components/compose/ReadyToUseAppDialog";

export default function LicenseKeyEntry() {
  const [errorMessage, setErrorMessage] = useState("");
  const [readyToUseAppDialogVisible, setReadyToUseAppDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const errorMessageLabel = useRef<HTMLLabelElement>(null);
  const licenseKeyRef = useRef<HTMLInputElement>(null);

  const { handleActivatedLicenseKey } = useLicenseKey();

  const handleActivateLicenseKey = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setErrorMessage("");

    if (licenseKeyRef.current) {
      setLoading(true);
      let licenseKeyValue = licenseKeyRef.current.value;

      licenseKeyValue = licenseKeyValue.replace(/\s/g, "");

      if (licenseKeyValue === "") {
        setErrorMessage("License key cannot be empty.");
        setLoading(false);
        return;
      }

      try {
        const response = await handleActivatedLicenseKey(licenseKeyValue);

        if (response.error) {
          setErrorMessage(response.errorMessage);
          return;
        }

        setReadyToUseAppDialogVisible(true);
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative h-full text-main-foreground bg-main-background-2 flex justify-center items-center p-10">
      <div className="w-[500px] relative">
        <h1 className="text-7xl font-bold">Portrackr</h1>
        <div className="mt-10">
          <label htmlFor="licenseKeyInput">
            <span className="text-base label-text">
              Please enter your license key
            </span>
          </label>
          <div className="flex gap-4 items-center">
            <Input
              ref={licenseKeyRef}
              type="text"
              id="licenseKeyInput"
              placeholder="License key"
              className="mt-4"
              autoFocus
              disabled={loading}
            />
            {loading && (
              <div className="relative top-[-3.5px]">
                <Loading />
              </div>
            )}
          </div>
        </div>
        {errorMessage && (
          <span ref={errorMessageLabel} className="text-xs my-4 block">
            {errorMessage}
          </span>
        )}
        <div className="flex gap-8 justify-center">
          <Button
            className="btn btn-primary"
            onClick={handleActivateLicenseKey}
            disabled={loading}
          >
            Activate license
          </Button>
        </div>

        <ReadyToUseAppDialog open={readyToUseAppDialogVisible} />
      </div>
    </div>
  );
}
