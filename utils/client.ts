/** Utilities for the client only. */

/** Send a JSON-serializable payload to `path`. */
export function fetchJson(path: string, data: any, options: RequestInit = {}) {
  const headers = { ...options.headers, 'content-type': 'application/json' };
  return fetch(path, { ...options, body: JSON.stringify(data), headers });
}
