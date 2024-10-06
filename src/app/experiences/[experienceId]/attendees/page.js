"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { useParams, useRouter } from "next/navigation";

const locals = [
  { name: "Hudson", age: 32, topMatch: true },
  { name: "Brook", age: 29, topMatch: true },
  { name: "Rochelle", age: 24, topMatch: false },
  { name: "George", age: 28, topMatch: false },
  { name: "Lynn", age: 32, topMatch: false },
  { name: "Chelsea", age: 21, topMatch: false },
  { name: "Lexi", age: 25, topMatch: false },
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
        {/* <button className="p-2">
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
        </h1> */}
        <NavigationBar handleBackClick={handleBackClick} />
      </header>
      <main className="p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">46 Interested Locals</h2>
          <p className="text-gray-600">for Movies In The Park</p>
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
