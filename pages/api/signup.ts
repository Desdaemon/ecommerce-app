import db, { HttpStatus, secureEndpoint } from '../../lib/server';

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

export default secureEndpoint(async (req, res) => {
  if (req.method === 'POST' && req.body.username && req.body.password) {
    const { username, password, email } = req.body;
    const stmt = req.body.vendor == '' ? vendorSignup : signup;
    const userId = stmt.get(username, email, password);
    if (userId) {
      req.session.user = { userId };
      await req.session.save();
      return res.status(HttpStatus.created).send(userId);
    }
    return res.status(HttpStatus.badRequest).send('Username in use.');
  }
  return res.status(HttpStatus.unprocessableEntity).send('');
});
