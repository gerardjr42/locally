'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="Home">
      <div className="container">
        <div>
          <Image
            className="Logo"
            src="/images/logo.png"
            alt="Description of your image"
            width={300}
            height={200}
          />
        </div>
        <div>
          <button onClick={handleLogin}>Log in</button>
          <button>Create account</button>
        </div>
      </div>
    </div>
  );
}
