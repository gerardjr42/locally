"use client";
import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { calculateAge, fetchUserInterests, buildNameString } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  Check,
  Dog,
  Film,
  Menu,
  Palette,
  Theater,
  Pencil,
  X,
} from "lucide-react";
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

export default function Account() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(``);
  const [age, setAge] = useState(0);
  const [name, setName] = useState(``);
  const [interests, setInterests] = useState([]);

  const bioSliceIndex = 250;
  const bioSummary = bio.slice(0, bioSliceIndex);
  const bioContinued = bio.slice(bioSliceIndex);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleBioChange = (user) => {
    setBio(user.bio);
  };

  useEffect(() => {
    if (user) {
      handleAge();
      buildNameString(user);
      setName(buildNameString(user));
      fetchUserInterests(user.user_id).then((fetchedInterests) => {
        setInterests(fetchedInterests);
      });
    }
  }, [user]);

  const handleAge = () => {
    const birthdate = new Date(user.user_dob);
    const age = calculateAge(birthdate);
    setAge(age);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-white min-h-screen font-sans text-gray-900"
    >
      <NavigationBar />
      <main className="pb-24">
        <motion.div
          className="aspect-square bg-gray-300 relative w-full h-full"
          variants={fadeIn}
        >
          <img
            src={user?.photo_url}
            alt={`${user?.first_name}'s Photo`}
            className="absolute inset-0 w-full h-full object-cover"
            onClick={() => {
              if (isEditing) {
                router.push("/account/photo");
              }
            }}
          />
        </motion.div>

        <motion.div className="p-4 space-y-4" variants={slideUp}>
          <div>
            <h3 className="text-2xl font-bold">
              {name}, {age}
            </h3>
            <p className="text-gray-600">New York, NY</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Past Connections</p>
              <p className="text-xl font-bold">19</p>
            </div>
            <motion.div
              className="flex items-center bg-green-50 px-3 py-1 rounded-full border border-green-200 w-auto"
              whileHover={{ scale: 1.05 }}
            >
              <BadgeCheck className="w-5 h-5 text-green-500 mr-1" />
              <p className="text-sm font-semibold text-green-700 whitespace-nowrap">
                You've verified by ID
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
                  onClick={() => {
                    if (isEditing) {
                      router.push("/account/interests");
                    }
                  }}
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
          <Collapsible
            open={isExpanded}
            onOpenChange={setIsExpanded}
            className="space-y-2"
          >
            <motion.div className="text-gray-600" variants={fadeIn}>
              {!isEditing ? (
                <>
                  {isExpanded && <p className="text-sm">{user?.bio}</p>}
                  <CollapsibleContent className="text-sm">
                    {!isExpanded && <p className="pt-2"></p>}
                  </CollapsibleContent>
                </>
              ) : (
                <textarea
                  value={bio}
                  onChange={handleBioChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={5}
                />
              )}
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
            className="w-1/2 bg-teal-500 text-white py-3 rounded-full font-semibold flex items-center justify-center hover:bg-teal-600 focus:bg-teal-600 active:bg-teal-700 focus:outline-none"
            aria-label="Edit profile"
            onClick={() => {
              setIsEditing(!isEditing);
            }}
          >
            <Pencil className="mr-2" />
            {isEditing ? "Save" : "Edit profile"}
          </motion.button>
        </div>
      </footer>
    </motion.div>
  );
}
