import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookies } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider, AppShell } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { GlobalSpinner } from '@/components/GlobalSpinner';
import { FlagsProvider, LoadingProvider } from '@/lib/client';
import AppHeader from '@/components/AppHeader';
import useSwr from 'swr';
import { useColorScheme } from '@mantine/hooks';
import { AppFooter } from '@/components/AppFooter';
import { UserSession } from '@/lib/types';

function getJson(endpoint: '/api/_user'): Promise<UserSession | null>;
function getJson(endpoint: string) {
  return fetch(endpoint).then((e) => e.json());
}

interface InitialProps {
  colorScheme?: ColorScheme;
}

const headerLinks = [
  { title: 'Home', url: '/' },
  { title: 'Cart', url: '/cart' },
  { title: 'Orders', url: '/orders' },
  { title: 'Payment', url: '/payment' },
];

const footerLinks = [
  {
    title: 'Links',
    links: [{ label: 'GitHub', link: 'https://github.com/Desdaemon/ecommerce-app' }],
  },
];

export default function App(props: AppProps & InitialProps) {
  const { Component, pageProps } = props;
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme || 'light');
  const { data, error } = useSwr('/api/_user', getJson);
  const user = error || data || null;

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  useEffect(() => {
    // TODO: Fix server/client color mismatch
    if (preferredColorScheme !== colorScheme) toggleColorScheme(preferredColorScheme);
  }, []);

  return (
    <>
      <Head>
        <title>E-Commerce App</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <NotificationsProvider>
            <FlagsProvider>
              <LoadingProvider>
                <GlobalSpinner />
                <AppShell
                  header={<AppHeader user={user} tabs={headerLinks} />}
                  footer={<AppFooter data={footerLinks} />}
                >
                  {/** Dependency injection: unless the component overrides it, it will receive the users props. */}
                  <Component user={user} {...pageProps} />
                </AppShell>
              </LoadingProvider>
            </FlagsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: any) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx),
});
