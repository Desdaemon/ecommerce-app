import type { NextApiRequest, NextApiResponse } from 'next';
type Endpoint<T = any> = (req: NextApiRequest & { body: T }, res: NextApiResponse) => any;

type Login = {};

type Signup = {};
