const experiences = [
  {
    "eventID": "EVT001",
    "eventName": "Central Park Jazz Festival",
    "eventLocation": "Central Park, NYC",
    "eventDate": "2024-10-15",
    "eventPrice": "$50",
    "eventImageURL": "https://images.pexels.com/photos/613813/pexels-photo-613813.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Music", "Entertainment", "Outdoor"],
    "totalInterestedAttendeees": 88
  },
  {
    "eventID": "EVT002",
    "eventName": "Brooklyn Art Walk",
    "eventLocation": "DUMBO, Brooklyn",
    "eventDate": "2024-11-02",
    "eventPrice": "Free",
    "eventImageURL": "https://images.pexels.com/photos/6037463/pexels-photo-6037463.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Art & Culture", "Outdoor"],
    "totalInterestedAttendeees": 54
  },
  {
    "eventID": "EVT003",
    "eventName": "Food Truck Fiesta",
    "eventLocation": "Astoria Park, Queens",
    "eventDate": "2024-10-10",
    "eventPrice": "$10",
    "eventImageURL": "https://images.pexels.com/photos/2227960/pexels-photo-2227960.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Food & Drink", "Outdoor"],
    "totalInterestedAttendeees": 72
  },
  {
    "eventID": "EVT004",
    "eventName": "Manhattan Book Fair",
    "eventLocation": "Union Square, NYC",
    "eventDate": "2024-10-22",
    "eventPrice": "$15",
    "eventImageURL": "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Art & Culture", "Entertainment", "Education & Workshops"],
    "totalInterestedAttendeees": 49
  },
  {
    "eventID": "EVT005",
    "eventName": "Indie Film Screening",
    "eventLocation": "Williamsburg Cinemas, Brooklyn",
    "eventDate": "2024-10-30",
    "eventPrice": "$20",
    "eventImageURL": "https://images.pexels.com/photos/7513460/pexels-photo-7513460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Art & Culture", "Entertainment"],
    "totalInterestedAttendeees": 156
  },
  {
    "eventID": "EVT006",
    "eventName": "Wine & Paint Night",
    "eventLocation": "SoHo, NYC",
    "eventDate": "2024-11-12",
    "eventPrice": "$40",
    "eventImageURL": "https://images.pexels.com/photos/6925088/pexels-photo-6925088.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    "eventCategories": ["Art & Culture", "Food & Drink", "Entertainment"],
    "totalInterestedAttendeees": 12
  },
  {
    "eventID": "EVT007",
    "eventName": "Rock Climbing Challenge",
    "eventLocation": "The Cliffs at LIC, Queens",
    "eventDate": "2024-11-04",
    "eventPrice": "$35",
    "eventImageURL": "https://images.pexels.com/photos/4046276/pexels-photo-4046276.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Sports"],
    "totalInterestedAttendeees": 30
  },
  {
    "eventID": "EVT008",
    "eventName": "Yoga in the Park",
    "eventLocation": "Battery Park, NYC",
    "eventDate": "2024-10-08",
    "eventPrice": "Free",
    "eventImageURL": "https://images.pexels.com/photos/1472887/pexels-photo-1472887.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Sports", "Health & Wellness", "Outdoor"],
    "totalInterestedAttendeees": 7
  },
  {
    "eventID": "EVT009",
    "eventName": "Rooftop Movie Night",
    "eventLocation": "Skyline Drive-In, Brooklyn",
    "eventDate": "2024-10-25",
    "eventPrice": "$25",
    "eventImageURL": "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Entertainment", "Outdoor"],
    "totalInterestedAttendeees": 31
  },
  {
    "eventID": "EVT010",
    "eventName": "Halloween Haunted House",
    "eventLocation": "NYC Haunted Hayride, Randall's Island",
    "eventDate": "2024-10-31",
    "eventPrice": "$60",
    "eventImageURL": "https://images.pexels.com/photos/5435192/pexels-photo-5435192.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Entertainment", "Outdoor"],
    "totalInterestedAttendeees": 27
  },
  {
    "eventID": "EVT011",
    "eventName": "Gotham Comic Convention",
    "eventLocation": "Javits Center, NYC",
    "eventDate": "2024-11-15",
    "eventPrice": "$75",
    "eventImageURL": "https://images.pexels.com/photos/954848/pexels-photo-954848.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    "eventCategories": ["Art & Culture", "Entertainment"],
    "totalInterestedAttendeees": 118
  },
  {
    "eventID": "EVT012",
    "eventName": "Broadway Musical Night",
    "eventLocation": "Shubert Theatre, NYC",
    "eventDate": "2024-10-20",
    "eventPrice": "$120",
    "eventImageURL": "https://images.pexels.com/photos/6899918/pexels-photo-6899918.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Art & Culture", "Entertainment"],
    "totalInterestedAttendeees": 65
  },
  {
    "eventID": "EVT013",
    "eventName": "Outdoor Ice Skating",
    "eventLocation": "Bryant Park, NYC",
    "eventDate": "2024-12-01",
    "eventPrice": "$30",
    "eventImageURL": "https://images.pexels.com/photos/6289768/pexels-photo-6289768.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Sports", "Outdoor", "Entertainment"],
    "totalInterestedAttendeees": 23
  },
  {
    "eventID": "EVT014",
    "eventName": "Harlem Gospel Concert",
    "eventLocation": "Harlem, NYC",
    "eventDate": "2024-11-05",
    "eventPrice": "$45",
    "eventImageURL": "https://images.pexels.com/photos/4028878/pexels-photo-4028878.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Art & Culture", "Music", "Faith & Spirituality"],
    "totalInterestedAttendeees": 48
  },
  {
    "eventID": "EVT015",
    "eventName": "NYC Marathon",
    "eventLocation": "Various Locations, NYC",
    "eventDate": "2024-11-03",
    "eventPrice": "Free",
    "eventImageURL": "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "eventCategories": ["Sports", "Outdoor"],
    "totalInterestedAttendeees": 183
  }
];

export default function AllExperiences() {

  return (
    <div className="flex flex-col items-center justify-center">

      <div className="container">
        {/* category icon container - select to show category-specific events */}
      </div>
    
      <div className="container">
        {experiences.map(experience => 
          <div className="card card-compact bg-base-100 w-100 shadow-xl mx-10">
            <figure>
              <img
                src={experience.eventImageURL}
                alt={experience.eventName} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{experience.eventName}</h2>
              <div className="flex flex-row flex-wrap">{experience.eventCategories?.map(category => (
                <span className="badge badge-outline m-0.5">{category}</span>
              ))}</div>
              <p>{experience.eventDate}</p>
              <p>{experience.eventLocation}</p>
              <p>{experience.eventPrice}</p>
              <p>{experience.totalInterestedAttendeees} Interested Locals</p>
            </div>
          </div>
        )}
        
      </div>

    </div>
  )
}
