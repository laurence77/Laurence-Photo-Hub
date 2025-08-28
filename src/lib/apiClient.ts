export type ApiOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

function getToken() {
  try { return localStorage.getItem('lph_token') || undefined; } catch { return undefined; }
}

export async function apiFetch<T = unknown>(url: string, opts: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    if (res.status === 401 || res.status === 403) {
      // TODO: trigger global sign-out or refresh token flow
    }
    throw new ApiError(res.status, text || res.statusText);
  }
  const ct = res.headers.get('content-type') || '';
  return (ct.includes('application/json') ? res.json() : (res.text() as any)) as T;
}

