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
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let accessToken: string | null = null;

const retriedRequests = new WeakSet<object>();

const getErrorMessage = (responseData: unknown, fallbackMessage: string): string => {
  if (typeof responseData !== 'object' || responseData === null || !('message' in responseData)) {
    return fallbackMessage;
  }

  const { message } = responseData;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return String(message);
};

supabase.auth
  .getSession()
  .then(({ data }) => {
    accessToken = data.session?.access_token ?? null;
  })
  .catch((error: unknown) => {
    console.error('Error getting initial Supabase session:', error);
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
    }

    delete config.headers.requireAuth;

    return config;
  },
  (error: unknown) => {
    throw error;
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<BackendError>) => {
    const originalRequest = error.config;

    const wasRetried = originalRequest !== undefined && retriedRequests.has(originalRequest);

    if (error.response?.status === 401 && originalRequest && !wasRetried) {
      retriedRequests.add(originalRequest);

      const { data, error: refreshError } = await supabase.auth.refreshSession();

      if (!refreshError && data.session) {
        accessToken = data.session.access_token;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance.request(originalRequest);
      }

      await supabase.auth.signOut();
    }

    const status = error.response?.status ?? 500;
    const responseData: unknown = error.response?.data ?? null;

    const message = getErrorMessage(responseData, error.message);

    throw new ApiError(message, status, responseData);
  },
);

export async function apiClient<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, requireAuth = true } = options;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const config: AxiosRequestConfig = {
    url: endpoint,
    method,
    data: body,
    headers: {
      ...headers,
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      requireAuth: String(requireAuth),
    },
  };

  const response = await axiosInstance.request<T>(config);

  return response.data;
}
