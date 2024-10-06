"use client";

import { ArrowLeft, Menu } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function UserArchive() {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
  
    const handleBackClick = () => {
      router.push(`/connections`);
    };

    const toUpperCase = (str) => {
        return str.toUpperCase();
      };


    const locals = [
        { event: "Samba Sunday", name: "Ellis", age: 32, reviewed: false, date: "Sun, Sep 22"},
        { event: "Goat Yoga",name: "Lincoln", age: 29, reviewed: true, date: "Thu, Sep 5" },
        { event: "The New Gallery Opening Night",name: "Rochelle", age: 24, reviewed: true, date: "Sat, Aug 24" },
        { event: "Morning Walking Club",name: "Marcy", age: 28, reviewed: true, date: "Wed, Aug 14" },
      ];
  return (
  <div className="bg-gray-100 min-h-screen">
     <header className="bg-white p-4 flex justify-between items-center shadow-sm">
      <button className="p-2">
        <ArrowLeft
        className="w-6 h-6 text-gray-600"
        onClick={handleBackClick}
        />
      </button>
      <h1 className="text-2xl font-semibold">
      <Image
        alt="Locally logo"
        src="/images/LocallyBrandingAssets-04.png"
        width={100}
        height={100}
      />
      </h1>
      <button className="p-2" onClick={() => setMenuOpen(!menuOpen)}>
      <Menu className="w-6 h-6 text-gray-600" />
      </button>
      </header>
      <main className="p-4">

        <div className="mb-4">
        <h1 className='text-1xl font-bold'>
        {locals.length} Past Connections
        </h1>
        <p className="text-gray-600"> You have 1 Connection to review</p>
        </div>

        <div className="space-y-4 bg-[#C9E9E5] p-4 rounded-lg">
          {locals.map((local, index) => (
            <div
            key={index}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold">
                    {local.event}
                  </h3>
                  <p className="font-semibold">
                    With {toUpperCase(local.name)}
                  </p>
                  <p className="text-gray-600">{local.date}</p>
                </div>
              </div>
              {local.reviewed ? (
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                Reviewed
              </span>
            ) : (
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                Review
              </span>
            )}

            </div>
          ))}
        </div>
    </main>
    {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setMenuOpen(false)}
        >
          <div className="bg-white w-64 h-full absolute right-0 p-4">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                  Profile
                </a>
              </li>
              <li>
                <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className="block p-2 hover:bg-gray-100 rounded">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
  </div>
  )
}
