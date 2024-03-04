import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as store from "../../store";
import { useNavigate } from "react-router-dom";
import * as LM from "@lemonsqueezy/lemonsqueezy.js";
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
      LM.lemonSqueezySetup({
        apiKey: import.meta.env.VITE_LEMONSQUEEZY_API_KEY,
      });
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

      const response = await LM.validateLicense(key);

      if (response.error) {
        store.clearLicenseKey();
        return {
          error: true,
          success: false,
          errorMessage: response.data?.error,
        };
      }

      if (
        response.data?.valid &&
        response.data.license_key.status !== "inactive"
      ) {
        store.setLicenseKey(response.data?.license_key.key);

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

    const response = await LM.activateLicense(key, "portrackr");

    if (response.error) {
      store.setLicenseKey("");

      return {
        error: true,
        success: false,
        errorMessage: response.data?.error,
      };
    }

    if (response.data) {
      store.setLicenseKey(response.data.license_key.key);
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

  if (loading) {
    return null;
  }

  return (
    <LicenseKeyContext.Provider value={value}>
      {props.children}
    </LicenseKeyContext.Provider>
  );
};
