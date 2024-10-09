"use client";

import { NavigationBar } from "@/components/navigation-bar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./experiencedetails.scss";

export default function ExperienceDetails() {
  const [experience, setExperience] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInterested, setIsInterested] = useState(false);
  const params = useParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchExperienceAndUsers() {
      const { data: experienceData, error: experienceError } = await supabase
        .from("Events")
        .select(
          `
          *,
          Event_Category_Junction (
            category_id
          ),
          is_free
        `
        )
        .eq("event_id", params.experienceId)
        .single();

      if (experienceError) {
        console.error("Error fetching experience:", experienceError);
        setLoading(false);
        return;
      }

      setExperience(experienceData);

      const { data: userData, error: userError } = await supabase
        .from("User_Events")
        .select(
          `
          Users (
            user_id,
            first_name,
            last_name,
            user_dob,
            photo_url
          )
        `
        )
        .eq("event_id", params.experienceId);

      if (userError) {
        console.error("Error fetching interested users:", userError);
      } else {
        setInterestedUsers(userData.map((item) => item.Users));
      }

      // Check if the current user is interested
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("User_Events")
          .select()
          .eq("event_id", params.experienceId)
          .eq("user_id", user.id)
          .single();

        if (data) {
          setIsInterested(true);
        }
      }

      setLoading(false);
    }

    fetchExperienceAndUsers();
  }, [params.experienceId, supabase]);

  const handleInterestClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    if (isInterested) {
      // Remove interest
      const { error } = await supabase
        .from("User_Events")
        .delete()
        .eq("event_id", params.experienceId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error removing interest:", error);
      } else {
        setIsInterested(false);
        setInterestedUsers((prevUsers) =>
          prevUsers.filter((u) => u.user_id !== user.id)
        );
      }
    } else {
      // Add interest
      const { error } = await supabase
        .from("User_Events")
        .insert({ event_id: params.experienceId, user_id: user.id });

      if (error) {
        console.error("Error adding interest:", error);
      } else {
        setIsInterested(true);
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("user_id, first_name, last_name, user_dob, photo_url")
          .eq("user_id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
        } else {
          setInterestedUsers((prevUsers) => [...prevUsers, userData]);
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!experience) {
    return <div>Experience not found</div>;
  }

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const age = new Date(difference);
    return Math.abs(age.getUTCFullYear() - 1970);
  }

  return (
    <>
      <NavigationBar />
      <div className="ExperienceDetails">
        <div className="banner-image-container">
          <Image
            src={experience.event_image_url}
            alt={experience.event_name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="details-header">
          <h1>{experience.event_name}</h1>
          <p>{new Date(experience.event_time).toLocaleDateString()}</p>
        </div>
        <button onClick={handleInterestClick}>
          {isInterested ? "Not Interested" : "I'm interested!"}
        </button>
        <div>
          <div className="flex locals">
            <h2>{interestedUsers.length} Interested locals</h2>
            <span>View all</span>
          </div>
          <div className="users-container">
            {interestedUsers.slice(0, 5).map((user, index) => (
              <div
                key={user.user_id}
                className={`user-card ${index < 2 ? "top-match" : ""}`}
              >
                {index < 2 && <p className="tag">Top Match</p>}
                <div className="image-container">
                  <Image
                    src={user.photo_url || "/default-avatar.png"}
                    alt={`${user.first_name} ${user.last_name}`}
                    width={100}
                    height={100}
                    objectFit="cover"
                  />
                </div>
                <div className="flex">
                  <h3>{user.first_name},</h3>
                  <p>{calculateAge(user.user_dob)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="experience-description-details">
            <div className="flex experience-description-details-breakdown">
              <div>
                <h3>Category</h3>
                <p>{experience.Event_Category_Junction[0]?.category_id}</p>
              </div>
              <div>
                <h3>Entry Fee</h3>
                <p>
                  {experience.is_free ? "Free" : `$${experience.event_price}`}
                </p>
              </div>
              <div>
                <h3>Capacity</h3>
                <p>{experience.event_capacity}</p>
              </div>
            </div>
            <div className="flex experience-description-address">
              <div className="icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <p>{experience.event_street_address}</p>
                <p>
                  {new Date(experience.event_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="experience-description-content">
              <section>
                <p>{experience.event_details}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
