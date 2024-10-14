"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      await fetchInterests();
      await fetchUserInterests();
    };
    fetchData();
  }, []);

  const fetchInterests = async () => {
    try {
      const { data, error } = await supabase
        .from("Interests")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      // Group interests by category while preserving order
      const groupedInterests = data.reduce((acc, interest) => {
        const existingCategory = acc.find(
          (item) => item.category === interest.category
        );
        if (existingCategory) {
          existingCategory.items.push(interest);
        } else {
          acc.push({ category: interest.category, items: [interest] });
        }
        return acc;
      }, []);

      setInterests(groupedInterests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching interests:", error);
      setLoading(false);
    }
  };

  const fetchUserInterests = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("User_Interests")
        .select("interest")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user interests:", error);
      } else {
        const userInterests = data.map((item) => item.interest);
        setSelectedInterests(userInterests);
      }
    }
  };

  const toggleInterest = async (interest) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const interestExists = selectedInterests.some((i) => i.id === interest.id);

    if (interestExists) {
      // Remove interest
      const { error } = await supabase
        .from("User_Interests")
        .delete()
        .eq("user_id", user.id)
        .eq("interest->id", interest.id);

      if (error) {
        console.error("Error removing interest:", error);
      } else {
        setSelectedInterests((prev) =>
          prev.filter((i) => i.id !== interest.id)
        );
      }
    } else {
      // Add interest
      const { error } = await supabase.from("User_Interests").insert({
        user_id: user.id,
        interest: { id: interest.id, icon: interest.icon, name: interest.name },
      });

      if (error) {
        console.error("Error adding interest:", error);
      } else {
        setSelectedInterests((prev) => [...prev, interest]);
      }
    }
  };

  const handleContinue = () => {
    router.push("/register/photo");
  };

  if (loading) {
    return <div>Loading interests...</div>;
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-8 ">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/register/aboutme")}
        >
          <ArrowLeft className="mr-2 h-10 w-4" />
        </Button>

        <div className="mb-6">
          <Progress value={60} className="h-2" />
          <div className="flex justify-between mt-2 text-sm font-medium text-[#0D9488]">
            <span>Profile Creation</span>
            <span>60%</span>
          </div>
        </div>

        <div className="text-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Interests</h2>
          <p className="text-sm text-gray-600 mt-2">
            Select at least 3 interests to help us find the best events for you
          </p>
        </div>

        <div className="space-y-4">
          {interests.map((category) => (
            <div key={category.category} className="space-y-2">
              <h3 className="text-lg font-semibold">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <Button
                    key={item.id}
                    variant={
                      selectedInterests.some((i) => i.id === item.id)
                        ? "default"
                        : "outline"
                    }
                    className={`text-sm ${
                      selectedInterests.some((i) => i.id === item.id)
                        ? "bg-[#0D9488] hover:bg-[#0B7A6E] text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleInterest(item)}
                  >
                    {item.icon} {item.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-[#0D9488] hover:bg-[#0B7A6E] text-white w-full max-w-[200px]"
            disabled={selectedInterests.length < 3}
          >
            Continue
          </Button>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
