import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { supabase } from './supabaseClient';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('Missing EXPO_PUBLIC_API_URL environment variable');
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiClientOptions = {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  requireAuth?: boolean;
};

type BackendError = {
  message: string | string[];
  error: string;
  statusCode: number;
};

export class ApiError extends Error {
  status: number;
  data: BackendError | unknown;

  constructor(message: string, status: number, data: BackendError | unknown) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let accessToken: string | null = null;

supabase.auth.getSession().then(({ data }) => {
  accessToken = data.session?.access_token ?? null;
});

supabase.auth.onAuthStateChange((_event, session) => {
  accessToken = session?.access_token ?? null;
});

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const requireAuth = config.headers?.requireAuth !== 'false';

    if (requireAuth) {
      if (!accessToken) {
        const { data } = await supabase.auth.getSession();

        accessToken = data.session?.access_token ?? null;
      }

      if (!accessToken) {
        throw new ApiError('User is not authenticated', 401, null);
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('[apiClient] Sending token (first 20 chars):', accessToken?.slice(0, 20));
    }

    delete config.headers.requireAuth;

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<BackendError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { data, error: refreshError } = await supabase.auth.refreshSession();

      if (!refreshError && data.session) {
        accessToken = data.session.access_token;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return axiosInstance.request(originalRequest);
      }

      await supabase.auth.signOut();
    }

    const status = error.response?.status ?? 500;

    const data = error.response?.data ?? null;

    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message
        : error.message;

    return Promise.reject(new ApiError(message, status, data));
  },
);

// API CLIENT

export async function apiClient<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, requireAuth = true } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const config: AxiosRequestConfig = {
    url: endpoint,
    method,
    data: body,
    headers: {
      ...headers,
      // For multipart uploads let the native layer set the Content-Type so the
      // proper boundary is included; overrides the JSON instance default.
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      requireAuth: String(requireAuth),
    },
  };

  const response = await axiosInstance.request<T>(config);

  return response.data;
}
