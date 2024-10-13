"use client";
import React from 'react'
import { NavigationBar } from '@/components/navigation-bar';
import { useRouter } from 'next/navigation';

export default function ProfileView() {
  const handleBackClick = () => {
    router.push('/account/details');
  };
  const router = useRouter();
  return (
    <div>
      <header className='bg-white p-4 flex justify-between items-center shadow-sm'>
        <NavigationBar handleBackClick={handleBackClick} />
      </header>
      <main>
        <div className="bg-white p-6 rounded-lg shadow-md"></div>
      </main>
    </div>
  )
}
