"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Survey() {
  const router = useRouter();
  const { user } = useUserContext();
  const params = useParams();

  return (
    <div className="flex flex-col items-center justify-center">
      <NavigationBar />
      <div className="w-full p-2">

      </div>
    </div>
  );
}
