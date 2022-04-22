import CartItem from '@/components/CartItem';
import db, { secureSession } from '@/lib/server';
import { PageProps } from '@/lib/types';
import { Button, Center, Stack } from '@mantine/core';
import { useRouter } from 'next/router';

interface CartPageProps extends PageProps {
  items: CartItem[];
}

// const listingStmt = db.prepare<[string]>(
//   `--sql
//   select C.qty, L.name, L.price, LI.url,
//          L.listing_id as id
//   from Cart C
//   inner join Listing L
//   on
//     L.listing_id = C.listing_id
//   left outer join ListingImages LI
//   on
//     L.listing_id = LI.listing_id
//   where C.buyer_id = ?`
// );
const getListing = (buyerId: string) =>
  db
    .from('cart')
    .select(
      `qty,
       listing!inner(
        name, price,
        id: listing_id,
        img: listingimages(url)
       )`
    )
    .eq('buyer_id', buyerId);

export interface CartItem {
  qty: number;
  listing: {
    id: string;
    name: string;
    price: number;
    img: { url: string }[];
  };
}

export const getServerSideProps = secureSession<CartPageProps>(async ({ req }) => {
  const user = req.session.user;
  if (!user) return { props: { items: [] } };
  const { data, error } = await getListing(user.userId);
  if (error) console.error(error);
  return { props: { items: error ? [] : data } };
});

export default function CartPage({ items, user }: CartPageProps) {
  const router = useRouter();
  if (!user) return <Center>Log in to view your shopping cart.</Center>;
  return items.length ? (
    <>
      <Stack align="center">{items.map(CartItem)}</Stack>
      <Button
        style={{ width: '200px', float: 'right' }}
        onClick={async () => {
          const res = await fetch('/api/buy');
          if (res.status > 400) {
            console.error(await res.text());
          }
          router.push('/orders');
        }}
      >
        Buy
      </Button>
    </>
  ) : (
    <h1 style={{ textAlign: 'center' }}>{'Your cart is empty!'}</h1>
  );
}
