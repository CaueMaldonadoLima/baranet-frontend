import { APP_VERSION } from "@/config/version";

export function AppVersion() {
  return (
    <span className="text-xs font-semibold text-white p-2">{APP_VERSION}</span>
  );
}
