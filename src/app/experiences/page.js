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

import {
  fetchUsersForExperience,
  formatDate,
  sortExperiencesByDate,
} from "@/lib/utils";

export default function AllExperiences() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [experiences, setExperiences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    fetchExperiencesAndCategories();
  }, []);

  async function fetchExperiencesAndCategories() {
    try {
      // Get current user's interests with their category IDs
      const { data: userInterests } = await supabase.from("User_Interests")
        .select(`
          interest_id,
          Interests (
            category_id
          )
        `);

      const userCategoryIds =
        userInterests
          ?.map((interest) => interest.Interests?.category_id)
          .filter(Boolean) || [];

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

      // Process events data to include categories and match scores
      const processedEvents = await Promise.all(
        eventsData.map(async (event) => {
          const users = await fetchUsersForExperience(supabase, event.event_id);

          // Calculate match score based on matching category IDs
          const eventCategoryIds = event.Event_Category_Junction.map(
            (junction) => junction.category_id
          );

          const matchScore =
            userCategoryIds.length > 0
              ? eventCategoryIds.reduce(
                  (score, categoryId) =>
                    userCategoryIds.includes(categoryId) ? score + 1 : score,
                  0
                )
              : 0;

          return {
            ...event,
            categories: eventCategoryIds,
            users: users,
            matchScore: matchScore,
          };
        })
      );

      // Sort by match score but maintain original order for equal scores
      const sortedEvents = [...processedEvents].sort(
        (a, b) => b.matchScore - a.matchScore
      );

      setCategories(categoriesData);
      setExperiences(sortedEvents);

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

  const handleSortClick = () => {
    setSortAscending(!sortAscending);
    setExperiences(sortExperiencesByDate([...experiences], sortAscending));
  };

  console.log(experiences);

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

      <div className="w-full flex flex-row px-4 mx-1 mt-3.5 justify-between lg:px-8">
        <h1 className="text-left text-lg font-extrabold lg:text-2xl">
          Local Experiences For You
        </h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 lg:size-8 cursor-pointer"
          onClick={handleSortClick}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
          />
        </svg>
      </div>

      {/* Events list */}
      <div className="w-full p-4 md:flex-row md:flex md:flex-wrap md:justify-between lg:px-8">
        {filteredExperiences.map((experience) => (
          <div
            key={experience.event_id}
            className="bg-white rounded-lg shadow-md mb-4 overflow-hidden cursor-pointer md:w-[48%] lg:w-[31%] lg:mb-8"
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
              <div className="flex justify-between items-center">
                <p className="text-gray-500 text-sm">
                  {formatDate(experience.event_time)}
                </p>
                <p className="text-gray-500 text-sm">
                  {experience.is_free ? "Free" : `$${experience.event_price}`}
                </p>
              </div>
              <h2 className="text-gray-700 font-bold text-md">
                {experience.event_name}
              </h2>
              <p className="text-gray-700 text-sm">
                {experience.event_zip_code}
              </p>
              <div className="w-full flex justify-end">
                <div className="flex flex-col items-center">
                  <div className="avatar-group -space-x-6 rtl:space-x-reverse mt-3">
                    {experience.users.length > 0 && (
                      <div className="avatar">
                        <div className="w-12">
                          <Image
                            src={
                              experience.users[0].photo_url ||
                              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            }
                            alt={experience.users[0].first_name}
                            width={400}
                            height={400}
                          />
                        </div>
                      </div>
                    )}
                    {experience.users.length > 1 && (
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-12">
                          <span>+{experience.users.length - 1}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center text-sm text-gray-500">
                    Interested
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
