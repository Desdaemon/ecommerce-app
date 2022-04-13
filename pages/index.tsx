import Link from 'next/link';
import useUser from '../hooks/useUser';

export default function HomePage() {
  const user = useUser((state) => state.userId);
  return (
    <>
      <h1>ECommerce Application</h1>
      <br></br>
      <Link href="/login">Login</Link>
      <br></br>
      <Link href="/login?signup">Signup</Link>
      {user}
    </>
  );
}
