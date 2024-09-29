"use client";
import Logo from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="Home">
      <div className="container">
        <div>
          <Logo
            className="Logo"
            src="/images/logo.png"
            alt="Description of your image"
            width={300}
            height={200}
          />
        </div>
        <div>
          <button onClick={() => router.push('/account')}> Log in</button>
          <button onClick={() => router.push('/register')}>Create account</button>
        </div>
      </div>
    </div>
  );
}
