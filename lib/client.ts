/** Utilities for the client only. */

import { useState } from 'react';
import { createContainer } from 'unstated-next';

/** Send a JSON-serializable payload to `path`. */
export function fetchJson(
  path: string,
  data: any,
  /** Supply a custom `fetch` to replace the usual {@link fetch} */
  options: RequestInit & { fetch?: typeof fetch } = {}
) {
  const headers = { ...options.headers, 'content-type': 'application/json' };
  return (options.fetch || fetch)(path, { ...options, body: JSON.stringify(data), headers });
}

// When working with 'unstated', we create "containers" which are React components that
// do not render, but otherwise can use all kinds of hooks inside them. Each container
// exports a hook "useContainer" and a Provider component, which we must insert into
// _app.tsx to make it available globally. This has the benefit of working in server-side
// (SSR) contexts as well.
export const { Provider: LoadingProvider, useContainer: useLoading } = createContainer(
  (init?: boolean) => {
    const [loading, setLoading] = useState(init || false);
    return {
      loading,
      /** Wrapper around {@link fetch} to update the global {@link loading} state. */
      fetch(..._: Parameters<typeof fetch>) {
        setLoading(true);
        return fetch(..._).finally(() => setLoading(false));
      },
    };
  }
);

interface Flags {
  loginDialog?: boolean;
}

export const { Provider: FlagsProvider, useContainer: useFlags } = createContainer(
  (init: Flags = {}) => {
    const [flags, setFlags] = useState<Flags>(init);
    return { flags, setFlags };
  }
);
