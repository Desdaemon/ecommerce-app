import db, { HttpStatus, secureEndpoint } from '@/lib/server';

const buyNow = ({
  buyer_id,
  listing_id,
  qty,
}: {
  buyer_id: string;
  listing_id: string;
  qty?: number;
}) => db.from('Purchase').insert({ buyer_id, listing_id, qty: qty ?? 1 });

export default secureEndpoint(async (req, res) => {
  if (!(req.session.user && req.body.id)) {
    return res.status(HttpStatus.unprocessableEntity).end();
  }
  const { id, qty } = req.body;
  const { error } = await buyNow({ buyer_id: req.session.user.userId, listing_id: id, qty });

  return error
    ? res.status(HttpStatus.internalError).send(String(error))
    : res.status(HttpStatus.noContent).end();
});
