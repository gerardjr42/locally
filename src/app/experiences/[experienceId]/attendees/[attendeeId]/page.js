"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { useUserContext } from "@/contexts/UserContext";
import { fetchUserInterests } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function UserProfile() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClientComponentClient();
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isExpanded, setIsExpanded] = useState(false);
  const [interests, setInterests] = useState([]);
  const [interestedUser, setInterestedUser] = useState({});
  const [eventName, setEventName] = useState("");
  const { user } = useUserContext();
  const [userCity, setUserCity] = useState("");
  const [userCompliments, setUserCompliments] = useState([]);

  const handleConnect = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    let matchId;

    const { data: existingMatch, error: matchError } = await supabase

      .from("Event_Matches")
      .select("*")
      .or(
        `and(user1_id.eq.${user.user_id},user2_id.eq.${params.attendeeId}),and(user1_id.eq.${params.attendeeId},user2_id.eq.${user.user_id})`
      )
      .eq("event_id", params.experienceId)
      .single();

    if (matchError && matchError.code !== "PGRST116") {
      console.error("Error checking existing match:", matchError);
      return;
    }

    if (existingMatch) {
      const { data, error: updateError } = await supabase
        .from("Event_Matches")
        .update({ mutual_interest: true })
        .eq("match_id", existingMatch.match_id)
        .select();

      if (updateError) {
        console.error("Error updating match:", updateError);
        return;
      }
      matchId = existingMatch.match_id;
    } else {
      const [lesserUserId, greaterUserId] = [
        user.user_id,
        params.attendeeId,
      ].sort();
      const { data, error: insertError } = await supabase
        .from("Event_Matches")
        .insert({
          user1_id: lesserUserId,
          user2_id: greaterUserId,
          event_id: params.experienceId,
          mutual_interest: false,
          date_matched: new Date(),
        })
        .select();

      if (insertError) {
        console.error("Error inserting match:", insertError);
        return;
      }
      matchId = data[0].match_id;
    }

    const { data: updatedMatch, error: fetchError } = await supabase
      .from("Event_Matches")
      .select("*")
      .eq("match_id", matchId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated match:", fetchError);
      return;
    }

    setFeedback({
      message: `You've selected ${interestedUser.first_name}!`,
      type: "connect",
    });

    if (updatedMatch.mutual_interest) {
      setTimeout(() => router.push(`/connections/${matchId}`), 1000);
    } else {
      setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
    }
  };

  const handlePass = () => {
    setFeedback({ message: "Passed on Hudson", type: "pass" });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
    router.push(`/experiences/${params.experienceId}/attendees`);
  };

  const handleBackClick = () => {
    router.push(`/experiences/${params.experienceId}/attendees`);
  };

  useEffect(() => {
    async function fetchData() {
      if (params.attendeeId && params.experienceId) {
        // Fetch user info
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("*")
          .eq("user_id", params.attendeeId)
          .single();

        if (userData && !userError) {
          setInterestedUser(userData);
          if (userData.user_zipcode) {
            try {
              const response = await fetch(
                `/api/geocode?zipcode=${userData.user_zipcode}`
              );
              const data = await response.json();
              let cityStr = data.borough ? `${data.borough}` : `${data.city}`
              setUserCity(cityStr || "New York City");
            } catch (error) {
              console.error("Error fetching city:", error);
              setUserCity("Error fetching city");
            }
          }
        }

        const interests = await fetchUserInterests(params.attendeeId);
        setInterests(interests);

        const { data: eventData, error: eventError } = await supabase
          .from("Events")
          .select("event_name")
          .eq("event_id", params.experienceId)
          .single();

        if (eventData && !eventError) {
          setEventName(eventData.event_name);
        }
      }
    }

    fetchData();
  }, [params.attendeeId, params.experienceId, supabase]);

  console.log(interestedUser.icebreaker_responses);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-white min-h-screen font-sans text-gray-900"
    >
      <NavigationBar handleBackClick={handleBackClick} />
      <main className="pt-15 pb-24">
        <motion.div
          className="bg-gray-100 p-4 flex flex-row items-center"
          variants={slideUp}
        >
          <div className="avatar">
            <div className="w-24 rounded-full mx-4">
              <img
                src={interestedUser?.photo_url}
                alt={`${interestedUser?.first_name}'s Photo`}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-md font-semibold text-gray-600">
              {interestedUser?.first_name} is looking to connect at
            </p>
            <h2 className="text-md text-gray-600 font-semibold">
              {eventName}!
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="px-4 py-2 bg-teal-500 space-y-4 w-full flex flex-row items-center justify-evenly"
          variants={slideUp}
        >
          <div className="card text-white h-22 mx-1">
            <div className="card-body flex flex-col items-center p-3">
              <p className="text-xs text-center">Past Connections</p>
              <div className="card-actions justify-end">
                <p className="text-md font-bold text-center">10</p>
              </div>
            </div>
          </div>

          <div className="card bg-transparent text-white w-1/3 h-22 mx-1">
            <div className="card-body flex flex-col items-center p-3">
              <p className="text-xs text-center">Location</p>
              <div className="card-actions justify-end">
                <p className="text-md font-bold text-center">{userCity}</p>
              </div>
            </div>
          </div>

          <div className="card bg-transparent text-white w-1/3 h-22 mx-1">
            <div className="card-body flex flex-col items-center p-3">
              <p className="text-xs text-center">Verified</p>
              <div className="card-actions justify-center">
                <p className="text-md font-bold text-center">✓</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="px-4 pt-4" variants={slideUp}>
          <h4 className="text-sm text-gray-400 font-semibold mb-2">About Me</h4>
          <p className="text-lg text-center text-gray-500 font-semibold">
            {interestedUser.bio}
          </p>
        </motion.div>

        <motion.div className="p-4 space-y-4" variants={slideUp}>
          <div>
            <h4 className="text-sm text-gray-400 font-semibold mb-2">
              {" "}
              My Interests
            </h4>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {interests.map((interest, index) => (
                <motion.div
                  key={interest.id}
                  className="flex flex-col items-center cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    {interest.icon}
                  </div>
                  <p className="text-[10px] mt-1 text-[#15B8A6] font-bold text-center">
                    {interest.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* <Collapsible
            open={isExpanded}
            onOpenChange={setIsExpanded}
            className="space-y-2"
          >
            <motion.div className="text-gray-600" variants={fadeIn}>
              <CollapsibleContent className="text-sm">
                
              </CollapsibleContent>
            </motion.div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                {isExpanded ? "Read less" : "Read more"}
              </Button>
            </CollapsibleTrigger>
          </Collapsible> */}
        </motion.div>

        <motion.div className="px-6">
          <ul className="text-center text-gray-500 my-3">
            {interestedUser?.icebreaker_responses?.map((response) => {
              if (response.answer.length > 0) {
                return (
                  <li className="my-3" key={response.question}>
                    <p className="text-xs italic">
                      &quot;{response.question}&quot;
                    </p>
                    <p className="text-md font-semibold">{response.answer}</p>
                  </li>
                );
              }
            })}
          </ul>
        </motion.div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
        <div className="flex justify-between space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-1/2 bg-gray-300 text-gray-700 py-3 rounded-full font-semibold flex items-center justify-center"
            onClick={handlePass}
            aria-label="Pass on Hudson"
          >
            <X className="w-5 h-5 mr-2" />
            Let&apos;s Not
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-1/2 bg-teal-500 text-white py-3 rounded-full font-semibold flex items-center justify-center"
            onClick={handleConnect}
            aria-label="Connect with Hudson"
          >
            <Check className="w-5 h-5 mr-2" />
            Let&apos;s Connect!
          </motion.button>
        </div>
        <AnimatePresence>
          {feedback.message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`mt-4 p-3 rounded-lg text-center text-sm font-semibold ${
                feedback.type === "connect"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </motion.div>
  );
}
