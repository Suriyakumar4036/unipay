
const safeStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
};

const getApiBaseUrl = () => {
  // 1. Check for explicit environment variable (Best for Vercel/Netlify)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // 2. If localhost, use local port 8080
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return "http://localhost:8080";
    }

    // 3. Fallback for Vercel/Netlify if Env Var is missing
    // We default to the standard unipay production tunnel
    if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
      return "https://59a589e349e263.lhr.life";
    }
    
    // 4. Default to same host (for other self-hosted scenarios)
    return `${protocol}//${hostname}:8080`;
  }
  
  return "https://59a589e349e263.lhr.life";
};

export const API_BASE_URL = getApiBaseUrl();

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? safeStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || errorData?.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Fetch failed for ${endpoint}:`, error);
    throw error;
  }
};
