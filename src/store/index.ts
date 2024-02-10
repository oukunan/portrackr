import { Store } from "tauri-plugin-store-api";

const PORTRACKR_LICENSE_KEY = "portrackr-license-key";
const store = new Store(".settings.dat");

export const setLicenseKey = (key: string) => {
  try {
    console.log("Setting license key in store: " + key);

    return store.set(PORTRACKR_LICENSE_KEY, key);
  } catch (e) {
    console.error(e);
  }
};

export const getLicenseKey = () => {
  try {
    console.log("Getting license key in store ", store.entries());
    return store.get(PORTRACKR_LICENSE_KEY);
  } catch (e) {
    console.error(e);
  }
};


export const clearLicenseKey = () => {
  try {
    console.log("Clearing license key in store ");
    return store.set(PORTRACKR_LICENSE_KEY, "");
  } catch (e) {
    console.error(e);
  }
}