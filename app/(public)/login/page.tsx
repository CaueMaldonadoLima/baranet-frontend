import LogInLayout from "@/components/login/layout/login-layout";
import { isFeatureEnabled } from "@/core/feature";

export default function LogInPage() {
  if (!isFeatureEnabled("LOGIN")) {
    return null;
  }

  return <LogInLayout />;
}
