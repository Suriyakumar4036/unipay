const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // If we're on a tunnel or local IP, assume the backend is on the same host but port 8080
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      // Handle potential HTTPS tunnels (like localtunnel)
      if (hostname.includes('.loca.lt') || hostname.includes('.ngrok')) {
        // Most tunnels for frontend don't have a corresponding backend tunnel automatically
        // unless configured. We'll default to the same protocol/host but try to be smart.
        console.warn('Running on a tunnel. Ensure NEXT_PUBLIC_API_URL is set if backend is on a separate tunnel.');
      }
      return `${protocol}//${hostname}:8080`;
    }
  }
  
  return "http://localhost:8080";
};

export const API_BASE_URL = getApiBaseUrl();

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Debug log to help identify token issues (visible in browser console)
  if (!token && !endpoint.includes('/auth/')) {
    console.warn(`No token found in localStorage for authenticated request to: ${endpoint}`);
  }

  // Create a plain headers object for better compatibility
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  };

  // Add token if it exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge with any custom headers from options
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

  // Debug log for headers (visible in browser console for subagent)
  console.log(`[API Request] ${options.method || 'GET'} ${endpoint}`, {
    hasToken: !!token,
    authHeader: headers['Authorization'] ? 'Bearer [HIDDEN]' : 'MISSING',
    allHeaders: Object.keys(headers)
  });

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


