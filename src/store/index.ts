import { Store } from "tauri-plugin-store-api";

const PORTRACKR_LICENSE_KEY = "portrackr-license-key";
const store = new Store(".settings.dat");

export const setLicenseKey = (key: string) => {
  try {
    return store.set(PORTRACKR_LICENSE_KEY, key);
  } catch (e) {
    console.error(e);
  }
};

export const getLicenseKey = () => {
  try {
    return store.get<string>(PORTRACKR_LICENSE_KEY);
  } catch (e) {
    console.error(e);
  }
};

export const clearLicenseKey = () => {
  try {
    return store.set(PORTRACKR_LICENSE_KEY, "");
  } catch (e) {
    console.error(e);
  }
};
