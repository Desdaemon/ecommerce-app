import db, { HttpStatus, secureEndpoint } from '@/lib/server';

// const upsertCart = db.prepare<{ buyerId: string; listingId: string; qty: number }>(
//   `--sql
//   insert into Cart (buyer_id, listing_id, qty)
//     values (@buyerId, @listingId, @qty)
//   on conflict (buyer_id, listing_id) do
//     update set qty = qty + @qty
//   `
// );

const upsertCart = (buyer_id: string, listing_id: string, qty?: number) =>
  db.from('Cart').upsert(
    { buyer_id, listing_id, qty: qty ?? 1 },
    {
      onConflict: 'update set qty = qty + @qty',
    }
  );

// const removeCart = db.prepare<[string, string]>(
//   `--sql
//   delete from Cart where buyer_id = ? and listing_id = ?`
// );

const removeCart = (buyer_id: string, listing_id: string) =>
  db.from('Cart').delete().eq('buyer_id', buyer_id).eq('listing_id', listing_id);

export default secureEndpoint(async (req, res) => {
  const user = req.session.user;
  if (!(user && req.body.id)) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  const { id, qty } = req.body;
  try {
    switch (req.method) {
      case 'POST':
        await upsertCart(user.userId, id, qty);
        return res.status(HttpStatus.created).end();

      case 'DELETE':
        await removeCart(user.userId, id);
        return res.status(HttpStatus.noContent).end();

      default:
        return res.status(HttpStatus.unprocessableEntity).send(`Method not allowed: ${req.method}`);
    }
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.internalError).send(String(err));
  }
});
