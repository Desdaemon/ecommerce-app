import type { NextApiRequest, NextApiResponse } from 'next';
import type { FC } from 'react';
type Endpoint = (req: NextApiRequest, res: NextApiResponse) => any;

interface UserSession {
  userId: string;
  username: string;
  image?: string;
  isVendor: boolean;
}

/** Props injected by _app.tsx */
interface PageProps {
  user?: UserSession | null;
}

type Login = {
  identity: string;
  password: string;
};

type Signup = {
  username: string;
  password: string;
  email: string;
};
