import './experiencedetails.scss';

export default function ExperienceDetails() {
  return (
    <div className="ExperienceDetails">
      <img
        src="https://cdn.vox-cdn.com/thumbor/5S7JpedGA56AdqDnfdAj40qHdWA=/0x0:5760x3840/1200x900/filters:focal(2420x1460:3340x2380)/cdn.vox-cdn.com/uploads/chorus_image/image/59907645/shutterstock_1134780044.7.jpg"
        alt=""
      />
      <div className="details">
        <div className="flex">
          <div className="heading">
            <h1>Movies in the Park</h1>
            <p>Thursday, November 14, 2024</p>
          </div>
          <i class="fa-solid fa-ellipsis"></i>
        </div>
        <button>I'm interested!</button>
        <div>
          <div>
            <div className="flex locals">
              <h2>46 Interested locals</h2>
              <span>View all</span>
            </div>
            <div className="users-container">
              <div className="user-card top-match">
                <div>
                  <p className="tag">Top Match</p>
                </div>
                <img
                  src="https://i.redd.it/male-random-selfie-27m-v0-s6bd3ohvwx4c1.jpg?width=2208&format=pjpg&auto=webp&s=fee39976344658358256e1679cf8bfe5eff65159"
                  alt=""
                />
                <div className="flex">
                  <h3>Hudson,</h3>
                  <p>32</p>
                </div>
              </div>
              <div className="user-card top-match">
                <div>
                  <p className="tag">Top Match</p>
                </div>
                <img
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt=""
                />
                <div className="flex">
                  <h3>Brook,</h3>
                  <p>29</p>
                </div>
              </div>
              <div className="user-card">
                <img
                  src="https://media.istockphoto.com/id/1391794638/photo/portrait-of-beautiful-woman-making-selfie-in-the-municipal-market.jpg?s=612x612&w=0&k=20&c=V1VvogWmSEGC4s6Tj3PrxJUPbaSl6Tm7nP-bevfSS3w="
                  alt=""
                />
                <div className="flex">
                  <h3>Rochelle,</h3>
                  <p>24</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
