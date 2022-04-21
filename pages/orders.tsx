import OrderItem from '@/components/OrderItem';
import db, { secureSession } from '@/lib/server';
import { PageProps } from '@/lib/types';
import { Center, Stack } from '@mantine/core';

interface OrderPageProps extends PageProps {
  items: Item[];
}

export interface Item {
  qty: number;
  date: string;
  listing: {
    name: string;
    price: number;
    img: { url: string }[];
  };
}

// const listingStmt = db.prepare<[string]>(
//   `--sql
//   select C.qty, L.name, L.price, LI.url, C.date
//   from Purchase C
//   inner join Listing L
//   on
//     L.listing_id = C.listing_id
//   left outer join ListingImages LI
//   on
//     L.listing_id = LI.listing_id
//   where C.buyer_id = ?
//   order by date asc`
// );

const getListing = (buyerId: string) =>
  db
    .from('purchase')
    .select(
      `qty, date,
       listing!inner(
         name, price,
         img: listingimages(url)
       )`
    )
    .eq('buyer_id', buyerId)
    .order('date', { ascending: false });

export const getServerSideProps = secureSession<OrderPageProps>(async ({ req }) => {
  const user = req.session.user;
  if (!user) return { props: { items: [] } };
  const { data, error } = await getListing(user.userId);
  return {
    props: { items: error ? [] : data },
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
