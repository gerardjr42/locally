'use client';
import { useRouter } from "next/navigation";
import React from "react";
import "./registration.scss";
export default function Registration() {
  const router = useRouter();
  return (
    <div className="container">
      <div className="form-container">
      <progress className="progress w-56" value="0" max="100"></progress>
        <h1 className="title">EMAIL & PASSWORD</h1>
        <br />
        <form className="form" onSubmit={(e) => {
          e.preventDefault();
          router.push('/register/details');
        }}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            id="Email"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="Password"
          />
          <button type="submit"className="submit-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}