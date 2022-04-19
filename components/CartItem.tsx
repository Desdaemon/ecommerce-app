import type { CartItem } from '@/pages/cart';
import { Card, Text, Stack, Group, Image, Badge, Button } from '@mantine/core';

export default function CartListItem(props: CartItem) {
  return (
    <Card sx={{ maxWidth: 1080, width: '100%' }}>
      <Card.Section>
        <Group>
          <Image height={120} width={120} fit="cover" src={props.url}></Image>
          <Stack sx={{ padding: '12px 8px 12px 8px' }} align="flex-start" spacing="xs">
            <Text size="lg">{props.name}</Text>
            <Badge>in stock</Badge>
            <Text size="sm">Qty: {props.qty}</Text>
            <Button color="red">Remove Item</Button>
          </Stack>
        </Group>
      </Card.Section>
    </Card>
  );
}
