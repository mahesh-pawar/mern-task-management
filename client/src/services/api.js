import axios from 'axios';

// In development Vite proxies /api to the server; in production a rewrite
// does the same, so the auth cookie is always first-party.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Error shape used across the app, mirroring the API envelope:
// { status, code, message, fieldErrors: { [field]: message } }
export class ApiError extends Error {
  constructor({ status, code, message, errors }) {
    super(message);
    this.status = status;
    this.code = code;
    this.fieldErrors = Object.fromEntries((errors || []).map((e) => [e.field, e.message]));
  }
}

let unauthorizedHandler = null;

// AuthProvider registers a callback so an expired session anywhere logs the user out.
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new ApiError({ status: 0, code: 'NETWORK_ERROR', message: 'Unable to reach the server. Please check your connection.' }),
      );
    }

    const { status, data } = error.response;
    const isAuthCall = error.config?.url?.startsWith('/auth/');
    if (status === 401 && !isAuthCall && unauthorizedHandler) {
      unauthorizedHandler();
    }

    return Promise.reject(
      new ApiError({
        status,
        code: data?.code || 'UNKNOWN_ERROR',
        message: data?.message || 'Something went wrong. Please try again.',
        errors: data?.errors,
      }),
    );
  },
);

export default api;
