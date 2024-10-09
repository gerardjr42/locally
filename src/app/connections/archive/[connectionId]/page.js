"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./archivedConnection.scss";
import { Rating } from "@mui/material";
import { NavigationBar } from "@/components/navigation-bar";

export default function UserArchivedConnection() {
  const [value, setValue] = useState(0);
  const [connectionRating, setConnectionRating] = useState(0);
  const [experienceRating, setExperienceRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleExperienceRatingChange = (event, newValue) => {
    setExperienceRating(newValue);
  };

  const handleConnectionRatingChange = (event, newValue) => {
    setConnectionRating(newValue);
  };

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();

  const handleBackClick = () => {
    router.push(`/connections`);
  };

  return (
    <div className="bg-white-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar handleBackClick={handleBackClick} />
      </header>
      <div className="userArchived-matches">
        <div className="banner-image-container">
          <img
            className="User2Photo"
            src="https://cdn.vox-cdn.com/thumbor/bPOEqe9QaREAGRsVXUPpYZK4Dl0=/0x0:706x644/1400x1050/filters:focal(353x322:354x323)/cdn.vox-cdn.com/uploads/chorus_asset/file/13874040/stevejobs.1419962539.png"
            alt="Ellis"
          />
        </div>
        <div className="collapse collapse-arrow bg-base-200">
          <div className={`collapse ${isOpen ? "collapse-open" : "collapse-close"}`}>
            <div className="collapse-title text-l font-medium" onClick={toggleCollapse}>
              <h2>You Connected With Ellis</h2>
              <p>for Samba Sunday</p>
            </div>
            <div className="collapse-content event-details">
              <div className="event-image">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOvhLHJPi1vUMSOk3C8Gu-6t5hr9S_dHAvaQ&s"
                  alt="samba sunday"
                />
              </div>
              <div className="event-info">
                <div>
                  <p>Sunday</p>
                  <p>Sep 22, 2022</p>
                </div>
                <div>
                  <p>222 Main St</p>
                  <p>Long Island City, NY</p>
                </div>
                <div>
                  <p>7 - 9 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rating-section">
          <h3>How was your connection with Ellis?</h3>
          <p>Your review is only shared with the Locally team.</p>
          <Rating
            name="connection-rating"
            value={connectionRating}
            onChange={handleConnectionRatingChange}
          />
        </div>
        <div className="rating-section">
          <h3>How was your experience?</h3>
          <p>Rate the experience of the event or the activity</p>
          <Rating
            name="experience-rating"
            value={experienceRating}
            onChange={handleExperienceRatingChange}
          />
        </div>
      </div>
      <div className="Chat-button-container">
        <button className="chat-button">
          <h4>Chat with Ellis</h4>
          <p>chat expires: Thu, Sep 26</p>
        </button>
        <div className="report-button-container">
          <button className="report-button">Report Experience</button>
          <button className="report-button">Report User</button>
        </div>
      </div>
    </div>
  );
}