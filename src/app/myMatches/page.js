import "./myMatches.scss";

export default function UserMatches() {
  return (
    <div className="UserMatches">
      <button className="back-button">←</button>
      <button className="menu-button">☰</button>
      <div className="Header">
        <p>
          You've made <strong>3 MATCHES</strong> within <strong>3 EVENTS</strong>
        </p>
      </div>

      <div className="UserEvents">
        <div className="collapse collapse-arrow matched-event">
          <input type="radio" name="event-accordion" defaultChecked />
          <div className="collapse-title Matched-event-header">
            <h3>MOVIES IN THE PARK</h3>
            <p>Thu, Nov 14</p>
            <span>Status: Matched</span>
          </div>
          <div className="collapse-content">
            <div className="UserMatchList">
              <div className="Match-pending">
                <img className="match-icon" src="https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg" alt="icon" />
                Hudson
              </div>
              <div className="Match-pending">
                <img className="match-icon" src="https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg" alt="icon" />
                Vernon
              </div>
              <div className="Match-pending">
                <img className="match-icon" src="https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg" alt="icon" />
                Rochelle
              </div>
            </div>
          </div>
        </div>

        {/* Event 2 */}
        <div className="collapse collapse-arrow saved-event">
          <input type="radio" name="event-accordion" />
          <div className="collapse-title">
            <h3>DANCING IN THE RAIN</h3>
            <p>Fri, Nov 29</p>
            <span>Status: Saved</span>
          </div>
        </div>

        <div className="collapse collapse-arrow confirmed-event">
          <input type="radio" name="event-accordion" />
          <div className="collapse-title confirmed-event-header">
            <h3>NEXT IN TECH CONFERENCE</h3>
            <p>Sat, Dec 7</p>
            <span>Status: Confirmed</span>
          </div>
          <div className="collapse-content">
            <div className="UserMatchList">
            <div className="UserMatchList">
              <div className="confirmed-match">
                <img className="match-icon" src="https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg" alt="icon" />
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