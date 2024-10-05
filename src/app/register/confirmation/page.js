'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './confirmation.scss';

export default function ConfirmationPage() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="ConfirmationPage">
      <h1>Welcome!</h1>
      <div>
        <h2>You are now a member of the Locally community!</h2>
        <button onClick={handleLoginRedirect}>Log In</button>
      </div>
    </div>
  );
}
