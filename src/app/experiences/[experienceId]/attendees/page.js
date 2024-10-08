"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { useParams, useRouter } from "next/navigation";

const locals = [
  { id: "1", name: "Hudson", age: 32, topMatch: true },
  { id: "2", name: "Brook", age: 29, topMatch: true },
  { id: "3", name: "Rochelle", age: 24, topMatch: false },
  { id: "4", name: "George", age: 28, topMatch: false },
  { id: "5", name: "Lynn", age: 32, topMatch: false },
  { id: "6", name: "Chelsea", age: 21, topMatch: false },
  { id: "7", name: "Lexi", age: 25, topMatch: false },
];

export default function AttendeesList() {
  const router = useRouter();
  const params = useParams();

  const handleBackClick = () => {
    router.push(`/experiences/${params.experienceId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar handleBackClick={handleBackClick} />
      </header>
      <main className="p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">46 Interested Locals</h2>
          <p className="text-gray-600">for Movies In The Park</p>
        </div>

        <div className="space-y-4 bg-[#C9E9E5] p-4 rounded-lg">
          {locals.map((local) => (
            <div
              key={local.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer"
              onClick={() =>
                router.push(
                  `/experiences/${params.experienceId}/attendees/${local.id}`
                )
              }
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold">
                    {local.name}, {local.age}
                  </h3>
                </div>
              </div>
              {local.topMatch && (
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                  Top Match
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
