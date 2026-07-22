import { FEATURE_FLAGS, FeatureFlag } from "@/config/feature-flags";

export function isFeatureEnabled(flag: FeatureFlag) {
  return FEATURE_FLAGS[flag];
}
