import db, { HttpStatus, secureEndpoint } from '@/lib/server';

const upsertCart = db.prepare<{ buyerId: string; listingId: string; qty: number }>(
  `--sql
  insert into Cart (buyer_id, listing_id, qty)
    values (@buyerId, @listingId, @qty)
  on conflict (buyer_id, listing_id) do
    update set qty = qty + @qty
  `
);

export default secureEndpoint(async (req, res) => {
  const user = req.session.user;
  if (!(user && req.method === 'POST' && req.body.id)) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  const { id, qty } = req.body;
  try {
    upsertCart.run({ buyerId: user.userId, listingId: id, qty: qty ?? 1 });
    return res.status(HttpStatus.created).end();
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.internalError).send(String(err));
  }
});
