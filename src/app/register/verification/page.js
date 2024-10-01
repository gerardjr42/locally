"use client"
import React from "react";
import { useRouter } from "next/navigation";
import "./verification.scss";




export default function UserVerification() {
  return (
    <div className="UserVerification">
      <div className="center">
        <progress className="progress w-56" value="80" max="100"></progress>
      </div>
      <h1>VERIFY YOUR IDENTITY</h1>
      <p>Choose how you'd like to verify your identity</p>
      <br />
      <div className="connect-accounts">
        <h2>Connect Accounts</h2>
        
        <div className="account-option">
          <img src="https://cdn-icons-png.freepik.com/256/15707/15707869.png?semt=ais_hybrid" alt="Instagram" />
          <span>Connect Your Instagram Account</span>
          <input type="checkbox" />
        </div>
        
        <div className="account-option">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAYFBMVEU7V53///80Upv19/pQZ6XQ1eRXbKd3h7b5+vwiRpY2VJvByNxFX6GdqMh6ibYwT5lrfbDr7fQYQZNidawTP5SGlL0mSZaPnMLIzd+msM0KO5Hh5O7a3uq0vNWttdBLY6NLDS/9AAADXUlEQVR4nO3d7W6qQBSF4emgAsPHiBZEEb3/uzza5CSnJ6UD6mYvzHp/l4QnyoAzQM1HkZq3KC0+TPSpvRev6jMy2ftgMlM32jvxqprabKz2Trwqu9HeA8YYY4wxxhhjjI3L+ibdfStN06bx3lunvW9Tcn736Tfxobj0Wda22a2+7y/Hojgcyni7yX16+wPtvRyTa04+PrZdV0VR8vFPSRLdqqqq67rzut3jzyT5U1O31XfFz5XoGH9aZVHYsQSM99vzSAk6xrv9ejwFGuOaTTGFgoyxtpzwDcPGeFOMPe7hMT7vR4zFy8D4PJtuAcVYk02noGLS/hELJmY3cUhGxjTbxyyIGO8eOPZRMelDBz8mJq0f/WDwMM5MvYgBxqTTr2JgMS6fdNGPjXnmg4HDuIeHMjxMU1ZvhLk8YQHD2NUThz8axsfPfMvQMIdnLFgYl0/4HfM1LfutKEbC2M24S5moLe6z5f8X50hrAX4/5pCpDpvc+J9CshhfjrBcrFvEaoytw5YyXYLk3jFoOSzlzuQRg1kLdYz/lsvbgCUpF7HSd8/loZF5vUI6k/yau3YBzHExFmOvodPMYg7/2yezCvzKrMo3wnTbxRz/Ycx5AQv9fwti1gt6/oUY1IhBjRjUiEGNGNSIQY0Y1IhBjRjUlohxdiB/DWFWzdC29zQw+3ioOjQ7Uw9ueu86+6S6u4Zmxx9NYVbd5c/cUPJbClOEchiF4UEOk13fCNOb+QcAMcxx/ll1OUwx/3qHGCZSeEWWGKaK3+hrdt7Ofz0jhtFYiRbDZPOPzHKYXmHxVgxzUXirpBQm0XhFphRG4zQjhukUTjNiGJV7BKQwa4WRWQzTarwiVwqT7d4Hk2icZqQwkcqtaEIYnVvRpDAqd28JYTqVe4SFMGeVl5cLYdYqL/wWwvQap5kvTDJUaJcHN4yU3pGfl8VQoecauuPgpgqzGV/5dKCdCS025buhbeGW1Gx4GXApz2gsc01zMGJQIwY1YlAjBjViUCMGNWJQIwY1YlAjBjViUCMGNWJQIwY1YlAjBjViUCMGNWJQIwY1YlAjBjViUCMGNWJQIwY1YlAjBjViUCMGNWJQIwY1ecyMj9kKY+zezPieDWFMU5vs9LKdDSWMOWUmme+/V8liXJr8ARIETmu39x9NAAAAAElFTkSuQmCC" alt="Facebook" />
          <span>Connect Your Facebook Account</span>
          <input type="checkbox" />
        </div>
        <h1>Third Party</h1>
      <div className="account-option">
        <img src="https://play-lh.googleusercontent.com/2PS6w7uBztfuMys5fgodNkTwTOE6bLVB2cJYbu5GHlARAK36FzO5bUfMDP9cEJk__cE" alt=""></img>
        <h2>Stripe</h2>
    <p>Upload ID</p>
      </div>
      </div>
      <div>
      <button id="submit-button" type="submit">Skip For now</button>
      <button className='continue-button' type="submit">Continue</button>
      </div>
    </div>
  )
}
