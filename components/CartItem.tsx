import { fetchJson } from '@/lib/client';
import type { CartItem } from '@/pages/cart';
import { Card, Text, Stack, Group, Image, Badge, Button } from '@mantine/core';

export default function CartListItem(props: CartItem) {
  async function removeItem() {
    const res = await fetchJson('/api/cart', { id: props.listing.id }, { method: 'DELETE' });
    if (res.status < 400) location.reload();
  }
  return (
    <Card sx={{ maxWidth: 1080, width: '100%' }}>
      <Card.Section>
        <Group>
          <Image
            height={120}
            width={120}
            fit="cover"
            src={props.listing.img[0].url}
            withPlaceholder
          ></Image>
          <Stack sx={{ padding: '12px 8px 12px 8px' }} align="flex-start" spacing="xs">
            <Text size="lg">{props.listing.name}</Text>
            <Badge>in stock</Badge>
            <Text size="sm">Qty: {props.qty}</Text>
            <Button color="red" onClick={removeItem}>
              Remove Item
            </Button>
          </Stack>
        </Group>
      </Card.Section>
    </Card>
  );
}
