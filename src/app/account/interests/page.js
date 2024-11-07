"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function AccountInterests() {
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

  const handleBackNavigation = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/account");
    }
  };

  const fetchInterests = async () => {
    try {
      const { data, error } = await supabase
        .from("Interests")
        .select("*")
        .order("category_id", { ascending: true });

      if (error) throw error;

      const groupedInterests = await Promise.all(
        data.map(async (interest) => {
          const categoryName = await fetchCategoryNameByInterestId(interest.id);
          return {
            ...interest,
            categoryName,
          };
        })
      );

      const categorizedInterests = groupedInterests.reduce((acc, interest) => {
        const existingCategory = acc.find(
          (item) => item.category === interest.categoryName
        );

        if (existingCategory) {
          existingCategory.items.push(interest);
        } else {
          acc.push({
            category: interest.categoryName,
            items: [interest],
          });
        }

        return acc;
      }, []);

      setInterests(categorizedInterests);
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

  const fetchCategoryNameByInterestId = async (interestId) => {
    const { data, error } = await supabase
      .from("Interests")
      .select(
        `
        Event_Categories (
          category_name
        )
      `
      )
      .eq("id", interestId)
      .single();

    if (error) {
      console.error("Error fetching category name:", error);
      return null;
    }

    return data?.Event_Categories?.category_name || "Unknown Category";
  };

  const toggleInterest = async (interest) => {
    if (
      selectedInterests.length >= 10 &&
      !selectedInterests.some((i) => i.id === interest.id)
    ) {
      return;
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

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
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
        <PageHeader onBackClick={handleBackNavigation} title="Your Interests" />

        <Input
          type="text"
          placeholder="Search interests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

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

        <div className="space-y-2">
          {filteredInterests.map((category) => (
            <div
              key={category.category}
              className="bg-white rounded-lg shadow-md my-2"
            >
              <div
                className="flex justify-between p-4 cursor-pointer"
                onClick={() => toggleCategory(category.category)}
              >
                <h2 className="text-xl font-semibold">{category.category}</h2>
                <span className="text-gray-400">
                  {expandedCategories.includes(category.category) ? "-" : "+"}
                </span>
              </div>
              {expandedCategories.includes(category.category) && (
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
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
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
