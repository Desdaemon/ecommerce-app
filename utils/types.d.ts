import type { NextApiRequest, NextApiResponse } from 'next';
type Endpoint = (req: NextApiRequest, res: NextApiResponse) => any;
