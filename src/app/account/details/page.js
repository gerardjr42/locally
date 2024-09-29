'use client';
import React from 'react'
import './accountDetails.scss';
import { useRouter } from 'next/navigation';

export default function accountDetails() {
    const router = useRouter();

    return (
      <div className="container">
        <div className="form-container">
          <button className="back-button" onClick={() => router.push('/account')}>
            Back
          </button>
          <br />
          <br />
          <div className="icon">
            <img src="https://cdn3.iconfinder.com/data/icons/general-bio-data-people-1/64/identity_card_man-512.png" alt="Icon" />
          </div>
          <h2 className="Details-title">Edit About Me </h2>
          <br />
          <form className="form" onSubmit={(e) => {
            e.preventDefault();
            router.push('/account');
          }}>
            <label htmlFor="firstName"></label>
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
              Save Changes
            </button>
          </form>
        </div>
      </div>
    );
  }
