import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as store from "../../store";
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyLicense = async () => {
      await checkIfLicenseKeyIsActivated().then((response) => {
        setLoading(false);

        if (response.error) {
          console.error(response.errorMessage);
          navigate("/");
        } else {
          navigate("/app");
        }
      });
    };

    verifyLicense();
  }, []);

  const checkIfLicenseKeyIsActivated = useCallback(async () => {
    try {
      const key = await store.getLicenseKey();

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
        store.clearLicenseKey();
        return {
          error: true,
          success: false,
          errorMessage: response.error,
        };
      }

      if (response.valid && response.license_key.status !== "inactive") {
        store.setLicenseKey(response.license_key.key);

        return {
          error: false,
          success: true,
          errorMessage: "",
        };
      } else {
        store.clearLicenseKey();
        return {
          error: true,
          success: false,
          errorMessage:
            "License key is no longer valid or has been deactivate.",
        };
      }
    } catch (e: any) {
      store.clearLicenseKey();
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
      store.setLicenseKey("");

      return {
        error: true,
        success: false,
        errorMessage: response.error,
      };
    }

    store.setLicenseKey(response.license_key.key);
    console.log("✅ Set done....", response.license_key);

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

  if (loading) {
    return null;
  }

  return (
    <LicenseKeyContext.Provider value={value}>
      {props.children}
    </LicenseKeyContext.Provider>
  );
};
