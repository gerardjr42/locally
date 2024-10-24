"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserContext } from "@/contexts/UserContext";
import { BadgeCheck, Check, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AnimatePresence, interpolate, motion } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { calculateAge, fetchUserInterests, buildNameString } from "@/lib/utils";

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
  const [eventName, setEventName] = useState('');
  const { user } = useUserContext();

  const handleConnect = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const { data: existingMatch, error: matchError } = await supabase
      .from('Event_Matches')
      .select('*')
      .or(`and(attendee_id.eq.${user.user_id},interest_in_user_id.eq.${params.attendeeId}),and(attendee_id.eq.${params.attendeeId},interest_in_user_id.eq.${user.user_id})`)
      .eq('event_id', params.experienceId)
      .single();

    if (matchError && matchError.code !== 'PGRST116') {
      console.error("Error checking existing match:", matchError);
      return;
    }

    if (existingMatch) {
      const { data, error: updateError } = await supabase
        .from('Event_Matches')
        .update({ mutual_interest: true })
        .eq('match_id', existingMatch.match_id);

      if (updateError) {
        console.error("Error updating match:", updateError);
        return;
      }
    } else {
      const [lesserUserId, greaterUserId] = [user.user_id, params.attendeeId].sort();
      const { data, error: insertError } = await supabase
        .from('Event_Matches')
        .insert({
          attendee_id: lesserUserId,
          interest_in_user_id: greaterUserId,
          event_id: params.experienceId,
          mutual_interest: false,
          date_matched: new Date()
        });

      if (insertError) {
        console.error("Error inserting match:", insertError);
        return;
      }
    }

    setFeedback({ message: `Connected with ${interestedUser.first_name}!`, type: "connect" });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const handlePass = () => {
    setFeedback({ message: "Passed on Hudson", type: "pass" });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const handleBackClick = () => {
    router.push(`/experiences/${params.experienceId}/attendees`);
  };

  useEffect(() => {
    async function fetchData() {
      if (params.attendeeId && params.experienceId) {
        // Fetch user info
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('*')
          .eq('user_id', params.attendeeId)
          .single();

        if (userData && !userError) {
          setInterestedUser(userData);
        }

        const interests = await fetchUserInterests(params.attendeeId);
        setInterests(interests);
        
        const { data: eventData, error: eventError } = await supabase
          .from('Events')
          .select('event_name')
          .eq('event_id', params.experienceId)
          .single();

        if (eventData && !eventError) {
          setEventName(eventData.event_name);
        }
      }
    }

    fetchData();
  }, [params.attendeeId, params.experienceId, supabase]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-white min-h-screen font-sans text-gray-900"
    >
        <NavigationBar handleBackClick={handleBackClick} />
      <main className="pt-15 pb-24">
        <motion.div className="bg-gray-100 p-4" variants={slideUp}>
          <p className="font-semibold">{interestedUser.first_name} also wants to attend</p>
          <h2 className="text-xl font-bold">{eventName}!</h2>
        </motion.div>

        <motion.div
          className="aspect-square bg-gray-300 relative w-full h-full"
          variants={fadeIn}
        >
          <img
            src={interestedUser?.photo_url}
            alt={`${interestedUser?.first_name}'s Photo`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>

        <motion.div className="p-4 space-y-4" variants={slideUp}>
          <div>
            <h3 className="text-2xl font-bold">{buildNameString(interestedUser)}, {calculateAge(interestedUser.user_dob)}</h3>
            <p className="text-gray-600">{interestedUser.user_zipcode}</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Past Connections</p>
              <p className="text-xl font-bold">10</p>
            </div>
            <motion.div
              className="flex items-center bg-green-50 px-3 py-1 rounded-full border border-green-200"
              whileHover={{ scale: 1.05 }}
            >
              <BadgeCheck className="w-5 h-5 text-green-500 mr-1" />
              <p className="text-sm font-semibold text-green-700">
                Verified ID
              </p>
            </motion.div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-2">Interests</h4>
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
                    {/* You may need to add logic here to display the correct icon based on the interest name */}
                  </div>
                  <p className="text-[10px] mt-1 text-[#15B8A6] font-bold text-center">
                    {interest.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <Collapsible
            open={isExpanded}
            onOpenChange={setIsExpanded}
            className="space-y-2"
          >
            <motion.div className="text-gray-600" variants={fadeIn}>
              <p className="text-sm">
                {interestedUser.bio}
              </p>
              <CollapsibleContent className="text-sm">
                <p className="pt-2">
                  Capturing moments through the lens is my way of telling
                  stories, and my camera is always ready to seize the magic of
                  the moment. I&apos;m an avid film buff, always on the lookout
                  for the next cinematic masterpiece, enjoying everything from
                  indie films to blockbuster hits. The stage is where stories
                  come to life, and I love attending live theater performances,
                  whether it&apos;s a gripping drama or a lighthearted musical.
                </p>
                <p className="pt-2">
                  My furry friend is more than just a pet; they&apos;re family,
                  reminding me to enjoy the simple pleasures in life. Art is
                  everywhere, and I find inspiration in galleries, street
                  murals, and even in everyday objects, as I dabble in painting
                  and sketching. I&apos;m always eager to connect with fellow
                  enthusiasts and explorers, so feel free to reach out—I&apos;d
                  love to hear from you!
                </p>
              </CollapsibleContent>
            </motion.div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0">
                {isExpanded ? "Read less" : "Read more"}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
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
            Let's Not
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-1/2 bg-teal-500 text-white py-3 rounded-full font-semibold flex items-center justify-center"
            onClick={handleConnect}
            aria-label="Connect with Hudson"
          >
            <Check className="w-5 h-5 mr-2" />
            Let's Connect
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
