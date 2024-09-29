"use client";
import Logo from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/login');
  };
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
          <button onClick={handleLogin}> Log in</button>
          <button onClick={handleRegister}>Create account</button>
        </div>
      </div>
    </div>
  );
}
