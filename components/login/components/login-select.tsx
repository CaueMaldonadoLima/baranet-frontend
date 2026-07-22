import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export const LogInSelect = () => {
  const selectItemClasses = "focus:bg-login-input-ring/90 focus:text-white";
  return (
    <Select>
      <SelectTrigger
        className={cn(
          "rounded-full data-[size=default]:h-11.5 h-11.5 data-[size=default]:w-[69.4%]",
          "w-45 focus-visible:border-login-input-ring focus-visible:ring-login-input-ring/50",
        )}
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className={selectItemClasses} value="light">
          Light
        </SelectItem>
        <SelectItem className={selectItemClasses} value="dark">
          Dark
        </SelectItem>
        <SelectItem className={selectItemClasses} value="system">
          System
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
