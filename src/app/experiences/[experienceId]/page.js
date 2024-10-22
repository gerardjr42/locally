"use client";

import { NavigationBar } from "@/components/navigation-bar";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { fetchUsersForExperience } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Clock, DollarSign, MapPin, Tag, Users } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ExperienceDetails() {
  const [experience, setExperience] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [interested, setInterested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const params = useParams();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const descriptionRef = useRef(null);
  const [topMatches, setTopMatches] = useState([]);
  const [top3Matches, setTop3Matches] = useState([]);

  useEffect(() => {
    async function fetchExperienceAndUsers() {
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

      setExperience(experienceData);

      const { data: userData, error: userError } = await supabase
        .from("User_Events")
        .select(
          `
          user_id,
          expressed_interest,
          Users (
            user_id,
            first_name,
            last_name,
            user_dob,
            photo_url
          )
        `
        )
        .eq("event_id", params.experienceId)
        .eq("expressed_interest", true);

      if (userError) {
        console.error("Error fetching interested users:", userError);
      } else {
        setInterestedUsers(userData.map((item) => item.Users));
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("User_Events")
          .select()
          .eq("event_id", params.experienceId)
          .eq("user_id", user.id)
          .single();

        if (data && data.expressed_interest) {
          setIsInterested(true);
        }
      }

      setLoading(false);
    }

    fetchExperienceAndUsers();
  }, [params.experienceId, supabase]);

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
    }

    loadInterestedUsers();
    console.log(interested);
  }, [params.experienceId]);

  const fetchTopMatches = async (userId, eventId) => {
    try {
      const response = await fetch("/api/matchmaking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, eventId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("All Matches:", data.matches);
      console.log("Top 3 Matches:", data.top3Matches);
      setTopMatches(data.matches);
      setTop3Matches(data.top3Matches);
    } catch (error) {
      console.error("Error fetching top matches:", error);
    }
  };

  const handleInterestClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    if (isInterested) {
      const { error } = await supabase
        .from("User_Events")
        .delete()
        .eq("event_id", params.experienceId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error removing interest:", error);
      } else {
        setIsInterested(false);
        setInterestedUsers((prevUsers) =>
          prevUsers.filter((u) => u.user_id !== user.id)
        );
      }
    } else {
      const { error } = await supabase
        .from("User_Events")
        .insert({ event_id: params.experienceId, user_id: user.id });

      if (error) {
        console.error("Error adding interest:", error);
      } else {
        setIsInterested(true);
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("user_id, first_name, last_name, user_dob, photo_url")
          .eq("user_id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
        } else {
          setInterestedUsers((prevUsers) => [...prevUsers, userData]);
        }
      }
    }

    if (!isInterested) {
      if (user) {
        await fetchTopMatches(user.id, params.experienceId);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
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
        </div>
        <div className="px-4 py-4">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            {experience.event_name}
          </h1>
          <p className="text-gray-600 mb-4 text-sm">
            {formatDate(experience.event_time)}
          </p>
          <Button
            className="w-full mb-6 text-white bg-teal-400 hover:bg-teal-500 transition-colors"
            onClick={handleInterestClick}
          >
            {isInterested ? "Not Interested" : "I'm interested!"}
          </Button>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                {interestedUsers.length} Interested locals
              </h2>
              <Button
                variant="link"
                className="text-sm bg-gray-200 rounded-lg"
                onClick={() =>
                  router.push(`/experiences/${params.experienceId}/attendees`)
                }
              >
                View all
              </Button>
            </div>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {top3Matches.map((userId) => {
                const user = interestedUsers.find((u) => u.user_id === userId);
                if (user) {
                  return (
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
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                        <span className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px]">
                          Top Match
                        </span>
                      </div>
                      <p className="text-center text-xs">
                        {user.first_name}, {calculateAge(user.user_dob)}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
              {interestedUsers
                .filter((user) => !top3Matches.includes(user.user_id))
                .slice(0, 5 - top3Matches.length)
                .map((user) => (
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
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                      <p className="text-center text-xs">
                        {user.first_name}, {calculateAge(user.user_dob)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div>
              <h3 className="text-sm font-semibold mb-1 text-gray-700">
                Category
              </h3>
              <div className="flex items-center text-gray-600 text-sm">
                <Tag className="w-4 h-4 mr-1" />
                <p>{experience.Event_Category_Junction[0]?.category_id}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1 text-gray-700">
                Entry Fee
              </h3>
              <div className="flex items-center text-gray-600 text-sm">
                <DollarSign className="w-4 h-4 mr-1" />
                <p>
                  {experience.is_free ? "Free" : `$${experience.event_price}`}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1 text-gray-700">
                Capacity
              </h3>
              <div className="flex items-center text-gray-600 text-sm">
                <Users className="w-4 h-4 mr-1" />
                <p>{experience.event_capacity}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 items-start mb-6">
            <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-gray-800">
                {experience.event_street_address}
              </p>
            </div>
            <Clock className="w-4 h-4 text-gray-600 mt-0.5" />
            <p className="text-gray-600 text-sm">
              {new Date(experience.event_time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "UTC",
              })}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Description
            </h3>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={isExpanded ? "description" : ""}
              onValueChange={(value) => setIsExpanded(value === "description")}
            >
              <AccordionItem value="description" className="border-none">
                <div>
                  <p
                    ref={descriptionRef}
                    className={`text-gray-600 text-sm leading-relaxed mb-2 ${
                      !isExpanded ? "line-clamp-4" : ""
                    }`}
                  >
                    {experience.event_details}
                  </p>
                  {showReadMore && (
                    <AccordionTrigger className="p-0 hover:no-underline">
                      <span className="text-blue-500 text-sm">
                        {isExpanded ? "Read Less" : "Read More.."}
                      </span>
                    </AccordionTrigger>
                  )}
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
