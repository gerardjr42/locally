"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function AttendeesList({ params }) {
  const { experienceId } = params;
  const router = useRouter();
  const [attendees, setAttendees] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchAttendees = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("Users").select("*");

        if (error) throw error;

        if (!data || data.length === 0) {
          setError("No attendees found");
          return;
        }

        setAttendees(data);
      } catch (error) {
        console.error("Error in fetchAttendees:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendees();
  }, [supabase]);

  const processedAttendees = useMemo(() => {
    return attendees.map((user) => ({
      ...user,
      age: calculateAge(user.user_dob),
      topMatch: Math.random() < 0.3, // Note: This will be stable across renders
    }));
  }, [attendees]);

  const handleBackClick = () => {
    router.back();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar handleBackClick={handleBackClick} />
      </header>
      <main className="p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            {processedAttendees.length} Interested Locals
          </h2>
          <p className="text-gray-600">for Movies In The Park</p>
        </div>

        <div className="space-y-4 bg-[#C9E9E5] p-4 rounded-lg">
          {processedAttendees.map((attendee) => (
            <div
              key={attendee.user_id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer"
              role="button"
              aria-label={`View ${attendee.first_name}'s profile`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                  <Image
                    src={attendee.photo_url}
                    alt={`${attendee.first_name}'s profile`}
                    width={48}
                    height={48}
                    objectFit="cover"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {attendee.first_name}, {attendee.age}
                  </h3>
                </div>
              </div>
              {attendee.topMatch && (
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                  Top Match
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
