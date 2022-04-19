import { Card, Text, Stack, Group, Image, Badge, Button } from '@mantine/core';

export default function PaymentItem(props: any) {
  return (
    <Card sx={{ maxWidth: 1080, width: '100%' }}>
      <Card.Section>
        <Group>
          <Stack sx={{ padding: '12px 8px 12px 8px' }} align="flex-start" spacing="xs">
            <Text size="lg">{props.name}</Text>
            <Text size="sm">{props.card_no}</Text>
            <Text size="sm">Expires {props.expiry}</Text>
          </Stack>
        </Group>
      </Card.Section>
    </Card>
  );
}
