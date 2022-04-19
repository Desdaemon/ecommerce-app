import CartItem from '@/components/CartItem';
import db, { secureSession } from '@/lib/server';
import { PageProps } from '@/lib/types';
import { Center, Stack } from '@mantine/core';

interface CartPageProps extends PageProps {
  items: CartItem[];
}

export interface CartItem {
  qty: number;
  name: string;
  price: number;
  url: string;
}

const listingStmt = db.prepare<[string]>(
  `--sql
  select C.qty, L.name, L.price, LI.url
  from Purchase C
  inner join Listing L
  on
    L.listing_id = C.listing_id
  left outer join ListingImages LI
  on
    L.listing_id = LI.listing_id
  where C.buyer_id = ? and C.status = 'cart'`
);

export const getServerSideProps = secureSession<CartPageProps>(async ({ req }) => {
  const user = req.session.user;
  return {
    props: { items: user ? listingStmt.all(user.userId) : [] },
  };
});

export default function CartPage({ items, user }: CartPageProps) {
  if (!user) return <Center>Log in to view your shopping cart.</Center>;
  return items.length ? (
    <Stack align="center">{items.map(CartItem)}</Stack>
  ) : (
    'Items added to your cart will show up here.'
  );
}
