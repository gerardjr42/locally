const experiences = [
  {
    eventID: "EVT001",
    eventName: "Central Park Jazz Festival",
    eventLocation: "Central Park, NYC",
    eventDate: "2024-10-15",
    eventPrice: "$50",
    eventImageURL:
      "https://images.pexels.com/photos/9419374/pexels-photo-9419374.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Music", "Entertainment", "Outdoor"],
    totalInterestedAttendeees: 88,
  },
  {
    eventID: "EVT002",
    eventName: "Brooklyn Art Walk",
    eventLocation: "DUMBO, Brooklyn",
    eventDate: "2024-11-02",
    eventPrice: "Free",
    eventImageURL:
      "https://images.pexels.com/photos/6037463/pexels-photo-6037463.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Art & Culture", "Outdoor"],
    totalInterestedAttendeees: 54,
  },
  {
    eventID: "EVT003",
    eventName: "Food Truck Fiesta",
    eventLocation: "Astoria Park, Queens",
    eventDate: "2024-10-10",
    eventPrice: "$10",
    eventImageURL:
      "https://images.pexels.com/photos/2227960/pexels-photo-2227960.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Food & Drink", "Outdoor"],
    totalInterestedAttendeees: 72,
  },
  {
    eventID: "EVT004",
    eventName: "Manhattan Book Fair",
    eventLocation: "Union Square, NYC",
    eventDate: "2024-10-22",
    eventPrice: "$15",
    eventImageURL:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Art & Culture", "Entertainment", "Education"],
    totalInterestedAttendeees: 49,
  },
  {
    eventID: "EVT005",
    eventName: "Indie Film Screening",
    eventLocation: "Williamsburg Cinemas, Brooklyn",
    eventDate: "2024-10-30",
    eventPrice: "$20",
    eventImageURL:
      "https://images.pexels.com/photos/7513460/pexels-photo-7513460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Art & Culture", "Entertainment"],
    totalInterestedAttendeees: 156,
  },
  {
    eventID: "EVT006",
    eventName: "Wine & Paint Night",
    eventLocation: "SoHo, NYC",
    eventDate: "2024-11-12",
    eventPrice: "$40",
    eventImageURL:
      "https://images.pexels.com/photos/6925088/pexels-photo-6925088.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    eventCategories: ["Art & Culture", "Food & Drink", "Nightlife"],
    totalInterestedAttendeees: 12,
  },
  {
    eventID: "EVT007",
    eventName: "Rock Climbing Challenge",
    eventLocation: "The Cliffs at LIC, Queens",
    eventDate: "2024-11-04",
    eventPrice: "$35",
    eventImageURL:
      "https://images.pexels.com/photos/4046276/pexels-photo-4046276.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Sports & Fitness"],
    totalInterestedAttendeees: 30,
  },
  {
    eventID: "EVT008",
    eventName: "Yoga in the Park",
    eventLocation: "Battery Park, NYC",
    eventDate: "2024-10-08",
    eventPrice: "Free",
    eventImageURL:
      "https://images.pexels.com/photos/1472887/pexels-photo-1472887.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Sports & Fitness", "Health & Wellness", "Outdoor"],
    totalInterestedAttendeees: 7,
  },
  {
    eventID: "EVT009",
    eventName: "Rooftop Movie Night",
    eventLocation: "Skyline Drive-In, Brooklyn",
    eventDate: "2024-10-25",
    eventPrice: "$25",
    eventImageURL:
      "https://images.pexels.com/photos/33129/popcorn-movie-party-entertainment.jpg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Entertainment", "Outdoor"],
    totalInterestedAttendeees: 31,
  },
  {
    eventID: "EVT010",
    eventName: "Halloween Haunted House",
    eventLocation: "NYC Haunted Hayride, Randall's Island",
    eventDate: "2024-10-31",
    eventPrice: "$60",
    eventImageURL:
      "https://images.pexels.com/photos/5435192/pexels-photo-5435192.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Entertainment", "Outdoor"],
    totalInterestedAttendeees: 27,
  },
  {
    eventID: "EVT011",
    eventName: "Gotham Comic Convention",
    eventLocation: "Javits Center, NYC",
    eventDate: "2024-11-15",
    eventPrice: "$75",
    eventImageURL:
      "https://images.pexels.com/photos/954848/pexels-photo-954848.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
    eventCategories: ["Art & Culture", "Entertainment"],
    totalInterestedAttendeees: 118,
  },
  {
    eventID: "EVT012",
    eventName: "Broadway Musical Night",
    eventLocation: "Shubert Theatre, NYC",
    eventDate: "2024-10-20",
    eventPrice: "$120",
    eventImageURL:
      "https://images.pexels.com/photos/6899918/pexels-photo-6899918.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Art & Culture", "Entertainment"],
    totalInterestedAttendeees: 65,
  },
  {
    eventID: "EVT013",
    eventName: "Outdoor Ice Skating",
    eventLocation: "Bryant Park, NYC",
    eventDate: "2024-12-01",
    eventPrice: "$30",
    eventImageURL:
      "https://images.pexels.com/photos/6289768/pexels-photo-6289768.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Sports & Fitness", "Outdoor", "Entertainment"],
    totalInterestedAttendeees: 23,
  },
  {
    eventID: "EVT014",
    eventName: "Harlem Gospel Concert",
    eventLocation: "Harlem, NYC",
    eventDate: "2024-11-05",
    eventPrice: "$45",
    eventImageURL:
      "https://images.pexels.com/photos/4028878/pexels-photo-4028878.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Art & Culture", "Music", "Faith & Spirituality"],
    totalInterestedAttendeees: 48,
  },
  {
    eventID: "EVT015",
    eventName: "NYC Marathon",
    eventLocation: "Various Locations, NYC",
    eventDate: "2024-11-03",
    eventPrice: "Free",
    eventImageURL:
      "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=1200",
    eventCategories: ["Sports & Fitness", "Outdoor"],
    totalInterestedAttendeees: 183,
  },
];

const experiencesCategories = [
  "Entertainment",
  "Food & Drink",
  "Sports & Fitness",
  "Outdoor",
  "Health & Wellness",
  "Faith & Spirituality",
  "Professional",
  "Music",
  "Nightlife",
  "Travel & Adventure",
  "Education",
  "Art & Culture",
];

const categoryIcons = {
  Entertainment: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
      />
    </svg>
  ),
  "Food & Drink": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z"
      />
    </svg>
  ),
  "Sports & Fitness": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
      />
    </svg>
  ),
  Outdoor: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  ),
  "Health & Wellness": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  ),
  "Faith & Spirituality": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  ),
  Professional: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
      />
    </svg>
  ),

  Music: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
      />
    </svg>
  ),
  Nightlife: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  ),
  "Travel & Adventure": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64"
      />
    </svg>
  ),
  Education: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
      />
    </svg>
  ),
  "Art & Culture": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
      />
    </svg>
  ),
};

export default function AllExperiences() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="m-4">
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      <div
        name="filterExperiencesOptions"
        className="container flex flex-row justify-left overflow-scroll justify-evenly my-2 py-2"
      >
        <div className="flex flex-col items-center cursor-pointer px-1">
          <label className="flex flex-col items-center cursor-pointer">
            <input type="checkbox" className="hidden" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p className="mt-1 text-xs text-center w-20">Free</p>
          </label>
        </div>

        {experiencesCategories.map((category) => (
          <div
            key={category}
            className="flex flex-col items-center cursor-pointer px-1"
          >
            <label className="flex flex-col items-center cursor-pointer">
              <input type="radio" className="hidden" name="category" />
              {categoryIcons[category]}
              <p className="mt-1 text-xs text-center w-20 line-clamp-2">
                {category}
              </p>
            </label>
          </div>
        ))}
      </div>

      <div className="container flex flex-row justify-between m-1 px-4 pb-2">
        <h2 className="text-xl font-bold align-middle">Experiences For You</h2>
        <div className="flex items-center border-2 border-black rounded-full px-3 py-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
            />
          </svg>
        </div>
      </div>

      <div className="container flex flex-row flex-wrap justify-evenly px-2">
        {experiences.map((experience) => (
          <div className="card card-compact bg-base-100 w-100 shadow-xl mx-2 my-3">
            <figure className="relative">
              <img src={experience.eventImageURL} alt={experience.eventName} />
              <div className="absolute bottom-0 left-1 flex flex-col justify-start p-2">
                {experience.eventCategories?.map((category) => (
                  <span
                    key={category}
                    className="badge m-1 bg-white text-gray-600"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <div className="absolute top-2 right-5 flex justify-end p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="white"
                  class="size-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
              </div>
            </figure>
            <div className="card-body gap-0">
              <div className="container flex flex-row justify-between">
                <p className="text-left text-gray-500">{experience.eventDate}</p>
                <p className="text-right text-gray-500">{experience.eventPrice}</p>
              </div>
              <p className="text-lg font-bold text-gray-600">{experience.eventName}</p>
              <p className="text-left text-gray-500">{experience.eventLocation}</p>
              <div className="container flex flex-col">
                <div className="container flex flex-row justify-end">
                  <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                    <div className="avatar">
                      <div className="w-12">
                        <img src="https://randomuser.me/api/portraits/men/75.jpg" />
                      </div>
                    </div>
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content w-12">
                        <span>+{experience.totalInterestedAttendeees - 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-right text-gray-500">Ready To Connect</p>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
