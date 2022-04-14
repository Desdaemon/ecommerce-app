/** Utilities for the client only. */

import type { IronSessionOptions } from 'iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

/** Send a JSON-serializable payload to `path`. */
export function fetchJson(path: string, data: any, options: RequestInit = {}) {
  const headers = { ...options.headers, 'content-type': 'application/json' };
  return fetch(path, { ...options, body: JSON.stringify(data), headers });
}
