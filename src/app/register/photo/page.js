"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import "./registrationPhoto.scss";
export default function UserUploadPhoto() {
  const router = useRouter();
  return (
    <div className="container">
      <div className="form-container">
      <div className="loading-bar"></div>
      <h1>UPLOAD YOUR PHOTO</h1>
      <img  className="icon" src="https://cdn3.iconfinder.com/data/icons/general-bio-data-people-1/64/identity_card_man-512.png" alt="Icon" />
      <form className='form'>
        <label className='photoUpload' htmlFor="photoUpload">Upload Photo</label>
        <input type="file" id='photoUpload' />
        <button className="skip-button"type="submit">Skip For now</button>
        <button className='continue-button' type="submit">Continue</button>
      </form>
    </div>
    </div>
  )
}
