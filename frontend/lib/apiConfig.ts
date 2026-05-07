export const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:8000/api/v1/";

export const SOCKET_SERVER_URI =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "http://localhost:8000";

export const normalizeApiUrl = (url: string) => {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
  const path = url.startsWith("/") ? url.slice(1) : url;
  return `${base}${path}`;
};
