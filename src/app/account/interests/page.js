"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { NavigationBar } from '@/components/navigation-bar';

export default function accountInterests() {
  const interests = {
    Creativity: [
      { icon: "🎨", name: "Art" },
      { icon: "🧶", name: "Crafts" },
      { icon: "💃", name: "Dancing" },
      { icon: "🎨", name: "Design" },
      { icon: "💄", name: "Make-up" },
      { icon: "🎥", name: "Making videos" },
      { icon: "📷", name: "Photography" },
      { icon: "🎤", name: "Singing" },
      { icon: "✍️", name: "Writing" },
    ],
    "Sports and fitness": [
      { icon: "🏋️", name: "Gym" },
      { icon: "🏸", name: "Badminton" },
      { icon: "⚾", name: "Baseball" },
      { icon: "🏀", name: "Basketball" },
      { icon: "🎳", name: "Bowling" },
      { icon: "🥊", name: "Boxing" },
      { icon: "♟️", name: "Chess" },
      { icon: "🚣", name: "Crew" },
      { icon: "🎾", name: "Tennis" },
      { icon: "🏐", name: "Volleyball" },
      { icon: "🏈", name: "Football" },
      { icon: "🧘", name: "Yoga" },
      { icon: "⚽", name: "Soccer" },
      { icon: "🏃", name: "Running/Marathons" },
      { icon: "🚴", name: "Biking" },
      { icon: "🌽", name: "Cornhole" },
      { icon: "🥋", name: "Martial Arts" },
      { icon: "⛷️", name: "Skiing" },
      { icon: "🛹", name: "Skateboarding" },
      { icon: "🛼", name: "Rollerskating/Rollerblading" },
      { icon: "🐎", name: "Horseback Riding" },
      { icon: "🧗", name: "Rock Climbing" },
    ],
    "Food and drink": [
      { icon: "🍕", name: "Pizza" },
      { icon: "🍣", name: "Sushi" },
      { icon: "🍷", name: "Wine time" },
      { icon: "🍰", name: "Baking" },
      { icon: "🍺", name: "Beer" },
      { icon: "🍳", name: "Brunches" },
      { icon: "☕", name: "Coffee" },
      { icon: "🍳", name: "Cooking" },
      { icon: "🍷", name: "Wine Tastings" },
      { icon: "🍔", name: "Food Festivals" },
      { icon: "🍽️", name: "Restaurants" },
      { icon: "🚚", name: "Food Trucks" },
      { icon: "🍽️", name: "Private Dining Experiences" },
      { icon: "🍺", name: "Brewery Tours" },
      { icon: "🍸", name: "Cocktail Mixology Classes" },
      { icon: "🛒", name: "Pop-up Food Markets" },
      { icon: "☕", name: "Coffee Tasting" },
      { icon: "🌾", name: "Farm-to-Table Dinners" },
    ],
    Entertainment: [
      { icon: "🎭", name: "Concerts" },
      { icon: "😂", name: "Comedy Shows" },
      { icon: "🎬", name: "Movie & Film Screenings" },
      { icon: "🎥", name: "Film Festivals" },
      { icon: "🎵", name: "Music Festivals" },
      { icon: "🎪", name: "Street Fairs" },
      { icon: "🎭", name: "Broadway/Theatre" },
      { icon: "📚", name: "Book Clubs" },
      { icon: "🎤", name: "Open Mic Nights" },
      { icon: "🧠", name: "Trivia Nights" },
    ],
    Outdoor: [
      { icon: "⛺", name: "Camping" },
      { icon: "🥾", name: "Hiking" },
      { icon: "🦜", name: "Bird Watching" },
      { icon: "⛵", name: "Sailing" },
      { icon: "🎣", name: "Fishing" },
      { icon: "🛶", name: "Canoeing/Kayaking" },
      { icon: "🧺", name: "Picnics in the Park" },
      { icon: "🧘", name: "Outdoor Yoga" },
      { icon: "🤿", name: "Scuba Diving" },
      { icon: "🏄", name: "Surfing" },
    ],
    "Health & Wellness": [
      { icon: "💆", name: "Spas" },
      { icon: "💆", name: "Massage Therapy" },
      { icon: "🧠", name: "Mental Health Support" },
      { icon: "🧘", name: "Meditation Classes" },
      { icon: "🥗", name: "Nutrition Workshops" },
      { icon: "🧘", name: "Pilates Classes" },
      { icon: "🌿", name: "Holistic Healing" },
      { icon: "💪", name: "Fitness Bootcamps" },
      { icon: "🌸", name: "Aromatherapy Sessions" },
      { icon: "👨‍🍳", name: "Healthy Cooking Classes" },
    ],
    "Faith & Spirituality": [
      { icon: "🧘", name: "Spiritual Retreats" },
      { icon: "📖", name: "Bible Study Groups" },
      { icon: "🙏", name: "Prayer Circles" },
      { icon: "🕯️", name: "Interfaith Dialogues" },
      { icon: "🎉", name: "Religious Holiday Events" },
      { icon: "🚶", name: "Pilgrimages" },
      { icon: "⛪", name: "Worship Services" },
      { icon: "🤝", name: "Faith-Based Volunteering" },
      { icon: "💰", name: "Charity Fundraisers" },
      { icon: "💒", name: "Religious Ceremonies" },
    ],
    "Business & Professional": [
      { icon: "🤝", name: "Networking Events" },
      { icon: "🎤", name: "Conferences" },
      { icon: "📈", name: "Career Development Workshops" },
      { icon: "🎙️", name: "Public Speaking Workshops" },
      { icon: "💼", name: "Entrepreneur Pitch Competitions" },
      { icon: "👥", name: "Industry Panels" },
      { icon: "💻", name: "Webinars" },
      { icon: "🏢", name: "Business Expo/Trade Shows" },
      { icon: "🧑‍🏫", name: "Mentorship Programs" },
      { icon: "🚀", name: "Startup Showcases" },
    ],
    Music: [
      { icon: "🎸", name: "Guitar" },
      { icon: "🎹", name: "Piano" },
      { icon: "🥁", name: "Drumming Circles" },
      { icon: "🎤", name: "Open Mic Nights" },
      { icon: "🎵", name: "Singing Lessons" },
      { icon: "🎧", name: "DJ Nights" },
      { icon: "🎤", name: "Karaoke Nights" },
      { icon: "🎸", name: "Live Band Performances" },
      { icon: "🎵", name: "Music Jams" },
      { icon: "✍️", name: "Songwriting Workshops" },
    ],
    "Travel & Adventure": [
      { icon: "🎒", name: "Solo Travel" },
      { icon: "🚢", name: "Cruises" },
      { icon: "✈️", name: "International Travel" },
      { icon: "🚗", name: "Road Trips" },
      { icon: "👥", name: "Group Travel Adventures" },
      { icon: "🪂", name: "Adventure Sports" },
      { icon: "⛺", name: "Camping Excursions" },
      { icon: "🦁", name: "Wildlife Safaris" },
      { icon: "🚐", name: "RV Trips" },
      { icon: "🏙️", name: "City Exploration Tours" },
    ],
    "Education & Workshops": [
      { icon: "🧠", name: "Skill-Building Workshops" },
      { icon: "🗣️", name: "Language Learning" },
      { icon: "💰", name: "Personal Finance Workshops" },
      { icon: "🧶", name: "Craft Workshops" },
      { icon: "✍️", name: "Writing Workshops" },
      { icon: "📷", name: "Photography Classes" },
      { icon: "👨‍🍳", name: "Cooking Classes" },
      { icon: "📱", name: "Digital Marketing Workshops" },
      { icon: "🎨", name: "Graphic Design Tutorials" },
      { icon: "📢", name: "Public Policy/Advocacy Seminars" },
    ],
    "Art & Culture": [
      { icon: "🏛️", name: "Museums" },
      { icon: "🎨", name: "Paint & Sip Events" },
      { icon: "🧶", name: "Crafting" },
      { icon: "📷", name: "Photography Exhibits" },
      { icon: "🗿", name: "Sculpture Workshops" },
      { icon: "🖼️", name: "Art Galleries" },
      { icon: "🏺", name: "Pottery Classes" },
      { icon: "✍️", name: "Creative Writing Circles" },
      { icon: "🎨", name: "Live Drawing Sessions" },
      { icon: "🖌️", name: "Street Art Tours" },
    ],
  };

  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    console.log("Selected interests:", selectedInterests);
  };  

  return (
    <div>
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar />
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="text-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Update Your Interests</h2>
          <p className="text-sm text-gray-600 mt-2">
            Select up to 10 interests
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(interests).map(([category, items]) => (
            <details key={category} className="border rounded-lg">
              <summary className="text-lg font-semibold p-4 cursor-pointer hover:bg-gray-50">
                {category}
              </summary>
              <div className="p-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => toggleInterest(item.name)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedInterests.includes(item.name)
                        ? 'bg-[#0D9488] hover:bg-[#0B7A6E] text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon} {item.name}
                  </button>
                ))}
              </div>
            </details>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSave}
            className="bg-[#0D9488] hover:bg-[#0B7A6E] text-white w-full max-w-[200px] py-2 rounded-full"
            disabled={selectedInterests.length > 10}
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  )

}