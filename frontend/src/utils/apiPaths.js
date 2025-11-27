export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
  },
  INVOICES: {
    GET_ALL: `${BASE_URL}/api/invoices`,
    CREATE: `${BASE_URL}/api/invoices/create`,
    GET_ONE: `${BASE_URL}/api/invoices`,
    UPDATE: `${BASE_URL}/api/invoices`,
    DELETE: `${BASE_URL}/api/invoices`,
  },
  AI: {
    GENERATE: `${BASE_URL}/api/ai/generate`,
  },
};