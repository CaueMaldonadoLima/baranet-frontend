export const FEATURE_FLAGS = {
  LOGIN: false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
