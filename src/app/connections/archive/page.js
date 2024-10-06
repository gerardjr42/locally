"use client";
import { useParams, useRouter } from "next/navigation";

import Nav from "@/components/navigation-bar";

export default function UserArchive() {
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
      <Nav handleBackClick={handleBackClick}/>
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
  </div>
  )
}
