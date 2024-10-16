"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Camera,
  Check,
  Dog,
  Film,
  Palette,
  Theater,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const interests = [
  { name: "Photography", icon: Camera },
  { name: "Film", icon: Film },
  { name: "Theatre", icon: Theater },
  { name: "Dogs", icon: Dog },
  { name: "Art", icon: Palette },
];

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
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleConnect = () => {
    setFeedback({ message: "Connected with Hudson!", type: "connect" });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const handlePass = () => {
    setFeedback({ message: "Passed on Hudson", type: "pass" });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const handleBackClick = () => {
    router.push(`/experiences/${params.experienceId}/attendees`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-white min-h-screen font-sans text-gray-900"
    >
      <header className="bg-white p-4 flex justify-between items-center shadow-sm fixed top-0 left-0 right-0 z-10">
        <NavigationBar handleBackClick={handleBackClick} />
      </header>
      <main className="pt-16 pb-24">
        <motion.div className="bg-gray-100 p-4" variants={slideUp}>
          <p className="font-semibold">Hudson also wants to attend</p>
          <h2 className="text-xl font-bold">Movies In The Park!</h2>
        </motion.div>

        <motion.div
          className="aspect-square bg-gray-300 relative"
          variants={fadeIn}
        >
          <Image
            src="/placeholder.svg"
            alt="Hudson's profile picture"
            layout="fill"
            objectFit="cover"
          />
        </motion.div>

        <motion.div className="p-4 space-y-4" variants={slideUp}>
          <div>
            <h3 className="text-2xl font-bold">Hudson R., 32</h3>
            <p className="text-gray-600">New York, NY</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Events Attended</p>
              <p className="text-xl font-bold">19</p>
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
            <h4 className="text-lg font-bold mb-2">INTERESTS</h4>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {interests.map((interest, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <interest.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="text-[10px] mt-1 text-[#15B8A6] font-bold">
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
            className="w-1/2 bg-teal-500 text-white py-3 rounded-full font-semibold flex items-center justify-center"
            onClick={handleConnect}
            aria-label="Connect with Hudson"
          >
            <Check className="w-5 h-5 mr-2" />
            Connect
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-1/2 bg-gray-300 text-gray-700 py-3 rounded-full font-semibold flex items-center justify-center"
            onClick={handlePass}
            aria-label="Pass on Hudson"
          >
            <X className="w-5 h-5 mr-2" />
            Pass
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
