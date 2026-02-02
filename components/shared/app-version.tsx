import { APP_VERSION } from "@/config/version";

export function AppVersion() {
  return <span className="text-xs text-muted-foreground">{APP_VERSION}</span>;
}
