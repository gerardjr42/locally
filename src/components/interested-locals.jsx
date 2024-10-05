"use client"

import { useState } from 'react'
import { ArrowLeft, Menu } from 'lucide-react'

const locals = [
  { name: 'Hudson', age: 32, topMatch: true },
  { name: 'Brook', age: 29, topMatch: true },
  { name: 'Rochelle', age: 24, topMatch: false },
  { name: 'George', age: 28, topMatch: false },
  { name: 'Lynn', age: 32, topMatch: false },
  { name: 'Chelsea', age: 21, topMatch: false },
  { name: 'Lexi', age: 25, topMatch: false },
]

export function InterestedLocalsComponent() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    (<div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <button className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold">
          <span className="font-normal">L</span>ocally
        </h1>
        <button className="p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
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
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold">{local.name}, {local.age}</h3>
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
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setMenuOpen(false)}>
          <div className="bg-white w-64 h-full absolute right-0 p-4">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <ul className="space-y-2">
              <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Home</a></li>
              <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Profile</a></li>
              <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Settings</a></li>
              <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Logout</a></li>
            </ul>
          </div>
        </div>
      )}
    </div>)
  );
}