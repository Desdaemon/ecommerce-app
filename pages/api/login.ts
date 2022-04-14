import { Endpoint } from '../../lib/types';
import db, { HttpStatus, secureEndpoint } from '../../lib/server';

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

export default secureEndpoint(async (req, res) => {
  if (req.method === 'POST' && req.body && req.body.identity && req.body.password) {
    const stmt = req.query.vendor == '' ? vendorLogin : login;
    const { identity, password } = req.body;
    const userId = stmt.get(identity, identity, password);
    if (userId) {
      req.session.user = { userId };
      await req.session.save();
      return res.status(HttpStatus.ok).send(userId);
    }
    return res.status(HttpStatus.unauthorized).send('Invalid username, email or password.');
  }
  res.status(HttpStatus.unprocessableEntity).send('');
});
