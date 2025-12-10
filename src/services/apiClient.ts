const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://hok-db.vercel.app/api';

const getAccessToken = () => {
  try {
    const stored = localStorage.getItem('hok_session');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed.token as string | null;
  } catch (error) {
    console.error('Failed to read stored session', error);
    return null;
  }
};

interface RequestOptions extends RequestInit {
  isFormData?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { isFormData, headers, ...rest } = options;
  const token = getAccessToken();
  const mergedHeaders: Record<string, string> = {};

  if (!isFormData) {
    mergedHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    mergedHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...mergedHeaders,
      ...(headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    // No content
    return null as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  const text = await response.text();
  return text as unknown as T;
}

export { BASE_URL };
