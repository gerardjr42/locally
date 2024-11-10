"use client";
import { NavigationBar } from "@/components/navigation-bar";
import { useUserContext } from "@/contexts/UserContext";
import { buildNameString, calculateAge, fetchUserInterests } from "@/lib/utils";

import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Image from "next/image";
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
  const [bio, setBio] = useState("");
  const [age, setAge] = useState(0);
  const [name, setName] = useState(``);
  const [interests, setInterests] = useState([]);

  const bioSliceIndex = 250;
  const bioSummary = bio.slice(0, bioSliceIndex);
  const bioContinued = bio.slice(bioSliceIndex);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  useEffect(() => {
    if (user) {
      handleAge();
      buildNameString(user);
      setName(buildNameString(user));
      setBio(user.bio || "");
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
      className="bg-white min-h-screen font-sans text-gray-700"
    >
      <NavigationBar handleBackClick={() => router.back()} />
      <main>
        <motion.div
          className="aspect-square bg-gray-300 relative w-full h-full"
          variants={fadeIn}
        >
          <Image
            src={user?.photo_url}
            alt={`${user?.first_name}'s Photo`}
            width={500}
            height={500}
            className="absolute inset-0 w-full h-full object-cover"
            onClick={() => {
              if (isEditing) {
                router.push("/account/photo");
              }
            }}
          />
        </motion.div>

        <motion.div variants={slideUp}>
          <div className="px-4 py-2 flex flex-row justify-between bg-teal-500 text-white">
            <h3 className="text-2xl font-bold">{name}</h3>
            <p>{age} y.o.</p>
          </div>

          <motion.div
            className="px-4 py-2 w-full flex flex-row justify-between items-start bg-teal-500 text-white"
            variants={slideUp}
          >
            <div className="card bg-transparent w-1/3 h-full mx-1 flex flex-col">
              <div className="card-body flex flex-col p-1">
                <p className="text-xs text-center">Connections</p>
                <div className="card-actions justify-end">
                  <p className="text-md font-bold text-center">2</p>
                </div>
              </div>
            </div>

            <div className="card bg-transparent w-1/3 h-full mx-1 flex flex-col">
              <div className="card-body flex flex-col p-1">
                <p className="text-xs text-center">Location</p>
                <div className="card-actions justify-end">
                  <p className="text-md font-bold text-center">
                    {user?.user_zipcode}
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-transparent w-1/3 h-full mx-1 flex flex-col">
              <div className="card-body flex flex-col p-1">
                <p className="text-xs text-center">Verified</p>
                <div className="card-actions justify-center">
                  <p className="text-md font-bold text-center">✓</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="py-4">
            <h4 className="text-lg text-gray-600 font-bold mb-2 px-4">
              My Interests
            </h4>
            <motion.div className="px-6 pt-4 pb-6 space-y-4" variants={slideUp}>
              <div className="flex justify-evenly flex-wrap space-x-4 overflow-x-auto pb-2">
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
            </motion.div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 px-4 pb-6">
            <div className="flex flex-row justify-between items-center w-full">
              <h4 className="text-lg font-bold mb-2">About Me</h4>
              <motion.button
                className="w-1/3 text-teal-500 bg-transparent outline px-3 py-1 rounded-full font-semibold flex items-center justify-center hover:bg-white focus:bg-white active:bg-teal-500 hover:text-teal-500 focus:text-teal-500 active:text-white focus:outline-none"
                aria-label="Edit Bio"
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
              >
                <Pencil className="mr-2" />
                {isEditing ? "Save" : "Edit Bio"}
              </motion.button>
            </div>
            <motion.div className="w-full text-gray-600" variants={fadeIn}>
              {!isEditing ? (
                <div className="pt-2">
                  <p className="text-md text-center font-semibold">
                    {user?.bio}
                  </p>
                </div>
              ) : (
                <textarea
                  value={bio}
                  onChange={handleBioChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={5}
                />
              )}
            </motion.div>
          </div>

          <motion.div className="px-6">
            <ul className="text-center my-3">
              {user?.icebreaker_responses?.map((response, index) => {
                if (response.answer.length > 0) {
                  return (
                    <li
                      key={index}
                      className="card bg-neutral text-neutral-content w-7/8 my-2"
                    >
                      <div className="card-body text-left">
                        <p>{response.question}</p>
                        <div className="card-actions justify-end">
                          <p className="text-md font-bold text-gray-100">
                            &ldquo;{response.answer}&rdquo;
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
