"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import "./registrationPhoto.scss";
export default function UserUploadPhoto() {
  const router = useRouter();

  const handleSkip = (e) => {
    e.preventDefault();
    router.push('/register/aboutme');
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/register/aboutme');
  };
  return (
    <div className="container">
      <div className="form-container">
      <progress className="progress w-56" value="40" max="100"></progress>
      <h1 className='title'>UPLOAD YOUR PHOTO</h1>
      <img  className="icon" src="https://cdn3.iconfinder.com/data/icons/general-bio-data-people-1/64/identity_card_man-512.png" alt="Icon" />
      <form className='form'>
        <label className='photoUpload' htmlFor="photoUpload">Choose Photo</label>
        <input type="file" id='photoUpload' />
        <button id="submit-button" onClick={handleSkip}type="submit">Skip For now</button>
        <button className='continue-button' onClick={handleSubmit}type="submit">Continue</button>
      </form>
    </div>
    </div>
  )
}
