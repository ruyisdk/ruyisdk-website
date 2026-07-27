/**
 * RuyiSDK Web Application API Configuration
 */

export const API_BASE_URL = process.env.PUBLIC_API_URL || "https://api.ruyisdk.cn";

export const ENDPOINTS = {
  DASHBOARD: `${API_BASE_URL}/fe/dashboard`,
};

export const REQUEST_CONFIG = {
  DEFAULT_MAX_RETRY_COUNT: 3,
  DEFAULT_RETRY_DELAY_BASE: 1000,
};
