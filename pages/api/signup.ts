import db, { HttpStatus } from '../../utils/server';
import { Endpoint } from '../../utils/types';

const signup = db
  .prepare<[string, string, string]>(
    `--sql
insert into Buyer(username, email, password) values (?, ?, ?) returning buyer_id`
  )
  .pluck();

const vendorSignup = db
  .prepare<[string, string, string]>(
    `--sql
insert into Vendor(username, email, password) values (?, ?, ?) returning vendor_id`
  )
  .pluck();

export default (function (req, res) {
  if (req.method === 'POST' && req.body.username && req.body.password) {
    const { username, password, email } = req.body;
    const stmt = req.body.vendor == '' ? vendorSignup : signup;
    const userId = stmt.get(username, email, password);
    return userId
      ? res.status(HttpStatus.created).send(userId)
      : res.status(HttpStatus.badRequest).send('Username in use.');
  }
  return res.status(HttpStatus.unprocessableEntity).send('');
} as Endpoint);
