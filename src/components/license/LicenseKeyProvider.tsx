import { createContext, useCallback, useContext, useEffect } from "react";
import { getLicenseKey, setLicenseKey } from "../../store";
import { useNavigate } from "react-router-dom";

export interface LicenseKeyProviderProps {
  children: React.ReactNode;
}

export interface LicenseKeyProviderValue {
  checkIfLicenseKeyIsActivated: () => Promise<any>;
  handleActivatedLicenseKey: (key: string) => Promise<any>;
}

const LicenseKeyContext = createContext({} as LicenseKeyProviderValue);

export function useLicenseKey() {
  return useContext(LicenseKeyContext);
}

export const LicenseKeyProvider = (props: LicenseKeyProviderProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Provider checking if license key is activated...");
    const call = async () => {
      await checkIfLicenseKeyIsActivated().then((response) => {
        if (response.error) {
          console.log(response.errorMessage);
          navigate("/");
        } else {
          navigate("/app");
        }
      });
    };
    call();
  }, []);

  const checkIfLicenseKeyIsActivated = useCallback(async () => {
    try {
      const key = await getLicenseKey();

      if (!key) {
        return {
          error: true,
          success: false,
          errorMessage: "No License key found.",
        };
      }

      const res = await fetch(import.meta.env.VITE_LEMON_SQUEEZY_VALIDATE_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ license_key: key }),
      });
      const response = await res.json();

      if (response.error) {
        return {
          error: true,
          success: false,
          errorMessage: response.error,
        };
      }

      if (response.valid && response.license_key.status !== "inactive") {
        setLicenseKey(response.license_key.key);

        return {
          error: false,
          success: true,
          errorMessage: "",
        };
      } else {
        return {
          error: true,
          success: false,
          errorMessage:
            "License key is no longer valid or has been deactivate.",
        };
      }
    } catch (e: any) {
      return {
        error: true,
        success: false,
        errorMessage: e.message,
      };
    }
  }, []);

  const handleActivatedLicenseKey = async (key: string) => {
    if (key === "") {
      throw new Error("Please enter a valid license key");
    }

    const res = await fetch(import.meta.env.VITE_LEMON_SQUEEZY_ACTIVATE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ license_key: key, instance_name: "portrackr" }),
    });

    const response = await res.json();

    if (response.error) {
      setLicenseKey("");

      return {
        error: true,
        success: false,
        errorMessage: response.error,
      };
    }

    setLicenseKey(response.license_key.key);

    if (response.activated) {
      return {
        error: false,
        success: true,
        errorMessage: "",
      };
    }

    return {
      error: false,
      success: true,
      errorMessage: "",
    };
  };

  const value = {
    checkIfLicenseKeyIsActivated,
    handleActivatedLicenseKey,
  };

  return (
    <LicenseKeyContext.Provider value={value}>
      {props.children}
    </LicenseKeyContext.Provider>
  );
};
