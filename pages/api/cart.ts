import db, { HttpStatus, secureEndpoint } from '@/lib/server';

const upsertCart = db.prepare<{ buyerId: string; listingId: string; qty: number }>(
  `--sql
  insert into Cart (buyer_id, listing_id, qty)
    values (@buyerId, @listingId, @qty)
  on conflict (buyer_id, listing_id) do
    update set qty = qty + @qty
  `
);

const removeCart = db.prepare<[string, string]>(
  `--sql
  delete from Cart where buyer_id = ? and listing_id = ?`
);

export default secureEndpoint(async (req, res) => {
  const user = req.session.user;
  if (!(user && req.body.id)) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  const { id, qty } = req.body;
  try {
    switch (req.method) {
      case 'POST':
        upsertCart.run({ buyerId: user.userId, listingId: id, qty: qty ?? 1 });
        return res.status(HttpStatus.created).end();

      case 'DELETE':
        removeCart.run(user.userId, id);
        return res.status(HttpStatus.noContent).end();

      default:
        return res.status(HttpStatus.unprocessableEntity).send(`Method not allowed: ${req.method}`);
    }
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.internalError).send(String(err));
  }
});
