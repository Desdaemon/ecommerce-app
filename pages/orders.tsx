import OrderItem from '@/components/OrderItem';
import db, { secureSession } from '@/lib/server';
import { PageProps } from '@/lib/types';
import { Center, Stack } from '@mantine/core';

interface OrderPageProps extends PageProps {
  items: Item[];
}

export interface Item {
  qty: number;
  name: string;
  price: number;
  url: string;
  date: string;
}

const listingStmt = db.prepare<[string]>(
  `--sql
  select C.qty, L.name, L.price, LI.url, C.date
  from Purchase C
  inner join Listing L
  on
    L.listing_id = C.listing_id
  left outer join ListingImages LI
  on
    L.listing_id = LI.listing_id
  where C.buyer_id = ?
  order by date asc`
);

export const getServerSideProps = secureSession<OrderPageProps>(async ({ req }) => {
  const user = req.session.user;
  return {
    props: { items: user ? listingStmt.all(user.userId) : [] },
  };
});

export default function CartPage({ items, user }: OrderPageProps) {
  if (!user) return <Center>Log in to view your history orders.</Center>;
  return items.length ? (
    <Stack align="center">{items.map(OrderItem)}</Stack>
  ) : (
    <h1 style={{ textAlign: 'center' }}>{'Your orders history is empty!'}</h1>
  );
}
