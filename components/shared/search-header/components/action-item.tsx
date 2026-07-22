import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const ActionItem = ({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) => {
  return (
    <button
      className={cn(
        "flex items-center gap-2",
        "text-sm text-search-input-border",
        "hover:text-text-search-input-border/90 cursor-pointer",
        "transition-colors hover:bg-gray-200 rounded-md p-2",
        "active:scale-95 transition-transform",
        "select-none",
      )}
    >
      <Icon size={25} />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};

export default ActionItem;
