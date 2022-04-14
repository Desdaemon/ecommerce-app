/** Utilities for the server only. */

import 'dotenv/config';
import Database from 'better-sqlite3';
import { openSync, readFileSync, closeSync } from 'fs';
import { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

const db = process.env.NODE_ENV === 'development' ? prepareDatabase() : Database('database.db');
export default db;

function prepareDatabase(path = 'db/test.db') {
  // Truncate the file to nothing.
  closeSync(openSync(path, 'w'));
  const db = Database(path);
  db.exec(readFileSync('db/schema.sql').toString());
  return db;
}

/** Common HTTP status codes. */
export const enum HttpStatus {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  notFound = 404,
  unprocessableEntity = 422,
  internalError = 500,
  notImplemented = 501,
}

const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'ecommerce-app',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export function secureEndpoint(fn: (req: NextApiRequest, res: NextApiResponse) => any) {
  return withIronSessionApiRoute(fn, sessionOptions);
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      userId: string;
    };
  }
}
