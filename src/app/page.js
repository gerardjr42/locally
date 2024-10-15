"use client";
import { useUserContext } from '@/contexts/UserContext';
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
  const { user } = useUserContext();
  console.log("User:", user);

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
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="relative flex-grow flex items-center justify-center">
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
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
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
      <div className="relative z-10 p-6">
        <div className="mb-8 flex justify-center space-x-2">
          {onboardingContent.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-4" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button
            onClick={() => router.push("/register")}
            className="w-full bg-white text-black hover:bg-gray-200 transition-colors duration-300"
            size="lg"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
