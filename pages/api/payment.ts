import db, { HttpStatus, secureEndpoint } from '@/lib/server';

// const addPayment = db.prepare<[string, string, string, string, string]>(
//   `--sql
//   insert into Payment (buyer_id, name, card_no, expiry, cvc)
//   values(?, ?, ?, ?, ?)`
// );

const addPayment = (payment: {
  buyer_id: string;
  name: string;
  card_no: string;
  expiry: string;
  cvc: string;
}) => db.from('payment').insert(payment);

export default secureEndpoint(async (req, res) => {
  if (
    !(req.session.user && req.body.expiry && req.body.name && req.body.number && req.body.security)
  ) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  const { name, number, expiry, security } = req.body;
  try {
    await addPayment({
      buyer_id: req.session.user.userId,
      name,
      card_no: number,
      expiry,
      cvc: security,
    });
    return res.status(HttpStatus.created).end();
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.internalError).send(String(err));
  }
});
