import {
  Text,
  AppShell,
  AppShellProps,
  Group,
  Navbar,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { List } from 'tabler-icons-react';

const paths = [
  {
    label: 'My Items',
    path: '/vendor',
    icon: <List size={18} />,
    color: 'green',
  },
];

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  selected: boolean;
}

function MainLink({ icon, color, label }: MainLinkProps) {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

export default function VendorLayout(props: AppShellProps) {
  const router = useRouter();
  return (
    <AppShell
      navbar={
        <Navbar width={{ base: 300 }}>
          {paths.map((path) => (
            <MainLink {...path} selected={router.pathname === path.path} />
          ))}
        </Navbar>
      }
      {...props}
    />
  );
}
