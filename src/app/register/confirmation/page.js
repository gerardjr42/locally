'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './confirmation.scss';

export default function ConfirmationPage() {
  const router = useRouter();

  return (
    <div className="ConfirmationPage">
      <h1>Welcome!</h1>
      <div>
        <h2>You are now a member of the Locally community!</h2>
        <button>Log In</button>
      </div>
    </div>
  );
}
