"use client";
import {useRouter } from "next/navigation";

import {NavigationBar} from "@/components/navigation-bar";

export default function UserChats() {
    const router = useRouter();
  
    const handleBackClick = () => {
      router.push(`/connections`);
    };

    const toUpperCase = (str) => {
        return str.toUpperCase();
      };


    const locals = [
        { event: "Movies In The Park", name: "Hudson", age: 32, read: false,sent: false, date: "Sun, Sep 22"},
        { event: "Movies In The Park",name: "Vernon", age: 29, read: true,sent: false, date: "Thu, Sep 5" },
        { event: "Movies In The Park", age: 24, read: true,name:"Rochelle",sent: true, date: "Sat, Aug 24" },
        { event: "Next In Tech Conference",name: "Brook", age: 28, read: true,sent: true, date: "Wed, Aug 14" },
      ];
  return (
  <div className="bg-gray-100 min-h-screen">
     <header className="bg-white p-4 flex justify-between items-center shadow-sm">
      <NavigationBar handleBackClick={handleBackClick}/>
      </header>
      <main className="p-4">

        <div className="mb-4">
        <h1 className='text-3xl font-bold'>
            Connections Chats
        </h1>
        <p className="text-gray-500">{locals.length} Active Chats</p>
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
              {!local.read ? (
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
            UnRead
          </span>
        ) : local.sent ? (
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
            Sent
          </span>
        ) : (
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
            Read
          </span>
        )}
            

            </div>
          ))}
        </div>
    </main>
  </div>
  )
}
