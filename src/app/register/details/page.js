'use client';

import { useRouter } from 'next/navigation';
import "./formDetails.scss";

export default function DetailsPage() {
  const router = useRouter();

  return (
    <div className="details-container">
      <div className="form-container">
        <div className="center">
        <progress className="progress w-56" value="60" max="100"></progress>
        </div>
        <h1>YOUR BASIC INFO</h1>
        <form 
          className="form" 
          onSubmit={(e) => {
            e.preventDefault();
            router.push('/register/photo');
          }}
        >
          <input type="text" placeholder="First name" name="firstName" id="firstName" />
          <input type="text" placeholder="Last name" name="lastName" id="lastName" />
          <input type="text" placeholder="Birthday (mm/dd/yyyy)" name="Birthday" id="Birthday" />
          <input type="text" placeholder="Zip Code" name="zipCode" id="zipCode" />
          <button className="submit-button" type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}