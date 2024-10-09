import { NavigationBar } from "@/components/navigation-bar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

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

export default async function AttendeesList() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const fetchAttendees = async () => {
    try {
      console.log("Fetching attendees...");
      const { data, error, count } = await supabase
        .from("Users")
        .select("*", { count: "exact" });

      if (error) {
        console.error("Error fetching attendees:", error);
        throw error;
      }

      console.log("Total users in database:", count);
      console.log("Fetched data:", data);

      if (!data || data.length === 0) {
        console.log("No attendees found");
        return { attendees: [], error: "No attendees found" };
      }

      console.log("Number of attendees fetched:", data.length);

      const processedData = data.map((user) => ({
        ...user,
        age: calculateAge(user.user_dob),
        topMatch: Math.random() < 0.3, // Randomly assign topMatch for demonstration
      }));

      console.log("Processed data:", processedData);

      return { attendees: processedData, error: null };
    } catch (error) {
      console.error("Error in fetchAttendees:", error);
      return { attendees: [], error: error.message };
    }
  };

  const { attendees, error } = await fetchAttendees();

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar />
      </header>
      <main className="p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            {attendees.length} Interested Locals
          </h2>
          <p className="text-gray-600">for Movies In The Park</p>
        </div>

        <div className="space-y-4 bg-[#C9E9E5] p-4 rounded-lg">
          {attendees.map((attendee) => (
            <div
              key={attendee.user_id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                  <Image
                    src={attendee.photo_url}
                    alt={`${attendee.first_name}'s profile`}
                    width={48}
                    height={48}
                    objectFit="cover"
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
