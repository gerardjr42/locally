import { NavigationBar } from '@/components/navigation-bar';
import './experiencedetails.scss';

export default function ExperienceDetails() {
  return (
    <>
      <NavigationBar />
      <div className="ExperienceDetails">
        <div className="banner-image-container">
          <img
            src="https://cdn.vox-cdn.com/thumbor/5S7JpedGA56AdqDnfdAj40qHdWA=/0x0:5760x3840/1200x900/filters:focal(2420x1460:3340x2380)/cdn.vox-cdn.com/uploads/chorus_image/image/59907645/shutterstock_1134780044.7.jpg"
            alt="Event"
          />
        </div>
        <div className="details-header">
          <h1>Movies in the Park</h1>
          <p>Thursday, November 14, 2024</p>
        </div>
        <button>I'm interested!</button>
        <div>
          <div className="flex locals">
            <h2>46 Interested locals</h2>
            <span>View all</span>
          </div>
          <div className="users-container">
            <div className="user-card top-match">
              <p className="tag">Top Match</p>
              <div className="image-container">
                <img
                  src="https://i.redd.it/male-random-selfie-27m-v0-s6bd3ohvwx4c1.jpg?width=2208&format=pjpg&auto=webp&s=fee39976344658358256e1679cf8bfe5eff65159"
                  alt="Hudson"
                />
              </div>
              <div className="flex">
                <h3>Hudson,</h3>
                <p>32</p>
              </div>
            </div>
            <div className="user-card top-match">
              <p className="tag">Top Match</p>
              <div className="image-container">
                <img
                  src="https://randomuser.me/api/portraits/women/32.jpg"
                  alt="Brook"
                />
              </div>
              <div className="flex">
                <h3>Brook,</h3>
                <p>29</p>
              </div>
            </div>
            <div className="user-card">
              <div className="image-container">
                <img
                  src="https://media.istockphoto.com/id/1391794638/photo/portrait-of-beautiful-woman-making-selfie-in-the-municipal-market.jpg?s=612x612&w=0&k=20&c=V1VvogWmSEGC4s6Tj3PrxJUPbaSl6Tm7nP-bevfSS3w="
                  alt="Rochelle"
                />
              </div>
              <div className="flex">
                <h3>Rochelle,</h3>
                <p>24</p>
              </div>
            </div>
            <div className="user-card">
              <div className="image-container">
                <img
                  src="https://www.stryx.com/cdn/shop/articles/guy-taking-selfie.jpg?v=1665530575"
                  alt="Vernon"
                />
              </div>
              <div className="flex">
                <h3>Vernon,</h3>
                <p>28</p>
              </div>
            </div>
            <div className="user-card">
              <div className="image-container">
                <img
                  src="https://usercontent.one/wp/www.intrepidescape.com/wp-content/gallery/selfie-success/cache/Steps-to-Selfie-Success-4-1.jpg-nggid03829-ngg0dyn-0x0x100-00f0w010c010r110f110r010t010.jpg?media=1727065179"
                  alt="Ellis"
                />
              </div>
              <div className="flex">
                <h3>Ellis,</h3>
                <p>30</p>
              </div>
            </div>
          </div>
          <div className="experience-description-details">
            <div className="flex experience-description-details-breakdown">
              <div>
                <h3>Category</h3>
                <p>Entertainment</p>
              </div>
              <div>
                <h3>Entry Fee</h3>
                <p>$20</p>
              </div>
              <div>
                <h3>Capacity</h3>
                <p>550</p>
              </div>
            </div>
            <div className=" flex experience-description-address">
              <div className="icon">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <p>111 Main St, Long Island City, NY </p>
                <p>6:00PM - 9:00PM</p>
              </div>
            </div>
            <div className="experience-description-content">
              <section>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
                  iusto laudantium itaque repellendus, iure quibusdam sapiente
                  maxime incidunt officia debitis hic enim, ducimus impedit
                  veritatis quis consequatur. Similique, cumque. Maxime.
                  <br /> <br />
                  Magnam voluptatem at eos harum? Rem quasi quibusdam est
                  dolores neque corrupti quaerat error id. Deleniti, adipisci
                  itaque. Nisi architecto culpa at officia praesentium? Itaque
                  ullam consequatur distinctio sequi dolores. Deserunt
                  recusandae laudantium sint placeat, similique laborum. <br />{' '}
                  <br />
                  Odio ipsam, quisquam dolore error facere maxime dolores eos,
                  reprehenderit hic perferendis animi inventore molestiae
                  pariatur, atque harum cupiditate tempora ratione vero vitae.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
