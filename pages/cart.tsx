import CartItem from '@/components/CartItem';
import db, { secureSession } from '@/lib/server';
import { PageProps } from '@/lib/types';
import { Button, Center, Stack } from '@mantine/core';
import { useRouter } from 'next/router';

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
  const router = useRouter()
  if (!user) return <Center>Log in to view your shopping cart.</Center>;
  return items.length ? (
    <>
      <Stack align="center">{items.map(CartItem)}</Stack>
      <Button 
        style={{width:"200px", float: "right"}}
        onClick={async () => {
          await fetch("/api/buy");
          router.reload();
        }}
      >
        Buy
      </Button>
    </>
  ) : (
    <h1 style={{ textAlign: 'center'}}>{"Your cart is empty!"}</h1>
  );
}
