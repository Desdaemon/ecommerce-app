import db, { HttpStatus, secureEndpoint } from '../../lib/server';
import { Signup } from '../../lib/types';

const signup = db.prepare<[string, string, string]>(
  `--sql
insert into Buyer(username, email, password) values (?, ?, ?) returning buyer_id as userId, username`
);

const vendorSignup = db.prepare<[string, string, string]>(
  `--sql
insert into Vendor(username, email, password) values (?, ?, ?) returning vendor_id as userId, username`
);

export default secureEndpoint(async (req, res) => {
  if (!(req.method === 'POST' && req.body.username && req.body.password && req.body.email)) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  const { username, password, email } = req.body as Signup;
  const stmt = req.body.type == 'vendor' ? vendorSignup : signup;
  try {
    const userId = stmt.get(username, email, password);
    if (!userId) return res.status(HttpStatus.badRequest).send('Failed to create user.');

    req.session.user = userId;
    await req.session.save();
    return res.status(HttpStatus.created).end();
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('UNIQUE')) {
      return res.status(HttpStatus.unprocessableEntity).send('Username in use.');
    }
    return res.status(HttpStatus.internalError).send(String(err));
  }
});
