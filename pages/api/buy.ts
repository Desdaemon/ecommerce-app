import db, { HttpStatus, secureEndpoint } from '@/lib/server';

const buyStmt = db.prepare<[string]>(
  `--sql
  update Purchase
  set
    status = 'order',
    order_date = current_timestamp
  where buyer_id = ? and status = 'cart'`
);

export default secureEndpoint(async (req, res) => {
  if (!req.session.user) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  try {
    buyStmt.run(req.session.user.userId);
    return res.status(HttpStatus.noContent).end();
  } catch (err) {
    return res.status(HttpStatus.internalError).send(String(err));
  }
});
