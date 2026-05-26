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

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function getAccessToken(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting Supabase session:', error);
    return null;
  }

  return data.session?.access_token ?? null;
}

export async function apiClient<T>(p0: RegExp, p1: number, p2: { id: string; }, p3: { requireAuth: boolean; }, endpoint: string, options: ApiClientOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, requireAuth = true } = options;

  const token = requireAuth ? await getAccessToken() : null;

  if (requireAuth && !token) {
    throw new Error('User is not authenticated');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: unknown = null;

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new ApiError(`API request failed with status ${response.status}`, response.status, data);
  }

  return data as T;
}
