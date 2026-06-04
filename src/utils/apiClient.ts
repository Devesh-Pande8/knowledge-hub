export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
) {
  if (typeof window === "undefined") {
    throw new Error("apiCall can only be used in the browser.");
  }

  const DEFAULT_TOKEN_KEY = "token";
  const LEGACY_TOKEN_KEY = "knowledgehub-token";
  const storedToken = localStorage.getItem(DEFAULT_TOKEN_KEY) ?? localStorage.getItem(LEGACY_TOKEN_KEY);

  if (storedToken && !localStorage.getItem(DEFAULT_TOKEN_KEY)) {
    localStorage.setItem(DEFAULT_TOKEN_KEY, storedToken);
  }

  const headers = new Headers();
  if (options.headers) {
    const initialHeaders = new Headers(options.headers);
    initialHeaders.forEach((value, key) => headers.set(key, value));
  }

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (storedToken) {
    headers.set("Authorization", `Bearer ${storedToken}`);
  }

  try {
    return await fetch(endpoint, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error("apiCall fetch error", { endpoint, options, error });
    throw error;
  }
}
