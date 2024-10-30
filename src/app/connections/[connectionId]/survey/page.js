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
      <div className="w-full p-2 flex flex-col items-center justify-center">
        <div className="card bg-teal-500 text-white w-96 my-2">
          <div className="card-body">
            <h2 className="card-title">Rate The Experience</h2>
            <p className="text-sm text-gray-100">
              How was {eventInfo?.event_name}?
            </p>
            <div className="card-actions justify-center">
              <div className="rating rating-lg">
                <Input
                  type="radio"
                  name="experience_rating"
                  className="mask mask-star-2 bg-yellow-100"
                />
                <Input
                  type="radio"
                  name="experience_rating"
                  className="mask mask-star-2 bg-yellow-200"
                  defaultChecked
                />
                <Input
                  type="radio"
                  name="experience_rating"
                  className="mask mask-star-2 bg-yellow-300"
                />
                <Input
                  type="radio"
                  name="experience_rating"
                  className="mask mask-star-2 bg-yellow-400"
                />
                <Input
                  type="radio"
                  name="experience_rating"
                  className="mask mask-star-2 bg-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-teal-500 text-white w-96 my-2">
          <div className="card-body">
            <h2 className="card-title">Rate The Connection</h2>
            <p className="text-sm text-gray-100">
              How was your connection with {otherUser?.first_name}?
            </p>
            <div className="card-actions justify-center">
              <div className="rating rating-lg">
                <Input
                  type="radio"
                  name="experience_rating"
                  className="mask mask-star-2 bg-yellow-100"
                />
                <Input
                  type="radio"
                  name="experience_rating"
                  className="mask mask-star-2 bg-yellow-200"
                  defaultChecked
                />
                <Input
                  type="radio"
                  name="experience_rating"
                  className="mask mask-star-2 bg-yellow-300"
                />
                <Input
                  type="radio"
                  name="experience_rating"
                  className="mask mask-star-2 bg-yellow-400"
                />
                <Input
                  type="radio"
                  name="experience_rating"
                  className="mask mask-star-2 bg-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-teal-500 text-white w-96 my-2">
          <div className="card-body">
            <h2 className="card-title">Compliments</h2>
            <p className="text-sm text-gray-100">
              These compliments will be anonymously shared on {otherUser?.first_name}'s
              profile!
            </p>
            <div className="card-actions justify-center">
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
        </div>

        <Button className="w-1/2 bg-transparent outline text-teal-400 text-sm p-4 my-2 rounded-full font-semibold flex items-center justify-center">Submit</Button>
      </div>
    </div>
  );
}
