import type { Item } from '@/pages/orders';
import { Card, Text, Stack, Group, Image, Badge, Button } from '@mantine/core';

function timeSince(date : string) : string {
    var seconds = Math.floor((new Date().valueOf() - Date.parse(date).valueOf()) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

export default function CartListItem(props: Item) {
  return (
    <Card sx={{ maxWidth: 1080, width: '100%' }}>
      <Card.Section>
        <Group>
          <Image height={120} width={120} fit="cover" src={props.url}></Image>
          <Stack sx={{ padding: '12px 8px 12px 8px' }} align="flex-start" spacing="xs">
            <Text size="lg">{props.name}</Text>
            <Badge>{timeSince(props.date)}</Badge>
            <Text size="sm">Qty: {props.qty}</Text>
          </Stack>
        </Group>
      </Card.Section>
    </Card>
  );
}
