'use client';
import './myMatches.scss';

export default function UserMatches() {
  return (
    <div className="UserMatches">
      <button className="back-button">←</button>
      <button className="menu-button">☰</button>
      <div className="title">Locally</div>
      <div className="Header">
        <p>
          You've made <strong>3 MATCHES</strong> within{' '}
          <strong>3 EVENTS</strong>
        </p>
      </div>

      <div className="UserEvents">
        <div className="collapse collapse-arrow matched-event">
          <input type="radio" name="event-accordion" defaultChecked />
          <div className="collapse-title Matched-event-header">
            <h3>
              <strong>Movies In The Park</strong>
            </h3>
            <p>Thu, Nov 14</p>
            <span>
              Status:
              <strong>Connection Pending</strong>
            </span>
          </div>
          <div className="collapse-content">
            <div className="UserMatchList">
              <div className="match-item Match-pending">
                <img
                  className="match-icon"
                  src="https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg"
                  alt="icon"
                />
                Hudson
              </div>
              <div className="match-item Match-pending">
                <img
                  className="match-icon"
                  src="https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg"
                  alt="icon"
                />
                Vernon
              </div>
              <div className="match-item Match-pending">
                <img
                  className="match-icon"
                  src="https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg"
                  alt="icon"
                />
                Rochelle
              </div>
            </div>
          </div>
        </div>

        {/* Event 2 */}
        <div className="collapse collapse-arrow saved-event">
          <input type="radio" name="event-accordion" />
          <div className=" saved-event-header collapse-title">
            <h3>
              <strong>Dancing In The Rain</strong>
            </h3>
            <p>Fri, Nov 29</p>
            <span>
              Status: <strong>Saved</strong>
            </span>
          </div>
        </div>

        <div className="collapse collapse-arrow confirmed-event">
          <input type="radio" name="event-accordion" />
          <div className="collapse-title confirmed-event-header">
            <h3>
              <strong>Next In Tech Conference</strong>
            </h3>
            <p>Sat, Dec 7</p>
            <span>
              Status: <strong>Connection Confirmed</strong>
            </span>
          </div>
          <div className="collapse-content">
            <div className="UserMatchList">
              <div className="UserMatchList">
                <div className="match-item confirmed-match">
                  <img
                    className="match-icon"
                    src="https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg"
                    alt="icon"
                  />
                  Brooke
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
