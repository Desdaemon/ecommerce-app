import { Card, Image, Center, Text, Space, Group, Button, Stack } from '@mantine/core';
import type { GetStaticPaths, GetStaticProps } from 'next';
import db from '@/lib/server';
import { PageProps } from '@/lib/types';
import { fetchJson, useFlags } from '@/lib/client';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';

export interface ListingInfo {
  name: string;
  price: number;
  description: string;
  id: string;
  img: { link?: string }[];
}

interface ListingProps extends PageProps {
  info: ListingInfo;
}

// const listingStmt = db.prepare<[listingId: string]>(
//   `--sql
//     select L.name, L.description, L.price,
//            LI.url as link,
//            L.listing_id as id
//     from Listing L
//     left outer join ListingImages LI
//     on
//       L.listing_id = LI.listing_id
//     where L.listing_id = ?`
// );

const getListing = (listingId: string) =>
  db
    .from('Listing')
    .select(
      `name, description, price,
       id: listing_id,
       img: ListingImages(link: url)`
    )
    .eq('listing_id', listingId)
    .single();

// const listingIdsStmt = db
//   .prepare<[]>(
//     `--sql
//     select listing_id as id
//     from Listing`
//   )
//   .pluck();

async function getListingIds() {
  const { data, error } = await db.from('Listing').select('id: listing_id');
  if (error) return { error };
  return { data: data.map((row) => row.id) };
}

export const getStaticProps: GetStaticProps<ListingProps> = async ({ params }) => {
  const listingId = params?.id;
  if (!listingId) return { notFound: true };
  const { data, error } = await getListing(listingId as string);
  if (error || !data) return { notFound: true };
  return {
    props: { info: data },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data, error } = await getListingIds();
  return {
    paths: error ? [] : data.map((row) => ({ params: { id: String(row) } })),
    fallback: 'blocking',
  };
};

export default function Listing({ info, user }: ListingProps) {
  const { setFlags } = useFlags();
  const router = useRouter();
  async function onClick() {
    const res = await fetchJson('/api/cart', info, { method: 'POST' });
    if (res.status < 400) {
      return showNotification({
        title: 'Item added',
        message: `Added "${info.name}" to cart`,
        color: 'green',
      });
    }
    showNotification({
      title: 'Item coud not be added',
      message: res.statusText,
      color: 'red',
    });
  }
  async function buyNow() {
    const res = await fetchJson('/api/buy_now', { id: info.id, qty: 1 }, { method: 'POST' });
    if (res.status > 400) {
      return showNotification({
        title: 'Item coud not be added',
        message: res.statusText,
        color: 'red',
      });
    }
    router.push('/orders');
  }
  return (
    <Center>
      <Card shadow="md">
        {info.img[0].link && (
          <Card.Section>
            <Image fit="cover" height={300} src={info.img[0].link} />
          </Card.Section>
        )}
        <Stack align="flex-start">
          <Space w="md" />
          <Text size="xl" weight="bold">
            {info.name}
          </Text>
          <Text size="md">{info.description}</Text>
          <Text size="xl">${info.price}</Text>
          <Group>
            {user ? (
              <>
                <Button color="green" onClick={buyNow}>
                  Buy now
                </Button>
                <Button onClick={onClick}>Add to cart</Button>
              </>
            ) : (
              <Button onClick={() => setFlags({ loginDialog: true })}>Log in to buy</Button>
            )}
          </Group>
        </Stack>
      </Card>
    </Center>
  );
}
