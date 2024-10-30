"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { ConnectionContext } from "../layout";

export default function Survey() {
  const router = useRouter();
  const { user } = useUserContext();
  const params = useParams();
  const { eventInfo, matchData, otherUser } = useContext(ConnectionContext);
  const [compliments, setCompliments] = useState([]);
  const [selectedCompliments, setSelectedCompliments] = useState([]);

  const toggleSelection = (compliment) => {
    setSelectedCompliments((prevSelected) => {
      if (prevSelected.includes(compliment)) {
        return prevSelected.filter((item) => item !== compliment);
      } else {
        return [...prevSelected, compliment];
      }
    });
  };

  useEffect(() => {
    fetchCompliments();
  }, []);

  const fetchCompliments = async () => {
    try {
      const { data, error } = await supabase.from("Compliments").select("*");

      if (error) {
        console.error("Error fetching compliments:", error);
      } else {
        setCompliments(data);
      }
    } catch (error) {
      console.error("Error fetching compliments:", error);
    }
  };

  console.log(selectedCompliments);
  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar />
      <div className="w-full p-2">
        <h1>
          How'd it go with {otherUser?.first_name} at {eventInfo?.event_name}?
        </h1>

        <form>
          <p>How would you rate your {eventInfo?.event_name} experience?</p>
          <div className="rating rating-lg">
            <Input
              type="radio"
              name="experience_rating"
              className="mask mask-star-2 bg-teal-100"
            />
            <Input
              type="radio"
              name="experience_rating"
              className="mask mask-star-2 bg-teal-200"
              defaultChecked
            />
            <Input
              type="radio"
              name="experience_rating"
              className="mask mask-star-2 bg-teal-300"
            />
            <Input
              type="radio"
              name="experience_rating"
              className="mask mask-star-2 bg-teal-400"
            />
            <Input
              type="radio"
              name="experience_rating"
              className="mask mask-star-2 bg-teal-500"
            />
          </div>

          <p>
            How would you rate your connection with {otherUser?.first_name}?
          </p>
          <div className="rating rating-lg">
            <Input
              type="radio"
              name="connection_rating"
              className="mask mask-star-2 bg-teal-100"
            />
            <Input
              type="radio"
              name="connection_rating"
              className="mask mask-star-2 bg-teal-200"
              defaultChecked
            />
            <Input
              type="radio"
              name="connection_rating"
              className="mask mask-star-2 bg-teal-300"
            />
            <Input
              type="radio"
              name="connection_rating"
              className="mask mask-star-2 bg-teal-400"
            />
            <Input
              type="radio"
              name="connection_rating"
              className="mask mask-star-2 bg-teal-500"
            />
          </div>

          <div>
            <p>Would you like to leave {otherUser?.first_name} compliments?</p>
            <p>
              These compliments will be shared as badges on{" "}
              {otherUser?.first_name}'s profile.
            </p>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {compliments.map((compliment) => (
                  <Button
                    key={compliment.id}
                    variant={
                      selectedCompliments.some((i) => i.id === compliment.id)
                        ? "default"
                        : "outline"
                    }
                    className={`rounded-full text-sm ${
                      selectedCompliments.some((i) => i.id === compliment.id)
                        ? "bg-[#0D9488] hover:bg-[#0B7A6E] text-white"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => toggleSelection(compliment)}
                    disabled={
                      !selectedCompliments.some((i) => i.id === compliment.id)
                    }
                  >
                    {compliment.compliment_emoji} {compliment.compliment_text}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </form>
        <Button>
            Submit
        </Button>
      </div>
    </div>
  );
}
