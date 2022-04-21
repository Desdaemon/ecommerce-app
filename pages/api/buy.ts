import db, { HttpStatus, secureEndpoint } from '@/lib/server';

// const buyStmt = db.prepare<[string]>(
//   `--sql
//   insert into Purchase (buyer_id, listing_id, qty)
//   select buyer_id, listing_id, qty
//   from Cart
//   where buyer_id = ?`
// );
const buyStmt = (buyer_id: string) => db.rpc('buyCart', { buyer_id });

// const emptyStmt = db.prepare<[string]>(
//   `--sql
//   delete from Cart
//   where buyer_id = ?`
// );

export default secureEndpoint(async (req, res) => {
  if (!req.session.user) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  try {
    await buyStmt(req.session.user.userId);
    // buyStmt(req.session.user.userId);
    // emptyStmt.run(req.session.user.userId);
    return res.status(HttpStatus.noContent).end();
  } catch (err) {
    console.error(err);
    return res.status(HttpStatus.internalError).send(String(err));
  }
});
