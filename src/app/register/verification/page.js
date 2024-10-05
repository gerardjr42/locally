'use client';

import { useEffect, useState } from 'react';
import './verification.scss';

export default function UserVerification() {
  const [isClient, setIsClient] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const idmeButton = document.getElementById('idme-wallet-button');
      if (idmeButton) {
        BindIDme(idmeButton);
      }
    }
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="UserVerification">
      <div className="center">
        <progress className="progress w-56" value="80" max="100"></progress>
      </div>

      <h1>Verify your identity</h1>
      <p>Choose how you'd like to verify your identity</p>
      <br />

      <div className="connect-accounts">
        <h2>Connect Accounts</h2>
        <hr />

        <div className="account-option">
          <input type="checkbox" id="instagram" />
          <label htmlFor="instagram">
            <img
              src="https://cdn-icons-png.freepik.com/256/15707/15707869.png?semt=ais_hybrid"
              alt="Instagram"
            />
            <span className="text-container">
              <span className="platform-name">Instagram</span>
              <span className="connect-text">
                Connect Your Instagram Account
              </span>
            </span>
            <span className="checkmark">
              <i className="fa-solid fa-check"></i>
            </span>
          </label>
        </div>

        <div className="account-option">
          <label htmlFor="facebook" className="account-option-label">
            <img
              src="https://static.vecteezy.com/system/resources/previews/016/716/481/non_2x/facebook-icon-free-png.png"
              alt="Facebook"
              className="account-icon"
            />
            <span className="text-container">
              <span className="platform-name">Facebook</span>
              <span className="connect-text">
                Connect Your Facebook Account
              </span>
            </span>
            <span className="checkmark">
              <i className="fa-solid fa-check"></i>
            </span>
          </label>
        </div>
        <div>
          <h1>Third Party</h1>
          <hr />
          <p className="info">
            Locally uses ID.me to verify users for added safety on our platform.
            Click here to verify.
          </p>
          <div className="widget-container">
            <div
              id="idme-wallet-button"
              data-scope="military,responder,student,teacher,government"
              data-client-id="4edd021a7a9a9cc3aacc9bb9d7a9835a"
              data-redirect="https://mylocally.io/idme/callback"
              data-response="code"
              data-show-verify="true"
            ></div>
          </div>
        </div>
      </div>
      <div>
        <button className="skip-button" type="submit">
          Skip For now
        </button>
        <button className="continue-button" type="submit">
          Continue
        </button>
      </div>
    </div>
  );
}
