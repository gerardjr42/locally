"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./formDetails.scss";

export default function DetailsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    zipCode: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("No user found");
      return;
    }

    try {
      const { data, error } = await supabase.from("Users").insert([
        {
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          photo_url: "",
          bio: "",
          user_dob: formData.birthday,
          user_zipcode: formData.zipCode,
        },
      ]);

      if (error) throw error;

      console.log("User details saved successfully:", data);
      router.push("/register/interests");
    } catch (error) {
      console.error("Error saving user details:", error.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <button
          className="back-button"
          onClick={() => router.push("/register")}
        >
          Back
        </button>
        <br />
        <div className="loading-bar"></div>
        <br />
        <div className="icon">
          <img
            src="https://cdn3.iconfinder.com/data/icons/general-bio-data-people-1/64/identity_card_man-512.png"
            alt="Icon"
          />
        </div>
        <h2 className="Details-title">YOUR BASIC INFO</h2>

        <br />
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First name"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Last name"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            placeholder="Birthday"
            name="birthday"
            id="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Zip Code"
            name="zipCode"
            id="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
          />
          <button
            className="submit-button"
            type="submit"
            onClick={() => router.push("/register/aboutme")}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
