/** Utilities for the client only. */

import type { IronSessionOptions } from 'iron-session';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';

/** Send a JSON-serializable payload to `path`. */
export function fetchJson(path: string, data: any, options: RequestInit = {}) {
  const headers = { ...options.headers, 'content-type': 'application/json' };
  return fetch(path, { ...options, body: JSON.stringify(data), headers });
}

const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'foo-bar-baz',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      userId: string;
    };
  }
}

export function secureEndpoint(fn: (req: NextApiRequest, res: NextApiResponse) => any) {
  return withIronSessionApiRoute(fn, sessionOptions);
}
