'use client';

import { useRouter } from 'next/navigation';
import "./formDetails.scss";

export default function DetailsPage() {
  const router = useRouter();

  return (
    <div className="container">
      <div className="form-container">
        <button className="back-button" onClick={() => router.push('/register')}>
          Back
        </button>
        <br />
        <div className="loading-bar"></div>
        <br />
        <div className="icon">
          <img src="https://cdn3.iconfinder.com/data/icons/general-bio-data-people-1/64/identity_card_man-512.png" alt="Icon" />
        </div>
        <h2 className="Details-title">Your Details</h2>
        <p>Please enter your details below</p>
        <br />
        <form className="form" onSubmit={(e) => {
          e.preventDefault();
          router.push('/register/interests');
        }}>
          <label htmlFor="FirstName"></label>
          <input type="text" placeholder="First name" name="firstName" id="firstName" />
          <label htmlFor="LastName"></label>
          <input type="text" placeholder="Last name" name="lastName" id="lastName" />
          <label htmlFor="email"></label>
          <input placeholder="Email" type="text" name="email" id="email" />
          <label htmlFor="Birthday"></label>
          <input type="text" placeholder="Birthday (mm/dd/yyyy)" name="Birthday" id="Birthday" />
          <label htmlFor="zipCode"></label>
          <input type="text" placeholder="Zip Code" name="zipCode" id="zipCode" />
          <button className="submit-button" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}