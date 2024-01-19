import { cn } from "../../../lib/utils";
import { Theme, useTheme } from "./theme-provider";
import { CheckIcon } from "@radix-ui/react-icons";

type ThemeToggleVisualProps = {
  theme: Theme;
};

const themeMapper = {
    'dark': 'Dark',
    'light': 'Light',
    'system': "System"
}

export default function ThemeToggleVisual(props: ThemeToggleVisualProps) {
  const { theme, setTheme } = useTheme();

  const upperTheme = themeMapper[props.theme]

  return (
    <div className="cursor-pointer" onClick={() => setTheme(props.theme)}>
      <div
        className={cn(
          "relative border-[3px] border-transparent border-solid rounded-md w-[130px] h-[90px] mb-2",
          {
            "bg-slate-800": props.theme === "dark",
            "bg-slate-300": props.theme === "light" || props.theme === "system",
            "border-blue-500": theme === props.theme
          }
        )}
      >
        <div
          className={cn(
            "p-4 border-l-[1px] border-t-[1px] border-transparent border-solid w-[100px] h-[60px] absolute right-0 bottom-0 rounded-md",
            {
              "bg-slate-700":
                props.theme === "dark" || props.theme === "system",
              "bg-white text-gray-900": props.theme === "light",
            }
          )}
        >
          Aa
        </div>
        {theme === props.theme && (
          <CheckIcon
            className="bg-blue-500 absolute bottom-2 right-2 rounded-full p-1"
            width={20}
            height={20}
          />
        )}
      </div>
      <div className="text-center">{upperTheme}</div>
    </div>
  );
}
