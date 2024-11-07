import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function convertCategoriesStringToArray(categoriesString) {
  if (!categoriesString) {
    console.error("Invalid categories string");
    return [];
  } else {
    return categoriesString.split(" | ");
  }
}
async function categorizeAndLinkEvent(eventId, categoriesString) {
  const categories = convertCategoriesStringToArray(categoriesString);

  const categoryMappings = {
    Entertainment: [
      "Theater",
      "Games",
      "Festivals",
      "Concerts",
      "Movies Under the Stars",
    ],

    "Food & Drink": ["Food"],

    "Sports & Fitness": [
      "Baseball/Softball",
      "Basketball/Netball",
      "Bicycling",
      "Boxing/Wrestling",
      "Cheerleading/Gymnastics",
      "Football",
      "Handball",
      "Hockey",
      "Strength Training/Weightlifting",
      "Swimming/Aquatics",
      "Tennis/Racquet Sports",
      "Volleyball",
      "Track & Field",
      "Yoga & Pilates Classes",
      "Walking",
      "Skating/Blading",
      "Soccer",
      "Social Sports",
      "Sports",
      "Sports Camps",
      "Martial Arts",
      "Pickleball",
      "Running/Jogging",
      "Dance",
      "Fitness",
    ],

    Outdoor: [
      "Waterfront",
      "Birding",
      "Wildlife",
      "Gardening",
      "Nature",
      "Outdoor Fitness",
      "Fishing",
      "It's My Park",
    ],

    "Health & Wellness": ["Seniors", "Shape Up NYC"],

    Professional: ["Volunteer", "Talks"],

    "Travel & Adventure": [
      "Adventure Courses/Rock Climbing",
      "Hiking",
      "Tours",
      "Markets",
      "Urban Park Rangers",
    ],

    "Education & Learning": [
      "Workshops",
      "STEM Classes",
      "Dance Classes",
      "Exercise Classes",
      "Community Input Meetings",
      "Education",
      "Astronomy",
      "History",
      "Media Education",
    ],

    "Arts & Culture": [
      "Art",
      "Arts & Crafts",
      "Arts, Culture & Fun Series",
      "Film",
    ],
  };

  for (const category of categories) {
    for (const [categoryName, keywords] of Object.entries(categoryMappings)) {
      if (
        keywords.some((keyword) =>
          category.toLowerCase().includes(keyword.toLowerCase())
        )
      ) {
        const { data: categoryData, error: categoryError } = await supabase
          .from("Event_Categories")
          .select("category_id")
          .eq("category_name", categoryName)
          .single();

        if (categoryError) {
          console.error(
            `Error fetching category ID for ${categoryName}:`,
            categoryError
          );
          continue;
        }

        const { data: existingJunction, error: checkError } = await supabase
          .from("Event_Category_Junction")
          .select("*")
          .eq("event_id", eventId)
          .eq("category_id", categoryData.category_id)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          console.error(`Error checking existing junction:`, checkError);
          continue;
        }

        if (!existingJunction) {
          const { error: junctionError } = await supabase
            .from("Event_Category_Junction")
            .insert({ event_id: eventId, category_id: categoryData.category_id });

          if (junctionError) {
            console.error(
              `Error inserting into Event_Category_Junction:`,
              junctionError
            );
          } else {
            console.log(`Linked event ${eventId} to category ${categoryName}`);
          }
        } else {
          console.log(
            `Event ${eventId} already linked to category ${categoryName}`
          );
        }

        break;
      }
    }
  }
}

function convertToTimestamp(startDate, startTime) {
  if (!startDate || !startTime) {
    console.error("Invalid date or time format");
    return null;
  }

  try {
    let [time, period] = startTime.split(" ");
    let [hours, minutes] = time.split(":");

    if (period.toLowerCase() === "pm" && hours !== 12) {
      hours = Number(hours) + 12;
    } else if (period.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");

    const timestamp = `${startDate} ${hours}:${minutes}:00+00`;
    console.log("Timestamp:", timestamp);
    return timestamp;
  } catch (error) {
    console.error("Error converting to timestamp:", error);
    return null;
  }
}

function extractCoordinates(coordinatesString) {
  const [latitude, longitude] = coordinatesString
    .split(",")
    .map((coord) => parseFloat(coord.trim()));
  return { latitude, longitude };
}

function extractAddressComponents(geocodeResponse) {
  let streetAddress = "";
  let postalCode = "";

  if (geocodeResponse.results && geocodeResponse.results.length > 0) {
    const addressComponents = geocodeResponse.results[0];

    streetAddress = addressComponents["formatted_address"].split(",")[0];

    postalCode =
      addressComponents["address_components"].find((component) =>
        component.types.includes("postal_code")
      )?.long_name || "";
  }

  return { streetAddress, postalCode };
}

async function getStreetAddressFromCoordinates(latitude, longitude) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const { streetAddress, postalCode } = extractAddressComponents(data);

    return { streetAddress, postalCode };
  } catch (error) {
    console.error("Error fetching address:", error);
    return { streetAddress: null, postalCode: null };
  }
}

async function processEvents(jsonData) {
  for (const event of jsonData) {
    const eventTime = convertToTimestamp(event.startdate, event.starttime);
    const { latitude, longitude } = extractCoordinates(event.coordinates);
    const { streetAddress, postalCode } = await getStreetAddressFromCoordinates(
      latitude,
      longitude
    );

    const eventData = {
      event_name: event.title,
      event_details: event.description,
      event_url: event.link,
      is_free: true,
      event_price: 0,
      event_time: eventTime,
      event_image_url:
        event.image ||
        "https://images.pexels.com/photos/4451501/pexels-photo-4451501.jpeg?auto=compress&cs=tinysrgb&w=600",
      event_host: "NYC Parks and Recreation",
      event_location_name: event.location,
      event_street_address: streetAddress,
      event_zip_code: Number(postalCode),
      coordinates_latitude: latitude,
      coordinates_longitude: longitude,
      event_capacity: null,
    };

    const { data: existingEvent, error } = await supabase
      .from("Events")
      .select("*")
      .eq("event_url", event.link)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking event:", error.message);
      continue;
    }

    if (existingEvent) {
      const { error: updateError } = await supabase
        .from("Events")
        .update(eventData)
        .eq("event_url", event.link);

      if (updateError) {
        console.error(
          `Error updating event: ${event.title}`,
          updateError.message
        );
      } else {
        console.log(`Updated event: ${event.title}`);
      }
    } else {
      const { error: insertError } = await supabase
        .from("Events")
        .insert(eventData);

      if (insertError) {
        console.error(
          `Error inserting event: ${event.title}`,
          insertError.message
        );
      } else {
        console.log(`Inserted new event: ${event.title}`);
      }
    }

    console.log(`Inserted new event: ${event.title}`);
    const { data: newEvent, error: fetchError } = await supabase
      .from("Events")
      .select("event_id")
      .eq("event_url", event.link)
      .single();

    if (fetchError) {
      console.error(`Error fetching new event ID:`, fetchError);
    } else {
      await categorizeAndLinkEvent(newEvent.event_id, event.categories);
    }
  }
}

export async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const text = await file.text();
  const jsonData = JSON.parse(text);

  await processEvents(jsonData);
}
