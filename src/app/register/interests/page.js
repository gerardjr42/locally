"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function InterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
    if (
      selectedInterests.length >= 10 &&
      !selectedInterests.some((i) => i.id === interest.id)
    ) {
      return; // Don't add more than 10 interests
    }

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

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    router.push("/register/photo");
  };

  const filterInterests = (interests, searchTerm) => {
    return interests
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.items.length > 0);
  };

  const filteredInterests = searchTerm
    ? filterInterests(interests, searchTerm)
    : interests;

  if (loading) {
    return <div>Loading interests...</div>;
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-4">
        <PageHeader
          onBackClick={() => router.push("/register/aboutme")}
          progressValue={60}
          progressText="60%"
        />

        <Input
          type="text"
          placeholder="Search interests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <h1 className="text-2xl font-bold mb-4">Interests</h1>

        {selectedInterests.length >= 3 && selectedInterests.length <= 10 ? (
          <p className="text-gray-600 mb-4">
            You&apos;ve chosen {selectedInterests.length} interest
            {selectedInterests.length !== 1 ? "s" : ""}. They sound great!
          </p>
        ) : (
          <p className="text-gray-600 mb-4">
            Select at least 3 interests (max 10) to help us find the best events
            for you.
          </p>
        )}

        <div className="space-y-6">
          {filteredInterests.map((category) => (
            <div key={category.category} className="space-y-2">
              <h2 className="text-xl font-semibold">{category.category}</h2>
              <div className="flex flex-wrap gap-2">
                {category.items
                  .slice(
                    0,
                    expandedCategories.includes(category.category)
                      ? category.items.length
                      : 8
                  )
                  .map((item) => (
                    <Button
                      key={item.id}
                      variant={
                        selectedInterests.some((i) => i.id === item.id)
                          ? "default"
                          : "outline"
                      }
                      className={`rounded-full text-sm ${
                        selectedInterests.some((i) => i.id === item.id)
                          ? "bg-[#0D9488] hover:bg-[#0B7A6E] text-white"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() => toggleInterest(item)}
                      disabled={
                        selectedInterests.length >= 10 &&
                        !selectedInterests.some((i) => i.id === item.id)
                      }
                    >
                      {item.icon} {item.name}
                    </Button>
                  ))}
              </div>
              {category.items.length > 8 && !searchTerm && (
                <Button
                  variant="ghost"
                  className="text-[#0D9488] hover:text-[#0B7A6E]"
                  onClick={() => toggleCategory(category.category)}
                >
                  {expandedCategories.includes(category.category)
                    ? "Show less"
                    : "Show more"}
                </Button>
              )}
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
