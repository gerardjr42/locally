"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { CategoryNavbarComponent } from "@/components/category-navbar";
import { NavigationBar } from "@/components/navigation-bar";
import { Input } from "@/components/ui/input";

import { formatDate } from '@/lib/utils';


export default function AllExperiences() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [experiences, setExperiences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExperiencesAndCategories();
  }, []);

  async function fetchExperiencesAndCategories() {
    try {
      const [
        { data: categoriesData, error: categoriesError },
        { data: eventsData, error: eventsError },
      ] = await Promise.all([
        supabase.from("Event_Categories").select("*"),
        supabase.from("Events").select(`
          *,
          Event_Category_Junction (
            category_id
          ),
          is_free
        `),
      ]);

      if (categoriesError) throw categoriesError;
      if (eventsError) throw eventsError;

      // Process events data to include categories
      const processedEvents = eventsData.map((event) => ({
        ...event,
        categories: event.Event_Category_Junction.map(
          (junction) => junction.category_id
        ),
      }));

      setCategories(categoriesData);
      setExperiences(processedEvents);

      if (processedEvents.length === 0) {
        toast("No events found", { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(`Error fetching data: ${error.message}`);
    }
  }

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredExperiences = useMemo(() => {
    return experiences.filter((experience) => {
      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.some((selectedCategoryId) => {
          // ! Make this into a constant variable
          // ? Do not hard code the category ID of the free events, just key into the is_free field
          // ! Add console errors to database so all developers can see them and debug faster
          // ? Add a catch all
          if (selectedCategoryId === 12) {
            return experience.is_free;
          }
          return experience.categories.includes(selectedCategoryId);
        });

      const matchesSearch =
        searchTerm === "" ||
        experience.event_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        experience.event_details
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesCategories && matchesSearch;
    });
  }, [experiences, selectedCategories, searchTerm]);

  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar />

      {/* Search bar */}
      <div className="w-[90%] max-w-md m-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for Events & Activities"
            className="pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Navigation Bar */}
      <CategoryNavbarComponent
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
      />

      <div className="w-full flex flex-row px-4 mx-1 mt-3.5 justify-between">
        <h1 className="text-left text-lg font-extrabold">Local Experiences For You</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
      </div>

      {/* Events list */}
      <div className="w-full p-4">
        {filteredExperiences.map((experience) => (
          <div
            key={experience.event_id}
            className="bg-white rounded-lg shadow-md mb-4 overflow-hidden cursor-pointer"
            onClick={() => router.push(`/experiences/${experience.event_id}`)}
          >
            <div className="relative">
              <Image
                src={experience.event_image_url}
                alt={experience.event_name}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <button className="bg-white rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                {experience.categories.map((categoryId) => {
                  const category = categories.find(
                    (c) => c.category_id === categoryId
                  );
                  return category ? (
                    <span
                      key={categoryId}
                      className="bg-white text-sm px-2 py-1 rounded-full"
                    >
                      {category.category_name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">
                  {formatDate(experience.event_time)}
                </span>
                <span className="font-bold">
                  {experience.is_free ? "Free" : `$${experience.event_price}`}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">
                {experience.event_name}
              </h3>
              <p className="text-gray-600">{experience.event_street_address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
