import db, { HttpStatus, secureEndpoint } from '@/lib/server';

const buyNow = db.prepare<[string, string, number]>(
  `--sql
  insert into Purchase (buyer_id, listing_id, qty)
  values (?, ?, ?)`
);

export default secureEndpoint(async (req, res) => {
  if (!(req.session.user && req.body.id)) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  const { id, qty } = req.body;
  try {
    buyNow.run(req.session.user.userId, id, qty ?? 1);
    return res.status(HttpStatus.noContent).end();
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.internalError).send(String(err));
  }
});
