"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import DOMPurify from 'dompurify';
import { exp } from "@tensorflow/tfjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { DynamicLoadingScreenComponent } from "@/components/dynamic-loading-screen";
import {
  MapPin,
  Tag,
  Users,
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
  SquareArrowOutUpRight,
} from "lucide-react";

import { useMatchmaking } from "@/contexts/MatchmakingContext";
import { useUser } from "@/hooks/useUser";
import { fetchUsersForExperience, formatDate } from "@/lib/utils";
import { fetchTopMatches } from "@/lib/matchmaking";


export default function ExperienceDetails() {
  const params = useParams();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const descriptionRef = useRef(null);

  const [experience, setExperience] = useState(null);
  const [allAttendees, setAllAttendees] = useState([]);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [interested, setInterested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [experienceCategories, setExperienceCategories] = useState([]);
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [topMatches, setTopMatches] = useState([]);
  const [top3Matches, setTop3Matches] = useState([]);
  const { user, loading: userLoading } = useUser();
  const isDisabled = !isInterested;

  const sanitizedTitle = DOMPurify.sanitize(experience?.event_name);
  const sanitizedDescription = DOMPurify.sanitize(experience?.event_details);
  
  
  const memoizedTopMatches = useMemo(() => topMatches, [topMatches]);
  const memoizedInterestedUsers = useMemo(
    () => interestedUsers,
    [interestedUsers]
  );

  const categories = [
    { id: 1, name: "Entertainment", icon: <Ticket className="w-5 h-5" /> },
    { id: 2, name: "Food & Drink", icon: <Utensils className="w-5 h-5" /> },
    { id: 3, name: "Sports & Fitness", icon: <Dumbbell className="w-5 h-5" /> },
    { id: 4, name: "Outdoor", icon: <Mountain className="w-5 h-5" /> },
    { id: 5, name: "Health & Wellness", icon: <Heart className="w-5 h-5" /> },
    {
      id: 6,
      name: "Faith & Spirituality",
      icon: <Church className="w-5 h-5" />,
    },
    { id: 7, name: "Professional", icon: <Briefcase className="w-5 h-5" /> },
    { id: 8, name: "Music", icon: <Music className="w-5 h-5" /> },
    { id: 9, name: "Travel & Adventure", icon: <Plane className="w-5 h-5" /> },
    {
      id: 10,
      name: "Education & Learning",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    { id: 11, name: "Arts & Culture", icon: <Palette className="w-5 h-5" /> },
    { id: 12, name: "Free", icon: <DollarSign className="w-5 h-5" /> },
  ];

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : null;
  };

  const fetchExperienceCategories = async (experienceId) => {
    const { data, error } = await supabase
      .from("Event_Category_Junction")
      .select("category_id")
      .eq("event_id", experienceId);

    if (error) {
      console.error("Error fetching experience categories:", error);
    } else {
      const categoryIds = data.map((item) => item.category_id);
      setExperienceCategories(categoryIds);
    }
  };

  const { getMatchmakingResults, cacheMatchmakingResults } = useMatchmaking();
  
  const handleFetchTopMatches = useCallback(
    async (userId, eventId) => {
      setIsMatchmaking(true);
      try {
        const results = await fetchTopMatches(
          userId,
          eventId,
          cacheMatchmakingResults
        );
        if (results) {
          setTopMatches(results.matches);
          setInterestedUsers(results.interestedUsers);
        }
        return results;
      } finally {
        setIsMatchmaking(false);
      }
    },
    [cacheMatchmakingResults]
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchExperienceAndUsers() {
      if (userLoading) return;

      try {
        const { data: experienceData, error: experienceError } = await supabase
          .from("Events")
          .select(
            `
            *,
            Event_Category_Junction (
              category_id
            ),
            is_free
          `
          )
          .eq("event_id", params.experienceId)
          .single();

        if (experienceError) {
          console.error("Error fetching experience:", experienceError);
          setLoading(false);
          return;
        }
        
        if (isMounted) {
          setExperience(experienceData);

          if (user) {
            const { data, error } = await supabase
              .from("User_Events")
              .select()
              .eq("event_id", params.experienceId)
              .eq("user_id", user.user_id)
              .single();

            if (data && data.expressed_interest) {
              setIsInterested(true);

              // Check cache first
              const cachedResults = getMatchmakingResults(params.experienceId);
              if (cachedResults) {
                setTopMatches(cachedResults.matches);
                setInterestedUsers(cachedResults.interestedUsers);
              } else {
                // Fetch and cache if no cached results
                try {
                  await handleFetchTopMatches(
                    user.user_id,
                    params.experienceId
                  );
                } catch (error) {
                  console.error("Error fetching top matches:", error);
                }
              }
            }
          }

        }

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchExperienceAndUsers();
    return () => {
      isMounted = false;
    };
  }, [
    params.experienceId,
    supabase,
    user,
    userLoading,
    getMatchmakingResults,
    handleFetchTopMatches,
  ]);

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(descriptionRef.current).lineHeight
      );
      const maxHeight = lineHeight * 4; // 4 lines
      setShowReadMore(descriptionRef.current.scrollHeight > maxHeight);
    }
  }, [experience]);

  useEffect(() => {
    async function loadInterestedUsers() {
      const users = await fetchUsersForExperience(
        supabase,
        params.experienceId
      );
      setInterested(users);
      setAllAttendees([...users]);
    }
    loadInterestedUsers();
  }, [params.experienceId, supabase]);

  const handleInterestClick = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    if (isInterested) {
      const { error } = await supabase
        .from("User_Events")
        .delete()
        .eq("event_id", params.experienceId)
        .eq("user_id", user.user_id);

      if (error) {
        console.error("Error removing interest:", error);
      } else {
        setIsInterested(false);
        setInterestedUsers((prevUsers) =>
          prevUsers.filter((u) => u.user_id !== user.user_id)
        );
        setTopMatches([]); // Clear top matches when uninterested
      }
    } else {
      setLoading(true);
      const { error } = await supabase
        .from("User_Events")
        .insert({ event_id: params.experienceId, user_id: user.user_id });

      if (error) {
        console.error("Error adding interest:", error);
        setLoading(false);
      } else {
        setIsInterested(true);
        try {
          await handleFetchTopMatches(user.user_id, params.experienceId);
        } catch (error) {
          console.error("Error fetching top matches:", error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  if (loading) {
    return isMatchmaking ? (
      <DynamicLoadingScreenComponent />
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!experience) {
    return <div>Experience not found</div>;
  }

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const age = new Date(difference);
    return Math.abs(age.getUTCFullYear() - 1970);
  }

  const handleBackClick = () => {
    router.push(`/experiences`);
  };

  return (
    <div>
      <NavigationBar handleBackClick={handleBackClick} />
      <div className="bg-white min-h-screen">
        <div className="relative h-64 mb-4">
          <Image
            src={experience.event_image_url}
            alt={experience.event_name}
            layout="fill"
            objectFit="cover"
          />
          <div className=" flex flex-col absolute bottom-0 left-0 right-0 p-4 bg-gray-800 bg-opacity-40">
            <div className="flex flex-row item">
            
              <a
                href={experience.event_url}
                className="text-3xl font-bold mb-2 text-white"
                dangerouslySetInnerHTML={{
                  __html: sanitizedTitle,
                }}
              >
              </a>
              <a
                href={experience.event_url}>
              <SquareArrowOutUpRight className="w-4 h-4 text-white m-0.5 ml-1" />
              </a>
            </div>
            <div className="flex flex-row">
              <MapPin className="w-4 h-4 text-white mt-0.5 mr-1" />
              <p className="font-semibold text-sm text-white">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    experience.event_location_name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {experience.event_location_name
                    ? experience.event_location_name
                    : experience.event_street_address}
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 mb-4">
          <div className="flex flex-row justify-between text-gray-600 font-semibold text-sm">
            <p className="mb-4">{formatDate(experience.event_time)}</p>
            <p>
              {new Date(experience.event_time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "UTC",
              })}
            </p>
          </div>

          <div className="flex flex-row justify-center">
            <Button
              className="w-3/4 bg-teal-500 text-white text-sm p-6 my-2 rounded-full font-semibold flex items-center justify-center"
              onClick={handleInterestClick}
            >
              {isInterested ? "Not Interested" : "I'm Interested!"}
            </Button>
          </div>

          <div className="my-6">
            {allAttendees.length > 0 ? (
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-gray-700 text-md font-semibold">
                  {allAttendees.length} Interested Locals
                </h2>
                <Button
                  variant="link"
                  className="text-sm bg-gray-200 rounded-lg"
                  disabled={isDisabled}
                  onClick={() =>
                    router.push(
                      `/experiences/${params.experienceId}/attendees`,
                      {
                        state: {
                          topMatches: memoizedTopMatches,
                          interestedUsers: memoizedInterestedUsers,
                        },
                      }
                    )
                  }
                >
                  View All
                </Button>
              </div>
            ) : (
              <div className="flex items-center mb-3">
                <h2 className="text-gray-500 text-md font-semibold">
                  No interested Locals, yet - Be the first!
                </h2>
              </div>
            )}

            <div className="flex space-x-3 overflow-x-auto pb-2">
              {interestedUsers.map((user, index) => (
                <div key={user.user_id} className="flex-shrink-0 w-20">
                  <div className="relative mb-1">
                    <div
                      className="rounded-full overflow-hidden w-20 h-20 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/experiences/${params.experienceId}/attendees/${user.user_id}`
                        )
                      }
                    >
                      <Image
                        src={user.photo_url || "/default-avatar.png"}
                        alt={`${user.first_name} ${user.last_name}`}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    {index < 3 && (
                      <span className="absolute top-0 right-0 bg-teal-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px]">
                        Top Match
                      </span>
                    )}
                  </div>
                  <p className="text-center text-xs">
                    {user.first_name}, {calculateAge(user.user_dob)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700">
              Experience Details
            </h3>
            {experience.event_details[0] !== "<" ? (
              <p className="text-gray-500 text-sm">
                {experience.event_details}
              </p>
            ) : (
              <div
                className="text-gray-500 text-sm"
                dangerouslySetInnerHTML={{
                  __html: sanitizedDescription,
                }}
              />
            )}
            {/* <p className="text-gray-500 text-sm">{experience.event_details}</p> */}
            <div className="flex flex-row flex-wrap justify-evenly items-center py-4">
              {experienceCategories.map((categoryNum, index) => {
                let category = categories.find((c) => c.id === categoryNum);
                return (
                  <div
                    key={index}
                    className="bg-transparent outline text-teal-500 text-sm px-2 py-1 mx-0.5 my-1 rounded-full"
                  >
                    {category.name}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col text-gray-500 text-sm justify-center px-12">
              <div className="flex flex-row items-center justify-between text-sm">
                <div className="flex flex-row items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <h3>Entry Fee</h3>
                </div>
                <p>
                  {experience.is_free ? "Free" : `$${experience.event_price}`}
                </p>
              </div>
              <div className="flex flex-row items-center justify-between text-sm">
                <div className="flex flex-row items-center text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <h3>Capacity</h3>
                </div>
                <p>
                  {experience.event_capacity
                    ? `${experience.event_capacity}`
                    : "Limited"}
                </p>
              </div>
              <div className="flex flex-row items-center justify-between text-sm">
                <div className="flex flex-row items-center text-sm">
                  <Ticket className="w-4 h-4 mr-2" />
                  <h3>Host</h3>
                </div>
                <p>{experience.event_host}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
