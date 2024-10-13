'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './confirmation.scss';

export default function ConfirmationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('code');

    if (authCode) {
      exchangeAuthCodeForToken(authCode);
    } else {
      setLoading(false);
    }
  }, []);

  const exchangeAuthCodeForToken = async (authCode) => {
    try {
     const response = await fetch('https://api.id.me/oauth2/token', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
       },
       body: new URLSearchParams({
         client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
         client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
         grant_type: 'authorization_code',
         code: authCode,
         redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
       }),
     });

      if (!response.ok) {
        throw new Error(
          'Failed to exchange authorization code for access token'
        );
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      setLoading(false);
      console.log('Access Token:', data.access_token);


    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="ConfirmationPage">
      <div>
        <h1>Welcome!</h1>
        <h2>You are now a member of the Locally community!</h2>
        <button onClick={handleLoginRedirect}>Log In</button>
      </div>
    </div>
  );
}
