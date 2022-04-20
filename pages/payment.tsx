import PaymentItem from '@/components/PaymentItem';
import db, { secureSession } from '@/lib/server';
import { PageProps } from '@/lib/types';
import { Center, Stack } from '@mantine/core';
import CreditCardForm from '@/components/CreditCardForm';

const payments = db.prepare<[string]>(
  `--sql
  select *, (P.card_no == B.default_card_no) as isDefault
  from Payment P
  inner join Buyer B
  on
    B.buyer_id = P.buyer_id
  where P.buyer_id = ?`
);

interface PaymentPageProps extends PageProps {
  items: any[];
}

export const getServerSideProps = secureSession(async ({ req }) => {
  return {
    props: {
      items: req.session.user ? payments.all(req.session.user.userId) ?? [] : [],
    },
  };
});

export default function PaymentPage({ items, user }: PaymentPageProps) {
  if (!user) return <Center>Log in to view your payment methods.</Center>;
  return items.length ? (
    <Stack align="center">
      <h1>Your payment methods</h1>
      {items.map(PaymentItem)}
    </Stack>
  ) : (
    <CreditCardForm />
  );
}
