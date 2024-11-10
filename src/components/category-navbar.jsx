"use client";

import {
  Briefcase,
  Church,
  DollarSign,
  Dumbbell,
  GraduationCap,
  Heart,
  Mountain,
  Music,
  Palette,
  Plane,
  Ticket,
  Utensils,
} from "lucide-react";
import { useRef } from "react";

export function CategoryNavbarComponent({
  selectedCategories,
  toggleCategory,
}) {
  const scrollContainerRef = useRef(null);

  const categories = [
    { id: 1, name: "Entertainment", icon: <Ticket className="w-6 h-6" /> },
    { id: 2, name: "Food & Drink", icon: <Utensils className="w-6 h-6" /> },
    { id: 3, name: "Sports & Fitness", icon: <Dumbbell className="w-6 h-6" /> },
    { id: 4, name: "Outdoor", icon: <Mountain className="w-6 h-6" /> },
    { id: 5, name: "Health & Wellness", icon: <Heart className="w-6 h-6" /> },
    {
      id: 6,
      name: "Faith & Spirituality",
      icon: <Church className="w-6 h-6" />,
    },
    { id: 7, name: "Professional", icon: <Briefcase className="w-6 h-6" /> },
    { id: 8, name: "Music", icon: <Music className="w-6 h-6" /> },
    { id: 9, name: "Travel & Adventure", icon: <Plane className="w-6 h-6" /> },
    {
      id: 10,
      name: "Education & Learning",
      icon: <GraduationCap className="w-6 h-6" />,
    },
    { id: 11, name: "Arts & Culture", icon: <Palette className="w-6 h-6" /> },
    { id: 12, name: "Free", icon: <DollarSign className="w-6 h-6" /> },
  ];

  return (
    <div className="w-full flex justify-center">
      <div
        ref={scrollContainerRef}
        className="flex py-4 px-2 bg-white overflow-x-auto"
        style={{ width: "max-content" }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className="flex flex-col items-center justify-center min-w-[80px] mx-2"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                selectedCategories.includes(category.id)
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {category.icon}
            </div>
            <span className="text-xs text-center">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
