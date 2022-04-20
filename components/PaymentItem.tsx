import { fetchJson } from '@/lib/client';
import { Card, Text, Stack, Group, Badge, Button } from '@mantine/core';

export default function PaymentItem(props: any) {
  async function makeDefault() {
    await fetchJson('/api/default_payment', { cardNo: props.card_no }, { method: 'POST' });
    location.reload();
  }
  return (
    <Card sx={{ maxWidth: 1080, width: '100%' }}>
      <Group>
        <Stack sx={{ padding: '12px 8px 12px 8px' }} align="flex-start" spacing="xs">
          <Text size="lg">{props.name}</Text>
          <Text size="sm">{props.card_no}</Text>
          <Text size="sm">Expires {props.expiry}</Text>
        </Stack>
      </Group>
      {props.isDefault ? (
        <Badge>default</Badge>
      ) : (
        <Button variant="outline" color="green" onClick={makeDefault}>
          Set default
        </Button>
      )}
    </Card>
  );
}
