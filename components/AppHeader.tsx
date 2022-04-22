import { useState } from 'react';
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  Modal,
  useMantineColorScheme,
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import {
  Logout,
  Settings,
  SwitchHorizontal,
  ChevronDown,
  Login,
  ShoppingCart,
  List,
  Sun,
} from 'tabler-icons-react';
import { UserSession } from '@/lib/types';
import { useRouter } from 'next/router';
import { useFlags, useLoading } from '@/lib/client';
import LoginPage from './Login';
import Logo from './Logo';

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
    }`,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  userMenu: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  tabs: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  tabsList: {
    borderBottom: '0 !important',
  },

  tabControl: {
    fontWeight: 500,
    height: 38,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    },
  },

  tabControlActive: {
    borderColor: `${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]
    } !important`,
  },
}));

interface HeaderTabsProps {
  user?: UserSession | null;
  tabs: { title: string; url: string }[];
}

export default function AppHeader({ user, tabs }: HeaderTabsProps) {
  const router = useRouter();
  const { fetch } = useLoading();
  const { classes, theme, cx } = useStyles();
  const [opened, toggleOpened] = useBooleanToggle(false);
  const { flags, setFlags } = useFlags();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { toggleColorScheme } = useMantineColorScheme();

  async function logout() {
    await fetch('/api/logout');
    location.reload();
  }

  const active = tabs.findIndex((tab) => router.pathname === tab.url);
  const items = tabs.map((tab) => <Tabs.Tab key={tab.title} label={tab.title} />);

  return (
    <div className={classes.header}>
      <Modal
        title="Login"
        onClose={() => setFlags({ loginDialog: false })}
        opened={flags.loginDialog || false}
      >
        <LoginPage />
      </Modal>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Logo />

          <Burger
            opened={opened}
            onClick={() => toggleOpened()}
            className={classes.burger}
            size="sm"
          />

          <Menu
            size={260}
            placement="end"
            transition="pop-top-right"
            className={classes.userMenu}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            control={
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group spacing={7}>
                  <Avatar src={user?.image} alt={user?.username} radius="xl" size={20} />
                  <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                    {user?.username || 'Welcome'}
                  </Text>
                  <ChevronDown size={12} />
                </Group>
              </UnstyledButton>
            }
          >
            {user && (
              <>
                <Menu.Item
                  onClick={() => router.push('/cart')}
                  icon={<ShoppingCart size={14} color={theme.colors.red[6]} />}
                >
                  Shopping Cart
                </Menu.Item>
                <Menu.Item icon={<List size={14} color={theme.colors.yellow[6]} />}>
                  Orders
                </Menu.Item>

                <Menu.Label>Settings</Menu.Label>
                <Menu.Item icon={<Settings size={14} />}>Account settings</Menu.Item>
                <Menu.Item
                  icon={<SwitchHorizontal size={14} />}
                  onClick={() => setFlags({ loginDialog: true })}
                >
                  Change account
                </Menu.Item>
              </>
            )}
            {user ? (
              <Menu.Item icon={<Logout size={14} />} onClick={logout}>
                Logout
              </Menu.Item>
            ) : (
              <Menu.Item icon={<Login size={14} />} onClick={() => setFlags({ loginDialog: true })}>
                Login
              </Menu.Item>
            )}
            <Menu.Item
              icon={<Sun size={14} color={theme.colors.orange[6]} />}
              onClick={() => toggleColorScheme()}
            >
              Switch Theme
            </Menu.Item>
          </Menu>
        </Group>
      </Container>
      <Container>
        <Tabs
          variant="outline"
          active={active}
          onTabChange={(idx) => {
            router.push(tabs[idx].url);
          }}
          classNames={{
            root: classes.tabs,
            tabsListWrapper: classes.tabsList,
            tabControl: classes.tabControl,
            tabActive: classes.tabControlActive,
          }}
        >
          {items}
        </Tabs>
      </Container>
    </div>
  );
}
