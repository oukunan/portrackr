import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

export default function SearchInput(props: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      <Input {...props} className={cn("pl-9", props.className)} />
      <MagnifyingGlassIcon className="absolute top-3 left-2.5 pointer-events-none" />
    </div>
  );
}
