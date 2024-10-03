"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

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

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
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

    const interestExists = selectedInterests.some(
      (i) => i.name === interest.name
    );

    if (interestExists) {
      // Remove interest
      const { error } = await supabase
        .from("User_Interests")
        .delete()
        .eq("user_id", user.id)
        .eq(
          "interest",
          JSON.stringify({ icon: interest.icon, name: interest.name })
        );

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
    router.push("/register/photo");
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/register/aboutme")}
        >
          <ArrowLeft className="mr-2 h-10 w-4" />
        </Button>

        <div className="mb-6">
          <Progress value={60} className="h-2" />
          <div className="flex justify-between mt-2 text-sm font-medium text-[#0D9488]">
            <span>Profile Creation</span>
            <span>60%</span>
          </div>
        </div>

        <div className="text-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Interests</h2>
          <p className="text-sm text-gray-600 mt-2">
            Select at least 3 interests to help us find the best events for you
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(interests).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-lg font-semibold">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Button
                    key={item.name}
                    variant={
                      selectedInterests.some((i) => i.name === item.name)
                        ? "default"
                        : "outline"
                    }
                    className={`text-sm ${
                      selectedInterests.some((i) => i.name === item.name)
                        ? "bg-[#0D9488] hover:bg-[#0B7A6E] text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleInterest(item)}
                  >
                    {item.icon} {item.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-[#0D9488] hover:bg-[#0B7A6E] text-white w-full max-w-[200px]"
            disabled={selectedInterests.length < 3}
          >
            Continue
          </Button>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
