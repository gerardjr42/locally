"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export function InterestSelection() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    // Fetch user's interests when component mounts
    fetchUserInterests();
  }, []);

  const fetchUserInterests = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("User_Interests")
        .select("interest")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user interests:", error);
      } else {
        setSelectedInterests(data.map((item) => item.interest));
      }
    }
  };

  const toggleInterest = async (interest) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    if (selectedInterests.some((i) => i.name === interest.name)) {
      // Remove interest
      const { error } = await supabase
        .from("User_Interests")
        .delete()
        .eq("user_id", user.id)
        .eq("interest->name", interest.name);

      if (error) {
        console.error("Error removing interest:", error);
      } else {
        setSelectedInterests((prev) =>
          prev.filter((i) => i.name !== interest.name)
        );
      }
    } else {
      // Add interest
      const { error } = await supabase.from("User_Interests").insert({
        user_id: user.id,
        interest: { icon: interest.icon, name: interest.name },
      });

      if (error) {
        console.error("Error adding interest:", error);
      } else {
        setSelectedInterests((prev) => [...prev, interest]);
      }
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    router.push("/register/verification");
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <header className="flex items-center p-4 border-b">
        <Link href="/register/photo">
          <ChevronLeft className="w-6 h-6 cursor-pointer" />
        </Link>
        <h1 className="text-xl font-semibold flex-1 text-center">Interests</h1>
      </header>
      <main className="p-4">
        <p className="text-gray-600 mb-6">
          You&apos;ve chosen {selectedInterests.length} interests. They sound
          great!
        </p>
        {Object.entries(interests).map(([category, items]) => (
          <section key={category} className="mb-6">
            <button
              onClick={() => toggleCategory(category)}
              className="flex justify-between items-center w-full text-left text-xl font-semibold mb-2"
            >
              <span>{category}</span>
              {expandedCategories.includes(category) ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {expandedCategories.includes(category) && (
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => toggleInterest(item)}
                    className={`flex items-center px-3 py-2 rounded-full border text-sm ${
                      selectedInterests.some((i) => i.name === item.name)
                        ? "bg-[#2AA598] text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </section>
        ))}
        <button
          onClick={handleContinue}
          className="w-full bg-[#2AA598] text-white py-3 rounded-full mt-6"
        >
          Continue
        </button>
      </main>
    </div>
  );
}
