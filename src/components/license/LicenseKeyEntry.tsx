import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLicenseKey } from "./LicenseKeyProvider";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import Loading from "../../@/components/ui/loading";

export default function LicenseKeyEntry() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const errorMessageLabel = useRef<HTMLLabelElement>(null);
  const licenseKeyRef = useRef<HTMLInputElement>(null);

  const licenseKey = useLicenseKey();
  const navigate = useNavigate();

  const handleActivateLicenseKey = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setErrorMessage('')
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
        const response =
          await licenseKey.handleActivatedLicenseKey(licenseKeyValue);

        if (response.error) {
          setErrorMessage(response.errorMessage);

          return;
        } else {
          navigate("/app");
        }
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
            <span className="text-base label-text font-semibold">
              Please enter your license key
            </span>
          </label>
          <div className="flex gap-4 items-center">
            <Input
              ref={licenseKeyRef}
              type="text"
              id="licenseKeyInput"
              placeholder="License key"
              className="mt-4 mb-6"
              autoFocus
              disabled={loading}
            />
            {loading && <div className="relative top-[-3.5px]"><Loading /></div>}
          </div>
        </div>
        {errorMessage && (
          <span ref={errorMessageLabel} className="text-xs">
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
      </div>
    </div>
  );
}

const BackgroundImage = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="-300 -1600 2000 1000"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <radialGradient
        id="paint0_radial_37_453-1"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(-3263.486328, -7856.076172, 7260.211426, -3387.916504, 1876.518089, 2755.964111)"
      >
        <stop stopColor="#121821" />
        <stop offset="0.058" stopColor="rgb(0, 123, 247)" />
        <stop offset="0.477" stopColor="rgb(18, 24, 33)" />
        <stop offset="0.66" stopColor="rgb(18, 24, 33)" />
        <stop offset="0.799" stopColor="rgb(0, 58, 117)" />
        <stop offset="0.9427" stopColor="#121821" />
        <stop offset="1" stopColor="#121821" />
      </radialGradient>
      <radialGradient
        id="paint1_radial_37_453-1"
        cx="0.026"
        cy="-0.006"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(3310.750977, 7828.736816, -7357.669922, 3372.537109, 408.732147, -4300.890335)"
        spreadMethod="pad"
      >
        <stop stopColor="#121821" />
        <stop offset="0.244" stopColor="rgb(0, 58, 117)" />
        <stop offset="0.404" stopColor="rgb(18, 23, 33)" />
        <stop offset="0.658" stopColor="#121821" />
        <stop offset="0.7985" stopColor=" #800080" />
        <stop offset="0.9427" stopColor="#121821" />
        <stop offset="1" stopColor="#121821" />
      </radialGradient>
      <radialGradient
        id="paint2_radial_37_453-1"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(3386.762939, 8152.835449, -7534.462402, 3515.893555, 1070.940331, -3765.095612)"
      >
        <stop stopColor="#121821" />
        <stop offset="0.077" stopOpacity="0" stopColor="rgb(0, 169, 248)" />
        <stop offset="0.334" stopColor="rgb(30, 0, 81)" />
        <stop offset="0.658" stopColor="#121821" />
        <stop offset="0.7985" stopColor=" #800080" />
        <stop offset="0.9427" stopColor="#121821" />
        <stop offset="1" stopColor="#121821" />
      </radialGradient>
      <radialGradient
        id="paint3_radial_114_43-1"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(-912.08979, -1741.177694, 3414.045314, -1647.05324, 1043.564644, 661.756181)"
      >
        <stop stopColor="#121821" />
        <stop offset="0.671" stopColor="#121821" />
        <stop offset="1" stopColor="#121821" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint5_radial_114_43-1"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(-1048.316704, 2023.711786, -2209.947787, -1293.527264, 2255.587141, 196.585077)"
      >
        <stop
          offset="0.118"
          stopOpacity="1"
          stopColor="rgba(0, 58, 117, 0.35)"
        />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint6_radial_114_43-1"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(-1525.363418, 1014.434755, -1638.696776, -3343.43538, 2525.144068, 194.285926)"
      >
        <stop stopColor="#121821" />
        <stop offset="0.7894" stopColor="#121821" />
        <stop offset="1" stopColor="#121821" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint4_radial_37_453-1"
        cx="0.141"
        cy="0.054"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(-2735.24888, 4683.762759, -2021.233669, -1299.785608, 3012.869823, -2217.493454)"
      >
        <stop stopColor="#121821" />
        <stop offset="0.155" stopColor="rgb(41, 67, 173)" />
        <stop offset="0.306" stopColor="rgb(24, 28, 49)" />
        <stop offset="0.658" stopColor="#121821" />
        <stop offset="0.796" stopColor="rgb(0, 58, 117)" />
        <stop offset="0.9427" stopColor="#121821" />
        <stop offset="1" stopColor="#121821" />
      </radialGradient>
      <radialGradient
        id="paint4_radial_114_43-1"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(-698.255371, -1268.77002, 2520.687988, -1195.797852, 4415.119125, -1260.562225)"
      >
        <stop stopColor="#121821" />
        <stop offset="0.8229" stopColor="#121821" />
        <stop offset="1" stopColor="#121821" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path
      d="M -2873.103 -254.192 C -3002.625 -309.813 -3050.521 -434.95 -2980.061 -533.696 C -2353.289 -1412.124 -1352.857 -3396.58 -711.504 -3693.826 C 1877.813 -4534.998 6225.036 -3286.564 3653.372 -1819.525 C 1081.706 -352.476 2870.812 354.233 1405.793 1349.624 C -300.643 2509.05 -2298.905 -7.623 -2873.103 -254.192 Z"
      style={{
        strokeMiterlimit: 10.48,
        strokeWidth: "0px",
        transformOrigin: "963.749px -1304.68px",
      }}
      fill="url(#paint0_radial_37_453-1)"
      transform="matrix(1, 0, 0, 1, -784.515930175781, -479.286071777344)"
    />
    <path
      d="M 1253.382 -2977.142 L 2490.873 -2454.374 C 2562.175 -2424.247 2612.334 -2371.738 2627.488 -2311.321 L 2816.716 -1556.984 L 3755.128 -1834.956 C 3830.281 -1857.219 3915.23 -1852.661 3986.546 -1822.534 L 5224.037 -1299.767 C 5355.341 -1244.294 5403.932 -1119.597 5332.551 -1021.237 L 4990.035 -549.275 C 4960.201 -508.17 4912.295 -476.345 4854.448 -459.209 L 3214.004 26.715 L 3544.488 1344.119 C 3556.349 1391.384 3545.882 1440.039 3514.942 1481.573 L 3034.317 2126.417 L 1569.706 1507.698 C 1498.389 1477.574 514.024 -2386.421 543.859 -2427.533 L 886.375 -2899.495 C 957.755 -2997.851 1122.069 -3032.613 1253.382 -2977.142 Z"
      fill="url(#paint1_radial_37_453-1)"
      style={{ transformOrigin: "3293.99px -603.985px" }}
      transform="matrix(1, 0, 0, 1, -784.515930175781, -479.286071777344)"
    />
    <path
      d="M 1935.236 -2386.663 L 3202.048 -1842.686 C 3275.054 -1811.339 3326.377 -1756.666 3341.867 -1693.743 L 3535.337 -908.126 L 4496.227 -1198.051 C 4573.194 -1221.273 4660.168 -1216.56 4733.161 -1185.213 L 5999.973 -641.236 C 6134.402 -583.511 6184.092 -453.651 6110.971 -351.17 L 5760.106 140.56 C 5729.543 183.389 5680.484 216.556 5621.251 234.431 L 3941.504 741.256 L 4279.37 2113.295 C 4291.484 2162.52 4280.763 2213.204 4249.055 2256.476 L 3756.721 2928.338 L 2257.407 2284.516 C 2184.401 2253.168 2133.078 2198.505 2117.588 2135.578 L 1924.131 1349.961 L 963.226 1639.886 C 886.265 1663.108 799.294 1658.391 726.292 1627.043 C 726.292 1627.043 -588.655 1064.625 -300.5 302.856 C -12.343 -458.899 747.032 -66.814 1517.965 -299.422 L 1179.773 -1672.778 C 1167.838 -1721.206 1178.019 -1771.067 1208.582 -1813.9 L 1559.447 -2305.632 C 1632.568 -2408.107 1800.821 -2444.385 1935.236 -2386.663 Z"
      fill="url(#paint2_radial_37_453-1)"
      style={{ transformOrigin: "3272.72px 55.631px" }}
      transform="matrix(1, 0, 0, 1, -784.515930175781, -479.286071777344)"
    />
    <path
      d="M -1425.215 2096.631 L -2153.379 -829.695 L 3309.242 -2449 L 6620.638 2271.442 L -1425.215 2096.631 Z"
      fill="url(#paint3_radial_114_43-1)"
      style={{ transformOrigin: "2492.3px -311.398px" }}
      transform="matrix(1, 0, 0, 1, -784.515930175781, -479.286071777344)"
    />
    <ellipse
      cx="1525.352"
      cy="196.584"
      rx="2075.269"
      ry="2023.713"
      fill="url(#paint5_radial_114_43-1)"
      transform="matrix(0.9997120499610901, 0.02398800291121006, -0.021356001496315002, 0.9997749924659729, 956.2402954101562, 41.52606201171875)"
    />
    <path
      opacity="0.5"
      d="M 4609.257 2799.084 L 2274.556 4271.443 L -758.077 -1137.58 L 2994.769 -4913.82 L 4609.257 2799.084 Z"
      fill="url(#paint6_radial_114_43-1)"
      transform="matrix(1, 0, 0, 1, -784.515930175781, -479.286071777344)"
    />

    <path
      d="M 2595.126 -218.285 L 2020.184 -2349.834 L 8146.561 -6265.677 L 8581.796 -82.748 L 2595.126 -218.285 Z"
      fill="url(#paint4_radial_114_43-1)"
      style={{ transformOrigin: "5318.14px -3243.18px" }}
      transform="matrix(1, 0, 0, 1, -784.515930175781, -479.286071777344)"
    />
  </svg>
);
