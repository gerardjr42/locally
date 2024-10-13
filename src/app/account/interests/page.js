"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { useState } from 'react';

import { NavigationBar } from '@/components/navigation-bar';

export default function accountInterests() {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };
const handleContinue = () => {

}
  


  
  return (
    <div>
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar />
      </header>
      <main>
      <div className="text-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Update Your Interests</h2>
          <p className="text-sm text-gray-600 mt-2">
            Select up to 10 interests
          </p>
        </div>

        <div className="space-y-4">
          {['Category 1'].map((category) => (
            <div key={category} className="space-y-2">
              <h3 className="text-lg font-semibold">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {['Interest 1', 'Interest 2', 'Interest 3'].map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleInterest(item)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedInterests.includes(item)
                        ? 'bg-[#0D9488] hover:bg-[#0B7A6E] text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleContinue}
            className="bg-[#0D9488] hover:bg-[#0B7A6E] text-white w-full max-w-[200px] py-2 rounded-full"
            disabled={selectedInterests.length < 3}
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  )
}
