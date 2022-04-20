import db, { HttpStatus, secureEndpoint } from '@/lib/server';

const setDefaultPayment = db.prepare<[string, string]>(
  `--sql
  update Buyer set default_card_no = ? where buyer_id = ?`
);

export default secureEndpoint(async (req, res) => {
  if (!(req.session.user && req.body && req.body.cardNo)) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  const { cardNo } = req.body;
  try {
    setDefaultPayment.run(cardNo, req.session.user.userId);
    return res.status(HttpStatus.noContent).end();
  } catch (err) {
    return res.status(HttpStatus.internalError).send(String(err));
  }
});
