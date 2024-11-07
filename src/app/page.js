"use client";
// import { useUserContext } from '@/contexts/UserContext';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const onboardingContent = [
  {
    title: "/images/LocallyTitle.png",
    subtitle:
      "Connect with others through shared interests at local activities.",
    image: "/images/friends4.jpg",
  },
  {
    title: "Discover Events",
    subtitle: "Find exciting activities happening in your area.",
    image: "/images/friends-5-mobile.jpg",
  },
  {
    title: "Meet New People",
    subtitle: "Connect with like-minded individuals at outings you love.",
    image: "/images/friends-6-mobile.jpg",
  },
  {
    title: "Create Memories",
    subtitle: "Share experiences and make lasting connections.",
    image: "/images/friends-7-mobile.jpg",
  },
  {
    title: "Get Started",
    subtitle: "Your journey to local connections begins now.",
    image: "/images/friends-2-mobile.jpg",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  // const { user } = useUserContext();
  // console.log("User:", user);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % onboardingContent.length
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const isLastPage = currentIndex === onboardingContent.length - 1;

  return (
    <div className="relative h-screen bg-black text-white overflow-hidden">
      {/* Background Images */}
      {onboardingContent.map((content, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={content.image}
            alt={`Onboarding image ${index + 1}`}
            layout="fill"
            objectFit="cover"
            quality={100}
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Main Content */}
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center px-6 max-w-2xl mx-auto">
            {currentIndex === 0 ? (
              <div className="w-64 h-24 mx-auto mb-8 relative animate-fade-in-up">
                <Image
                  src={onboardingContent[0].title}
                  alt="Locally Logo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : (
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-fade-in-up">
                {onboardingContent[currentIndex].title}
              </h1>
            )}
            <p className="text-xl sm:text-2xl mb-8 animate-fade-in-up delay-200">
              {onboardingContent[currentIndex].subtitle}
            </p>
          </div>
        </div>

        {/* Bottom Navigation and Buttons */}
        <div className="p-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex flex-col items-center"
          >
            <Button
              onClick={() => router.push("/register")}
              className="w-3/4 bg-white text-black text-sm p-2 my-2 rounded-full font-semibold flex items-center justify-center align-middle"
              size="lg"
            >
              Get Started
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="w-3/4 bg-teal-500 text-white text-sm p-2 my-2 rounded-full font-semibold flex items-center justify-center align-middle"
              size="lg"
            >
              Log In
            </Button>
          </motion.div>

          {/* Moved slideshow indicators here */}
          <div className="mt-8 flex justify-center space-x-2">
            {onboardingContent.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white w-4" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
