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
    GET_INVOICE_BY_ID: `${BASE_URL}/api/invoices`,
    GET_INVOICE: `${BASE_URL}/api/invoices`,
    UPDATE_INVOICE: `${BASE_URL}/api/invoices`,
    DELETE_INVOICE: `${BASE_URL}/api/invoices`,
  },
  AI: {
    PARSE_INVOICE_TEXT: `${BASE_URL}/api/ai/parse-invoice-text`,
    GENERATE_REMINDER: `${BASE_URL}/api/ai/generate-reminder`,
    GET_DASHBOARD_SUMMARY: `${BASE_URL}/api/ai/dashboard-summary`,
  },
};