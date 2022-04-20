/** Utilities for the server only. */

import Database from 'better-sqlite3';
import { openSync, readFileSync, closeSync, existsSync } from 'fs';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { UserSession } from './types';
import { IronSessionOptions } from 'iron-session';
import { assertTruthy } from './common';

const schemaPath = process.env.SCHEMA || 'db/schema.sql';
const db = process.env.NODE_ENV === 'development' ? prepareDatabase() : prepareProductionDatabase();
export default db;

function prepareDatabase(path = 'test.db'): Database.Database {
  // In development mode, the database connection is renewed everytime which is not
  // ideal. We check if there is already a database in the global scope and return
  // it, otherwise we initialize the database.
  if (global.db_) return global.db_;

  // Truncate the file to nothing.
  if (path !== ':memory:') closeSync(openSync(path, 'w'));

  const db = (global.db_ = Database(path));
  for (const path of [schemaPath, 'db/mock.sql']) {
    db.exec(readFileSync(path).toString());
  }
  return db;
}

function prepareProductionDatabase(path = 'database.db') {
  const dbpath = process.env.DB || path;
  const exists = existsSync(dbpath);
  const db = Database(dbpath);
  if (!exists) {
    db.exec(readFileSync(schemaPath).toString());
  }
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
  password: assertTruthy(
    process.env.SECRET_COOKIE_PASSWORD,
    'Secret password not found, make sure the line "SECRET_COOKIE_PASSWORD=.." is in your .env file.'
  ),
  cookieName: 'ecommerce-app',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

/** Wrap a handler to enable setting and accessing {@link NextApiRequest.session}. */
export function secureEndpoint<T = any>(fn: (req: NextApiRequest, res: NextApiResponse<T>) => any) {
  return withIronSessionApiRoute(fn, sessionOptions);
}

export function secureSession<T>(fn: GetServerSideProps<T>) {
  return withIronSessionSsr(fn as any, sessionOptions);
}

export function redirectTo(
  paths: Record<string, (_: GetServerSidePropsContext) => boolean>,
  fn: GetServerSideProps
): GetServerSideProps {
  return async (ctx) => {
    for (const [redirect, pred] of Object.entries(paths)) {
      if (pred(ctx)) return { redirect, props: {} };
    }
    return fn(ctx);
  };
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: UserSession | null;
  }
}

declare global {
  var db_: Database.Database | undefined;
}
