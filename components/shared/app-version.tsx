import { APP_VERSION } from "@/config/version";
import { cn } from "@/lib/utils";

interface AppVersionProps {
  className?: string;
}

export function AppVersion({ className }: AppVersionProps) {
  return (
    <span className={cn("text-xs font-semibold text-white p-2", className)}>
      {APP_VERSION}
    </span>
  );
}
