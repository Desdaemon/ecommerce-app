/** Utilities for the server only. */

// import Database from 'better-sqlite3';
// import { openSync, closeSync, existsSync } from 'fs';
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
// import schemaFile from '@/db/schema.sql';
// import mockFile from '@/db/mock.sql';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

const supabaseUrl = assertTruthy(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'Missing NEXT_PUBLIC_SUPABASE_URL in .env'
);

const supabaseAnon = assertTruthy(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env'
);

const db = process.env.NODE_ENV === 'development' ? prepareDatabase() : prepareProductionDatabase();
export default db;

function prepareDatabase(path = 'test.db'): SupabaseClient {
  // In development mode, the database connection is renewed everytime which is not
  // ideal. We check if there is already a database in the global scope and return
  // it, otherwise we initialize the database.
  if (global.db_) return global.db_;

  // Truncate the file to nothing.
  // if (path !== ':memory:') closeSync(openSync(path, 'w'));

  // const db = (global.db_ = Database(path));
  // const db = global.db_ =
  // db.exec(schemaFile);
  // db.exec(mockFile);
  return (global.db_ = createClient(supabaseUrl, supabaseAnon));
}

function prepareProductionDatabase(path = 'database.db') {
  return createClient(supabaseUrl, supabaseAnon);
  // const dbpath = process.env.DB || path;
  // const exists = dbpath !== ':memory:' && existsSync(dbpath);
  // const db = Database(dbpath);
  // if (!exists) {
  //   db.exec(schemaFile);
  //   db.exec(mockFile);
  // }
  // return db;
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

export function secureSession<T>(fn: GetServerSideProps<T>): GetServerSideProps<T> {
  return withIronSessionSsr(fn as any, sessionOptions) as any;
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
  var db_: SupabaseClient | undefined;
}
