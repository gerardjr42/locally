"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "./archivedConnection.scss";
import { NavigationBar } from "@/components/navigation-bar";

export default function UserArchivedConnection() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();

  const handleBackClick = () => {
    router.push(`/connections`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
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
            <div className="collapse-title text-xl font-medium" onClick={toggleCollapse}>
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
                <p>Sunday, Sep 22, 2024</p>
                <p>222 Main St, Long Island City, NY</p>
                <p>7 - 9 PM</p>
              </div>
            </div>
          </div>
          <div className="rating-section">
            <h3>How was your connection with Ellis?</h3>
            <p>Your review is only shared with the Locally team.</p>
            <div className="rating-container">
              <span onClick="setRating(1)" className="star">
                ★
              </span>
              <span onClick="setRating(2)" className="star">
                ★
              </span>
              <span onClick="setRating(3)" className="star">
                ★
              </span>
              <span onClick="setRating(4)" className="star">
                ★
              </span>
              <span onClick="setRating(5)" className="star">
                ★
              </span>
            </div>
          </div>
        </div>
        <div className="rating-section">
          <h3>How was your experience?</h3>
          <p>Rate the experience of the event or the activity</p>
          <div className="rating-container">
            <span onClick="setRating(1)" className="star">
              ★
            </span>
            <span onClick="setRating(2)" className="star">
              ★
            </span>
            <span onClick="setRating(3)" className="star">
              ★
            </span>
            <span onClick="setRating(4)" className="star">
              ★
            </span>
            <span onClick="setRating(5)" className="star">
              ★
            </span>
          </div>
        </div>
      </div>
      <div className="Chat-button-container">
        <button className="chat-button">
          Chat With Ellis
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