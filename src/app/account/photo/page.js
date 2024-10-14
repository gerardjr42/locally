"use client";

import React from 'react';
import "./accountPhoto.scss";
import { NavigationBar } from "@/components/navigation-bar";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AccountPhoto() {
  const [file, setFile] = React.useState(null);
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/account/profileView');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setAvatarUrl(previewUrl);
    }
  };

  return (
    <div className="bg-white-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar handleBackClick={handleBackClick} />
      </header>
      <div className="photo bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-sm font-bold mb-4">ACCOUNT PHOTO</h2>
        <div className="flex justify-center">
          {avatarUrl ? (
            <div className="relative w-48 h-48">
              <Image
                src={avatarUrl}
                alt="Profile"
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <img
              src="https://images.pexels.com/photos/3799790/pexels-photo-3799790.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Profile-photo"
              className="w-48 h-48 object-cover"
            />
          )}
        </div>
      </div>
      <div className="button-container mt-6 px-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0D9488] hover:bg-[#0B7A6E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D9488] cursor-pointer"
        >
          <span className="mr-2">📷</span> Choose Photo
        </label>
        <button className="w-full px-6 py-2 bg-teal-600 text-white rounded-full mt-4">
          Save Changes
        </button>
      </div>
    </div>
  );
}