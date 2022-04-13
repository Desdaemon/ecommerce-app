import { Endpoint } from '../../utils/types';
import db, { HttpStatus } from '../../utils/server';

const login = db
  .prepare<[string, string, string]>(
    `--sql
  select buyer_id from Buyer
  where (email = ? or username = ?) and password = ?`
  )
  .pluck();

const vendorLogin = db
  .prepare<[string, string, string]>(
    `--sql
  select vendor_id from Vendor
  where (email = ? or username = ?) and password = ?`
  )
  .pluck();

export default (function (req, res) {
  if (req.method === 'POST' && req.body && req.body.identity && req.body.password) {
    const stmt = req.query.vendor == '' ? vendorLogin : login;
    const { identity, password } = req.body;
    const userId = stmt.get(identity, identity, password);
    return userId
      ? res.status(HttpStatus.ok).send(userId)
      : res.status(HttpStatus.unauthorized).send('Invalid username, email or password.');
  }
  res.status(HttpStatus.unprocessableEntity).send('');
} as Endpoint);
