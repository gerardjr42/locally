"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./registration.scss";

export default function Registration() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data) {
        console.log("User signed up successfully:", data);
        router.push("/register/details");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
      <progress className="progress w-56" value="0" max="100"></progress>
        <h1 className="title">EMAIL & PASSWORD</h1>
        <br />
        {error && <p className="error">{error}</p>}
        <form className="form" onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            id="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
