'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, DollarSign, Tag } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ExperienceDetailsComponent() {
  const [experience, setExperience] = useState(null)
  const [interestedUsers, setInterestedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isInterested, setIsInterested] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const params = useParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchExperienceAndUsers() {
      const { data: experienceData, error: experienceError } = await supabase
        .from("Events")
        .select(`
          *,
          Event_Category_Junction (
            category_id
          ),
          is_free
        `)
        .eq("event_id", params.experienceId)
        .single()

      if (experienceError) {
        console.error("Error fetching experience:", experienceError)
        setLoading(false)
        return
      }

      setExperience(experienceData)

      const { data: userData, error: userError } = await supabase
        .from("User_Events")
        .select(`
          user_id,
          Users (
            user_id,
            first_name,
            last_name,
            user_dob,
            photo_url
          )
        `)
        .eq("event_id", params.experienceId)

      if (userError) {
        console.error("Error fetching interested users:", userError)
      } else {
        setInterestedUsers(userData.map((item) => item.Users))
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from("User_Events")
          .select()
          .eq("event_id", params.experienceId)
          .eq("user_id", user.id)
          .single()

        if (data) {
          setIsInterested(true)
        }
      }

      setLoading(false)
    }

    fetchExperienceAndUsers()
  }, [params.experienceId, supabase])

  const handleInterestClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.error("User not authenticated")
      return
    }

    if (isInterested) {
      const { error } = await supabase
        .from("User_Events")
        .delete()
        .eq("event_id", params.experienceId)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error removing interest:", error)
      } else {
        setIsInterested(false)
        setInterestedUsers((prevUsers) =>
          prevUsers.filter((u) => u.user_id !== user.id))
      }
    } else {
      const { error } = await supabase
        .from("User_Events")
        .insert({ event_id: params.experienceId, user_id: user.id })

      if (error) {
        console.error("Error adding interest:", error)
      } else {
        setIsInterested(true)
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("user_id, first_name, last_name, user_dob, photo_url")
          .eq("user_id", user.id)
          .single()

        if (userError) {
          console.error("Error fetching user data:", userError)
        } else {
          setInterestedUsers((prevUsers) => [...prevUsers, userData])
        }
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!experience) {
    return <div>Experience not found</div>;
  }

  function calculateAge(dob) {
    const birthDate = new Date(dob)
    const difference = Date.now() - birthDate.getTime()
    const age = new Date(difference)
    return Math.abs(age.getUTCFullYear() - 1970);
  }

  return (
    (<div className="bg-white min-h-screen">
      <div className="relative h-64 mb-4">
        <Image
          src={experience.event_image_url}
          alt={experience.event_name}
          layout="fill"
          objectFit="cover" />
      </div>
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold mb-2">{experience.event_name}</h1>
        <p className="text-gray-600 mb-4">{new Date(experience.event_time).toLocaleDateString()}</p>
        <Button
          className="w-full mb-6"
          style={{ backgroundColor: "#4CD0C0", color: "white" }}
          onClick={handleInterestClick}>
          {isInterested ? "Not Interested" : "I'm interested!"}
        </Button>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">{interestedUsers.length} Interested locals</h2>
            <Button variant="link" className="text-sm">View all</Button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {interestedUsers.slice(0, 5).map((user, index) => (
              <div key={user.user_id} className="flex-shrink-0 w-20">
                <div className="relative mb-1">
                  <Image
                    src={user.photo_url || "/default-avatar.png"}
                    alt={`${user.first_name} ${user.last_name}`}
                    width={80}
                    height={80}
                    className="rounded-full object-cover" />
                  {index < 2 && (
                    <span
                      className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px]">
                      Top Match
                    </span>
                  )}
                </div>
                <p className="text-center text-xs">{user.first_name}, {calculateAge(user.user_dob)}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div>
            <h3 className="text-sm font-semibold mb-1">Category</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Tag className="w-3 h-3 mr-1" />
              <p>{experience.Event_Category_Junction[0]?.category_id}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Entry Fee</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <DollarSign className="w-3 h-3 mr-1" />
              <p>{experience.is_free ? "Free" : `$${experience.event_price}`}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Capacity</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Users className="w-3 h-3 mr-1" />
              <p>{experience.event_capacity}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-start mb-6">
          <MapPin className="w-5 h-5 mr-2 mt-0.5 text-gray-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{experience.event_street_address}</p>
            <div className="flex items-center text-gray-600 mt-1 text-sm">
              <Clock className="w-3 h-3 mr-1" />
              <p>{new Date(experience.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">About this event</h3>
          <p className="text-gray-700 text-sm">
            {experience.event_details.slice(0, 150)}...
          </p>
          <Button
            variant="link"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 p-0 h-auto font-semibold text-[#4CD0C0] text-sm">
            {isExpanded ? 'Read less' : 'Read more'}
          </Button>
        </div>
        
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={isExpanded ? "about-event" : ""}>
          <AccordionItem value="about-event">
            <AccordionTrigger className="sr-only">Full event description</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700 text-sm">
                {experience.event_details}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>)
  );
}