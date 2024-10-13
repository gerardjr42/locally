"use client";
import React from 'react';
import { NavigationBar } from "@/components/navigation-bar";
import  { useRouter } from 'next/navigation';

export default function AccountPhoto() {
  const router = useRouter()
  const handleBackClick = () => {
    router.push('/account/profileView');
  };

  return (
    <div className="bg-white-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar handleBackClick={handleBackClick} />
      </header>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-sm font-bold mb-4">ACCOUNT PHOTO</h2>
        <img
          src="https://images.pexels.com/photos/3799790/pexels-photo-3799790.jpeg?auto=compress&cs=tinysrgb&w=300"
          alt="Profile" 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      </div>
        <button className="mb-4 w-full px-4 py-2 border rounded-full text-teal-600 border-teal-600 flex items-center justify-center">
          <span className="mr-2">📷</span> Choose Photo
        </button>
        <button className="w-full px-6 py-2 bg-teal-600 text-white rounded-full">
          Save Changes
        </button>
    </div>
  );
}