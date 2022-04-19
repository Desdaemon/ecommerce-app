import db, { HttpStatus, secureEndpoint } from '@/lib/server';

const addPayment = db.prepare<[string, string, string, string, string]>(
  `--sql
  insert into Payment (buyer_id, name, card_no, expiry, cvc)
  values(?, ?, ?, ?, ?)`
);

export default secureEndpoint(async (req, res) => {
  if (
    !(req.session.user && req.body.expiry && req.body.name && req.body.number && req.body.security)
  ) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  const { name, number, expiry, security } = req.body;
  try {
    addPayment.run(req.session.user.userId, name, number, expiry, security);
    return res.status(HttpStatus.created).end();
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.internalError).send(String(err));
  }
});
