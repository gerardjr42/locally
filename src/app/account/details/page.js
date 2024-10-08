'use client';
import { NavigationBar } from '@/components/navigation-bar';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Ban, Trash2 } from 'lucide-react';
import './details.scss';

export default function AccountDetails() {
  const router = useRouter();

  return (
    <div className="AccountDetails">
      <NavigationBar />
      <div className="container">
        <h1>Account Details</h1>
        <div>
          <form action="#">
            <fieldset>
              <legend>Account Info</legend>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="hudson@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="********"
                />
              </div>
            </fieldset>

            <fieldset>
              <legend>Basic Info</legend>
              <div className="form-group locked">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Hudson"
                  disabled
                />{' '}
                <LockKeyhole />
              </div>
              <div className="form-group locked">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="River"
                  disabled
                />{' '}
                <LockKeyhole />
              </div>
              <div className="form-group locked">
                <label htmlFor="birthday">Birthday</label>
                <input
                  type="text"
                  name="birthday"
                  id="birthday"
                  placeholder="1/7/1992"
                  disabled
                />{' '}
                <LockKeyhole />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  placeholder="10011"
                />
              </div>
            </fieldset>
          </form>
        </div>
        <div>
          <h1>Account Status</h1>
          <button className="danger" onClick={() => router.push('/')}>
            Suspend my account <Ban />
          </button>
          <button className="danger" onClick={() => router.push('/')}>
            Delete my account <Trash2 />
          </button>
              </div>
              <button className="btn">Save changes</button>
      </div>
    </div>
  );
}
