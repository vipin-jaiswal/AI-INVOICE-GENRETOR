export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
  },
  INVOICE: {
    GET_ALL_INVOICES: `${BASE_URL}/api/invoices`,
    CREATE_INVOICE: `${BASE_URL}/api/invoices`,
    GET_INVOICE: `${BASE_URL}/api/invoices`,
    UPDATE_INVOICE: `${BASE_URL}/api/invoices`,
    DELETE_INVOICE: `${BASE_URL}/api/invoices`,
  },
  AI: {
    GENERATE: `${BASE_URL}/api/ai/generate`,
    GET_DASHBOARD: `${BASE_URL}/api/ai/dashboard-summary`,
  },
};