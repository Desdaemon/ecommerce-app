/** Utilities for the server only. */

import Database from 'better-sqlite3';
import { openSync, readFileSync, closeSync } from 'fs';

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
