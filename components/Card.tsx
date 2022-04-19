import { Card, Image, Text, Badge, Button, Group, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
interface Props {
  id: string;
  link: string;
  description: string;
  name: string;
}

export function CardItem({ id, link, description, name }: Props) {
  const theme = useMantineTheme();

  const secondaryColor = theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    <div style={{ width: 340, margin: 'auto' }}>
      <Card shadow="sm" p="lg">
        <Card.Section>
          <Link href={link}>
            <Image height={200} src={link} />
          </Link>
        </Card.Section>

        <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
          <Text weight={500}>{name}</Text>
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        </Group>x

        <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
          {description}
        </Text>

        <Link href={`/listing/${id}`}>
          <Button variant="light" color="blue" fullWidth style={{ marginTop: 14 }}>
            Buy Item now
          </Button>
        </Link>
      </Card>
    </div>
  );
}
