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

  console.log(compliments)

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

          <div></div>
        </form>
      </div>
    </div>
  );
}
