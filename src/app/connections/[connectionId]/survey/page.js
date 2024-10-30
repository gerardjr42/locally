"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext } from "react";
import { ConnectionContext } from '../layout';


export default function Survey() {
  const router = useRouter();
  const { user } = useUserContext();
  const params = useParams();
  const { eventInfo, matchData, otherUser } = useContext(ConnectionContext);

  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar />
      <div className="w-full p-2">
        <h1>Survey for {eventInfo?.event_name}</h1>
        <p>How was your connection with {otherUser?.first_name}?</p>
      </div>
    </div>
  );
}
